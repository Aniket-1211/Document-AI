import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

const createToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };
};

const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};

export {
  createToken,
  verifyToken,
  getCookieOptions,
  clearAuthCookie,
};
