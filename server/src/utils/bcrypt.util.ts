import bcrypt from "bcryptjs";
const SALT = process.env.SALT || 10;

async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    return hashedPassword;
  } catch (error: any) {
    throw new Error(error.message || "Couldnt Hash Password");
  }
}

async function comparePassword(input: string, hashedPassword: string) {
  try {
    const result = await bcrypt.compare(input, hashedPassword);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Couldnt Compare Passwords");
  }
}

export { hashPassword, comparePassword };
