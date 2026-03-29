import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../../common/config/email.js";
import APIError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateHashedToken,
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";
const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw APIError.conflict("Email already exists");
  }
  // register user
  const { rawToken, hashedToken } = generateToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
    verificationTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  // send email to user with raw token
  await sendVerificationEmail(user.email, rawToken);
  const userObj = user.toObject();
  delete userObj.__v;
  delete userObj.password;
  delete userObj.verificationToken;
  return userObj;
};

// verify email
const verify = async (token) => {
  const hashedToken = generateHashedToken(token);
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  }).select("+verificationTokenExpires +verificationToken");
  if (!user) {
    throw APIError.notFound("Invalid verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });
};

// login
const login = async ({ email, password }) => {
  // check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw APIError.unAuthorized("Invalid email or password");
  }
  // somehow i will check password
  if (!user.isVerified) {
    throw APIError.forbidden("Please verify your email to login");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw APIError.unAuthorized("Invalid email or password");
  }
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });
  user.refreshToken = generateHashedToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.refreshToken;
  return { user: userObj, accessToken, refreshToken };
};

// refresh token
const refresh = async (token) => {
  if (!token) {
    throw APIError.unAuthorized("Refresh token is missing");
  }
  const decoded = verifyRefreshToken(token);
  const hashedToken = generateHashedToken(token);
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw APIError.unAuthorized("User not found");
  }
  if (user.refreshToken !== hashedToken) {
    throw APIError.unAuthorized("Invalid refresh token");
  }
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });
  user.refreshToken = generateHashedToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// logout
const logout = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");
  if (!user) {
    throw APIError.unAuthorized("User not found");
  }
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
};

// forgot password
const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw APIError.notFound("User not found");
  }
  const { rawToken, hashedToken } = generateToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save({ validateBeforeSave: false });
  // send email to user with raw token
  await sendResetPasswordEmail(user.email, rawToken);
};

// reset password
const resetPassword = async ({ token, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) {
    throw APIError.badRequest("Passwords do not match");
  }
  const hashedToken = generateHashedToken(token);
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");
  if (!user) {
    throw APIError.notFound("Invalid or expired reset token");
  }
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

export {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verify,
};
