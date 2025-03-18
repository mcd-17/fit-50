import { body, oneOf } from 'express-validator';
import validate from "./validate.middleware";
import User from '../models/user.model';


export const phoneOrEmail = [
    oneOf([
        body('email').exists().notEmpty(),
        body('phone').exists().notEmpty(),
    ], { message: 'Email/Phone is required' }),
    body('email').optional().isEmail().withMessage('Email is invalid'),
    body('phone').optional().matches(/^[0-9\-\+]{9,15}$/g).withMessage('Phone number is invalid')
]

export const findUserValidator = validate(phoneOrEmail)


export const registrationValidator = validate([
    body('name').exists().notEmpty().withMessage('Name is required'),
    oneOf([
        body('email').exists().notEmpty(),
        body('phone').exists().notEmpty(),
    ], { message: 'Email/Phone is required' }),
    body('email').optional().isEmail().withMessage('Email is invalid').custom(async value => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
            throw new Error('E-mail already in use');
        }
        return true
    }),
    body('phone').matches(/^[0-9\-\+]{9,15}$/g).withMessage('Phone number is invalid')
        .custom(async value => {
            const existingUser = await User.findOne({ phone: value });
            if (existingUser) {
                throw new Error('Phone number already in use');
            }
            return true
        }),
    body('password').exists().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm_password').exists().notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm password is invalid')
        }
        return true
    }),
    body('otp').exists().notEmpty().withMessage('Verification code is required').isLength({
        min: 4,
        max: 4
    }).withMessage('Verification code must be 4 characters long'),
    body('role').exists().withMessage('Role is required').isIn(['user', 'trainer']).withMessage('Role is invalid'),
])


export const sendOtpValidator = validate([
    body('email').optional().isEmail().withMessage('Email is invalid'),
    body('action').exists().withMessage('Action is required').isIn(['registration', 'forgot_password']).withMessage('Action is invalid'),
])


export const loginValidator = validate([
    ...phoneOrEmail,
    body('password').exists().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
])

export const verifyOtpValidator = validate([
    ...phoneOrEmail,
    body('otp').exists().notEmpty().withMessage('Verification code is required').isLength({
        min: 4,
        max: 4
    }).withMessage('Verification code must be 4 characters long'),
    body('action').exists().withMessage('Action is required').isIn(['forgot_password']).withMessage('Action is invalid'),
])

export const resetPasswordValidator = validate([
    body('token').exists().notEmpty().withMessage('Token is required').isJWT().withMessage("Invalid jwt token"),
    body('password').exists().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm_password').exists().notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm password is invalid')
        }
        return true
    }),
])


export const updateUserValidator = [
    body('name').optional().notEmpty().withMessage('Name must have a value'),
    body('phone').optional().notEmpty().withMessage('Invalid phone number'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('role').optional().isIn(['user', 'trainer', 'admin']).withMessage('Invalid role'),
    body('image').optional().isURL().withMessage('Invalid image URL'),
    body('address').optional().notEmpty().withMessage('Address must have a value'),
    body('gender').optional().isIn(['male', 'female']).withMessage('Invalid gender'),
    body('dob').optional().isISO8601().toDate().withMessage('Invalid date of birth'),
];


export const postPasswordValidator = validate([
    body('old_password', 'Old password is required').exists().notEmpty().withMessage('Old password must have a value'),
    body('new_password', 'New password is required').exists().notEmpty().withMessage('New password must have a value'),
    body('confirm_password', 'Confirm password is required').exists().notEmpty()
        .withMessage('Confirm password must have a value')
        .custom((value, { req }) => {
            if (value !== req.body.new_password) {
                throw new Error('Confirm password does not match')
            }
            return true
        })
])



// employees validator
export const employeeCreateValidator = validate([
    body('name').exists().notEmpty().withMessage('Name is required'),
    oneOf([
        body('email').exists().notEmpty(),
        body('phone').exists().notEmpty(),
    ], { message: 'Email/Phone is required' }),
    body('email').optional().isEmail().withMessage('Email is invalid').custom(async value => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
            throw new Error('E-mail already in use');
        }
        return true
    }),
    body('phone').matches(/^[0-9\-\+]{9,15}$/g).withMessage('Phone number is invalid')
        .custom(async value => {
            const existingUser = await User.findOne({ phone: value });
            if (existingUser) {
                throw new Error('Phone number already in use');
            }
            return true
        }),
    body('password').exists().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm_password').exists().notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm password is invalid')
        }
        return true
    }),
    body('permission').exists().withMessage('Permission is required').isMongoId().withMessage('Permission is invalid'),
])

export const employeeUpdateValidator = validate([
    body('name').exists().notEmpty().withMessage('Name is required'),
    oneOf([
        body('email').exists().notEmpty(),
        body('phone').exists().notEmpty(),
    ], { message: 'Email/Phone is required' }),
    body('email').optional().isEmail().withMessage('Email is invalid'),
    body('phone').optional().matches(/^[0-9\-\+]{9,15}$/g).withMessage('Phone number is invalid'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm_password').optional().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm password is invalid')
        }
        return true
    }),
    body('permission').exists().withMessage('Permission is required').isMongoId().withMessage('Permission is invalid'),

])



