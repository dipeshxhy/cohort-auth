import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ForgotDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
    }),
  });
}

export default ForgotDto;
