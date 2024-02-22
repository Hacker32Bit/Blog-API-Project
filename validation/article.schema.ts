import Joi from "joi";

export const createArticleSchema = Joi.object({
    title: Joi.string().min(10).max(100).required(),
    content: Joi.string().min(100).required(),
    categories: Joi.array().items(Joi.string().required()).required(), 
})

export const updateArticleSchema = Joi.object({
    title: Joi.string().min(10).max(100),
    content: Joi.string().min(100),
    categories: Joi.array().items(Joi.string().required()), 
})