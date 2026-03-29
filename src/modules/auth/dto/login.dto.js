import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class LoginDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      "string.email": "Invalid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string()
      .trim()

      .min(8)
      .required()
      .messages({
        "string.min": "Password must be minimum of 8 chars",
        "string.empty": "Password is required",
      }),
  });
}
export default LoginDto;
