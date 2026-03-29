import crypto from "node:crypto";
import APIError from "./api-error.js";
import jwt from "jsonwebtoken";

// hashed token
const generateHashedToken = (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};

const generateToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return { rawToken, hashedToken };
};

// access token
const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
  return token;
};

const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
  return token;
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw APIError.unAuthorized("Invalid access token");
  }
};
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw APIError.unAuthorized("Invalid refresh token");
  }
};
export {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateHashedToken,
};
