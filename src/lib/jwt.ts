import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

type Payload = {
  userId: string;
  role: "ADMIN" | "USER";
};

export async function signJwt(payload: Payload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
}

export async function verifyJwt(token: string): Promise<Payload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
