import Joi from "joi"

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    nickName: Joi.string().min(3).max(50).required(),
    age: Joi.number().min(18).max(70),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});