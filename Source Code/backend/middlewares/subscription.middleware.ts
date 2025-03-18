import validate from "./validate.middleware"
import { body, query } from "express-validator";

export const postSubscriptionValidator = validate([
    body('name').exists().notEmpty().withMessage('Subscription name is required'),
    body('price').exists().notEmpty().withMessage('Subscription amount must have a value').isNumeric().withMessage('Price must be a number'),
    body('features').exists().notEmpty().withMessage('Subscription features must have a value').isArray().withMessage('Features must be an array'),
    body('image').exists().notEmpty().withMessage('Subscription image is required'),
])

export const getOrDelSubscriptionValidator = validate([
    query('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
])
