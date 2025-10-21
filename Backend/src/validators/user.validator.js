import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  avatarUrl: Joi.string().uri().optional(),
  password: Joi.string().min(8).optional(),
});
