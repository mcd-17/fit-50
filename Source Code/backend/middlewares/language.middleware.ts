import validate from "./validate.middleware"
import { body, query } from "express-validator";

export const postLanguageValidator = validate([
    body('name', 'Name is required').exists().notEmpty().withMessage('Name cannot be empty'),
    body('code', 'Code is required').exists().notEmpty().withMessage('Code cannot be empty'),
    body('flag', 'Flag is required').exists().notEmpty().withMessage('Flag cannot be empty'),
    body('rtl').optional().notEmpty().withMessage('RTL cannot be empty').isBoolean().withMessage('RTL must be boolean'),
])

export const getOrDelLanguageValidator = validate([
    query('_id', '_id is required').exists().notEmpty().withMessage('_id cannot be empty').isMongoId().withMessage('Invalid _id'),
])