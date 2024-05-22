import { NextFunction, Request as ExpressRequest, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { comparePassword } from "../utils/bcrypt.util";
import { signJWT, decodeJWT } from "../utils/jwt.util";
import { LoginSchema } from "../utils/validations";

const prisma = new PrismaClient();

interface Request extends ExpressRequest {
  user?: User;
}

/**
 * Handles the login process for a user.
 *
 * @param req - The Express request object containing the user's email and password.
 * @param res - The Express response object to send the login result.
 * @returns A JSON response with the authenticated user and a JWT token, or an error message.
 */
async function login(req: Request, res: Response) {
  try {
    const result = await LoginSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("A user with that email does not exist");
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect Password");
    }

    const token = await signJWT({
      userId: user.id,
      role: user.role,
    });

    return res.status(200).json({ user, token });
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
}

/**
 * Middleware function to authenticate a request using a JWT token.
 *
 * This middleware function is responsible for verifying the JWT token in the
 * `Authorization` header of the incoming request. If a valid token is found,
 * the middleware will attach the corresponding user data to the `req.user`
 * property, allowing subsequent middleware functions to access the user
 * information.
 *
 * If no token is provided or the token is invalid, the middleware will return
 * a 400 Bad Request response with the appropriate error message.
 *
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Resolves when the middleware has completed its
 *   processing.
 */
async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("No Token Provided");
    }
    const decodedData = await decodeJWT(token);
    if (decodedData) {
      const userData = decodedData;
      const user = await prisma.user.findUnique({
        where: { id: userData.userId },
      });
      if (user) {
        req.user = user;
        next();
        return;
      }
    }
    throw new Error("Invalid Token");
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
}

/**
 * Middleware function to check if the current user has the "admin" role.
 * If the user is an admin, the middleware will call `next()` to allow the request to proceed.
 * If the user is not an admin, the middleware will return a 403 Forbidden response.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} - Resolves when the middleware has completed.
 */
async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role === "admin") {
      next();
      return;
    }
    return res.status(403).json({ message: "Unauthorized" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json(error.message);
  }
}

export { login, isAuthenticated, isAdmin };
