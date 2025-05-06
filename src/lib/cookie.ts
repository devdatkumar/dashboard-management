import { serialize } from "cookie";

const generateCookie = (token: string) => {
  return serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
    sameSite: "strict",
  });
};

export default generateCookie;
