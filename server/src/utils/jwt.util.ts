import jwt from "jsonwebtoken";
const secret = process.env.SECRET || "1234554321";

async function signJWT(payload: string) {
  try {
    const signed = await jwt.sign(payload, secret);
    return signed;
  } catch (error: any) {
    throw new Error(error.message || "Couldnt Sign JWT");
  }
}

async function decodeJWT(signedJWT: string) {
  try {
    const decoded = await jwt.decode(signedJWT);
    return decoded;
  } catch (error: any) {
    throw new Error(error.message || "Couldnt Decode JWT");
  }
}

export { signJWT, decodeJWT };
