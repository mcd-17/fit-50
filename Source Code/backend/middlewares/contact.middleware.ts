import { body, query } from "express-validator";
import validate from "./validate.middleware";

export const postContactValidator = validate([
    body('name').exists().notEmpty().withMessage('Name is required'),
    body('email').exists().notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('phone').optional().matches(/^[0-9\-\+]{9,15}$/g).withMessage('Phone number is invalid'),
    body('message').exists().notEmpty().withMessage('Message is required'),
])

export const patchContactValidator = validate([
    body('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
    body('email').exists().notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('message').exists().notEmpty().withMessage('Message is required'),
])

export const getOrDelContactValidator = validate([
    query('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
])