import Admins from "../models/admins/admins.mongo";
import Students from "../models/students/students.mongo";

import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signJWT, decodeJWT } from "../utils/jwt.util";

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const student = await Students.findOne({ studentId: email });
    const admin = await Admins.findOne({ email: email });

    if (!student && !admin) {
      throw new Error("A User With That Email Or ID Does Not Exist");
    }

    if (student) {
      const isPasswordCorrect = await comparePassword(
        password,
        student?.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Incorrect Password");
      }
      const token = await signJWT({
        userId: student?._id,
        role: student?.accountType,
      });
      return res.status(200).json({ user: student, token });
    }

    const isPasswordCorrect = await comparePassword(password, admin?.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect Password");
    }
    const token = await signJWT({
      userId: admin?._id,
      role: "admin",
    });
    return res.status(200).json({ user: admin, token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function isAuthenticated(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedData = await decodeJWT(token);
    if (decodedData) {
      const user = decodedData;
      const student = await Students.findOne({ _id: user.userId });
      const admin = await Admins.findOne({ _id: user.userId });
      if (student || admin) {
        req.user = user;
        res.json(user);
        // next();
        return;
      }
    }
    throw new Error("Invalid Token");
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function isLoggedIn(req, res, next) {
  try {
    const { token } = req.body;
    const decodedData = await decodeJWT(token);
    if (decodedData) {
      const user = decodedData;
      const student = await Students.findOne({ _id: user.userId });
      const admin = await Admins.findOne({ _id: user.userId });
      if (student || admin) {
        req.user = user;
        return res.status(200).json({ user: student || admin });
      }
    }
    return res.status(200).json({ user: null });
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function isAdmin(req, res, next) {
  try {
    if (req.user.role === "admin") {
      next();
      return;
    }
    return res.status(403).json({ message: "Unauthorized" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
}

async function isAgent(req, res, next) {
  try {
    if (req.user.role === "agent") {
      next();
      return;
    }
    return res.status(403).json({ message: "Unauthorized" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
}
