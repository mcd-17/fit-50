import validate from "./validate.middleware"
import { body, query } from "express-validator";

export const postServiceValidator = validate([
    body('name').exists().notEmpty().withMessage('Name is required'),
    body('description').exists().notEmpty().withMessage('Description is required'),

])

export const getOrDelServiceValidator = validate([
    query('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
])
