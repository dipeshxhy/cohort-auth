import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ResetDto extends BaseDto {
  static schema = Joi.object({
    newPassword: Joi.string().trim().min(8).required().messages({
      "string.empty": "New Password is required",
      "string.min": "Minimum 8 chars long",
    }),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Password does not match",
        "any.required": "please confirm your password",
      }),
  });
}

export default ResetDto;
