const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(60).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 60 characters',
    }),

    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be valid',
    }),

    password: Joi.string().min(6).max(128).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be valid',
    }),

    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};