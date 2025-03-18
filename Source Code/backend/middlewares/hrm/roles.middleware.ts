import {body, query} from "express-validator";
import validate from "../validate.middleware";

export const postRoleValidator = validate([
    body('name').exists().notEmpty().withMessage('Name is required'),
])

export const getOrDelRoleValidator = validate([
    query('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
])