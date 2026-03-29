import APIError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw APIError.unAuthorized("Not authenticated");
  }
  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw APIError.unAuthorized("User no longer exists");
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (err) {
    throw APIError.unAuthorized("Invalid or expired token");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw APIError.forbidden({
        message: "You don't have permission to access this resource",
      });
    }
    next();
  };
};

export { authenticate, authorize };
