import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be minimum of 2 chars",
      "string.max": "Name should not exceed 50 chars",
    }),
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
    roles: Joi.string()
      .valid("customer", "seller", "admin")
      .default("customer")
      .messages({
        "any.only": "Role must be either customer, seller or admin",
      }),
  });
}
export default RegisterDto;
