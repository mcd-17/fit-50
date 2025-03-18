import validate from "./validate.middleware";
import {body} from "express-validator";


export const postPageValidator = validate([
    body('title', 'Title is required').exists().notEmpty().withMessage('Title is required').isString().withMessage("Title must be a string"),
    body('slug', 'Slug is required').exists().notEmpty().withMessage('Slug is required').isString().withMessage("Slug must be a string"),
    body('content_type', 'Content type is required').exists().notEmpty().withMessage('Content type is required').isIn(['text', 'html', 'json']).withMessage("Content type must be one of text, html, json"),
    body('content', 'Content is required').exists().notEmpty().withMessage('Content is required'),
])


export const patchPageValidator = validate([
    body('slug', 'Slug is required').exists().notEmpty().withMessage('Slug is required').isString().withMessage("Slug must be a string"),
    body('title').optional().notEmpty().withMessage('Title is required').isString().withMessage("Title must be a string"),
    body('content_type').optional().notEmpty().withMessage('Content type is required').isIn(['text', 'html', 'json']).withMessage("Content type must be one of text, html, json"),
    body('content').optional().notEmpty().withMessage('Content is required'),
])