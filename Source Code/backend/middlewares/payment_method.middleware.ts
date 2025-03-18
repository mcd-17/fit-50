import { body, query } from "express-validator";
import validate from "./validate.middleware";

const methodRules = [
    body('name', 'Name is required').exists().notEmpty().withMessage('Name is invalid').isString().withMessage('Name must be a string'),
    body('type', 'Type is required').exists().notEmpty().withMessage('Type is invalid').isIn(['stripe', 'paypal', 'razorpay', 'sslcommerz', 'mollie']).withMessage('Invalid type'),
    body('config', 'config is required')
        .if((_, { req }) => req.body.type === 'paypal')
        .exists().notEmpty().withMessage('config is invalid')
        .isObject().withMessage('config must be an object'),
    body('config.clientId', 'Paypal Client ID is required')
        .if((_, { req }) => req.body.type === 'paypal')
        .exists().notEmpty().withMessage('Paypal Client ID is invalid')
        .isString().withMessage('Paypal Client ID must be a string'),
    body('config.clientSecret', 'Paypal Client Secret is required')
        .if((_, { req }) => req.body.type === 'paypal')
        .exists().notEmpty().withMessage('Paypal Client Secret is invalid')
        .isString().withMessage('Paypal Client Secret must be a string'),
    body('config.mode', 'Paypal Mode is required')
        .if((_, { req }) => req.body.type === 'paypal')
        .exists().notEmpty().withMessage('Paypal Mode is invalid')
        .isIn(['sandbox', 'live']).withMessage('Invalid Paypal Mode'),
    body('config', 'config is required')
        .if((_, { req }) => req.body.type === 'stripe')
        .exists().notEmpty().withMessage('config is invalid')
        .isObject().withMessage('config must be an object'),
    body('config.clientId', 'Stripe Client ID is required')
        .if((_, { req }) => req.body.type === 'stripe')
        .exists().notEmpty().withMessage('Stripe Client ID is invalid')
        .isString().withMessage('Stripe Client ID must be a string'),
    body('config.clientSecret', 'Stripe Client Secret is required')
        .if((_, { req }) => req.body.type === 'stripe')
        .exists().notEmpty().withMessage('Stripe Client Secret is invalid')
        .isString().withMessage('Stripe Client Secret must be a string'),
    body('config.mode', 'Stripe Mode is required')
        .if((_, { req }) => req.body.type === 'stripe')
        .exists().notEmpty().withMessage('Stripe Mode is invalid')
        .isIn(['sandbox', 'live']).withMessage('Invalid Stripe Mode'),
]

export const postPaymentMethodValidator = validate(methodRules)

export const getOrDelPaymentMethodValidator = validate([
    query('_id', 'ID is required').exists().notEmpty().withMessage('ID is invalid').isMongoId().withMessage('ID must be a valid MongoID')
])