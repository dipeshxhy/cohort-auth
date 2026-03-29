import APIError from "../../common/utils/api-error.js";
import APIResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  APIResponse.created(
    res,
    "Registration successful. Please check your email to verify your account",
    user,
  );
};

// login
const login = async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  // cookie set
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  APIResponse.ok(res, "Login success", { accessToken, refreshToken });
};

// logout
const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  APIResponse.ok(res, "Logout success");
};

// verify email
const verify = async (req, res) => {
  const { token } = req.params;
  await authService.verify(token);
  APIResponse.ok(res, "Email verified successfully");
};

const getMe = async (req, res) => {
  const user = req.user;
  APIResponse.ok(res, "User profile", user);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw APIError.unAuthorized("No refresh token provided");
  }
  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshToken(refreshToken);
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  APIResponse.ok(res, "Token refreshed", {
    accessToken,
    refreshToken: newRefreshToken,
  });
};

const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body);
  APIResponse.ok(res, "Password reset email sent");
};

const resetPassword = async (req, res) => {
  const token = req.params.token;
  await authService.resetPassword({ ...req.body, token });
  APIResponse.ok(res, "Password reset successful");
};

export {
  register,
  login,
  logout,
  verify,
  getMe,
  refresh,
  forgotPassword,
  resetPassword,
};
