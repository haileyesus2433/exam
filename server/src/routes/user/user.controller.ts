import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { UserSchema } from "../../utils/validations";
import { hashPassword } from "../../utils/bcrypt.util";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Registers a new user in the system.
 *
 * @param req - The Express request object containing the user data in the request body.
 * @param res - The Express response object to send the created user data.
 * @returns A JSON response with the created user data or an error if the registration fails.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await UserSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const { role, email, password, avatar } = result.data;

    const hashedPassword = await hashPassword(password);

    const createdUser = await prisma.user.create({
      data: {
        role,
        email,
        password: hashedPassword,
        avatar,
      },
    });
    res.status(201).json(createdUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Adds or removes a video from the user's favorites.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns The updated user object with the modified favorites.
 */
export const addToFavourites = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const videoId = parseInt(req.body.videoId);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favourites: true },
    });

    const isVideoInFavorites = user?.favourites.some(
      (video) => video.id === videoId
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favourites: isVideoInFavorites
          ? { disconnect: { id: videoId } }
          : { connect: { id: videoId } },
      },
      include: { favourites: true },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const addToWatchLater = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const videoId = parseInt(req.body.videoId);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { watchLater: true },
    });

    const isVideoInWatchLater = user?.watchLater.some(
      (video) => video.id === videoId
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        watchLater: isVideoInWatchLater
          ? { disconnect: { id: videoId } }
          : { connect: { id: videoId } },
      },
      include: { watchLater: true },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
