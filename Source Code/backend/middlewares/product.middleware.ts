import Product from "../models/product/product.model";
import User from "../models/user.model";
import validate from "./validate.middleware"
import { body, query } from "express-validator";

export const postProductReviewValidator = validate([
    body('product').exists().notEmpty().withMessage('Product is required').isMongoId().withMessage('Invalid product').custom(async value => {
        const existingProduct = await Product.findById
            (value);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        return true
    }),
    body('rating').exists().notEmpty().withMessage('Rating is required').isNumeric().withMessage('Rating must be a number'),
    body('review').exists().notEmpty().withMessage('Review is required'),
    body('user').exists().notEmpty().withMessage('User is required').isMongoId().withMessage('Invalid user').custom(async value => {
        const existingUser = await User
            .findById(value);
        if (!existingUser) {
            throw new Error('User not found');
        }
        return true
    }),
])

export const deleteProductReviewValidator = validate([
    query('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
])