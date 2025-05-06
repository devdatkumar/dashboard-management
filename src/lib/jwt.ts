import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type Payload = {
  userId: string;
  role: "ADMIN" | "USER";
};

export function signJwt(payload: Payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJwt(token: string): Payload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Payload;
  } catch {
    return null;
  }
}
