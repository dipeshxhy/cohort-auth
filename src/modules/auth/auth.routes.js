import { Router } from "express";
import * as controller from "./auth.controller.js";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";
import ForgotDto from "./dto/forgot.dto.js";
import ResetDto from "./dto/reset.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
router.post("/login", validate(LoginDto), controller.login);
router.get("/verify-email/:token", controller.verify);

router.get("/getMe", authenticate, controller.getMe);

router.post("/logout", authenticate, controller.logout);

router.get("/refresh-token", controller.refresh);

router.post("/forgot-password", validate(ForgotDto), controller.forgotPassword);

router.post(
  "/reset-password/:token",
  validate(ResetDto),
  controller.resetPassword,
);
export default router;
