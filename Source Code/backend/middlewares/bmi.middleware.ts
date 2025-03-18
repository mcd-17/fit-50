import { body } from "express-validator";
import validate from "./validate.middleware";

export const postBmiValidator = validate([
    body('height')
        .exists().withMessage('Height is required')
        .notEmpty().withMessage('Height cannot be empty')
        .isNumeric().withMessage('Height must be a number'),

    body('weight')
        .exists().withMessage('Weight is required')
        .notEmpty().withMessage('Weight cannot be empty')
        .isNumeric().withMessage('Weight must be a number'),

    body('age')
        .exists().withMessage('Age is required')
        .notEmpty().withMessage('Age cannot be empty')
        .isNumeric().withMessage('Age must be a number'),

    body('gender')
        .exists().withMessage('Gender is required')
        .notEmpty().withMessage('Gender cannot be empty')
        .isIn(['Male', 'Female']).withMessage('Gender must be either "Male" or "Female"'),

    body('exercises')
        .exists().withMessage('Exercises is required')
        .notEmpty().withMessage('Exercises cannot be empty')
        .isString().withMessage('Exercises must be a string'),

    body('bmi.bmi')
        .exists().withMessage('BMI value is required')
        .notEmpty().withMessage('BMI cannot be empty')
        .isNumeric().withMessage('BMI must be a number'),

    body('bmi.bmr')
        .exists().withMessage('BMR is required')
        .notEmpty().withMessage('BMR cannot be empty')
        .isNumeric().withMessage('BMR must be a number'),

    body('bmi.daily_calories')
        .exists().withMessage('Daily calories are required')
        .notEmpty().withMessage('Daily calories cannot be empty')
        .isNumeric().withMessage('Daily calories must be a number'),

    body('bmi.waterIntake')
        .exists().withMessage('Water intake is required')
        .notEmpty().withMessage('Water intake cannot be empty')
        .isNumeric().withMessage('Water intake must be a number'),

    body('bmi.recommended_calories.protein')
        .exists().withMessage('Protein intake is required')
        .notEmpty().withMessage('Protein intake cannot be empty')
        .isNumeric().withMessage('Protein intake must be a number'),

    body('bmi.recommended_calories.carbs')
        .exists().withMessage('Carbohydrate intake is required')
        .notEmpty().withMessage('Carbohydrate intake cannot be empty')
        .isNumeric().withMessage('Carbohydrate intake must be a number'),

    body('bmi.recommended_calories.fats')
        .exists().withMessage('Fat intake is required')
        .notEmpty().withMessage('Fat intake cannot be empty')
        .isNumeric().withMessage('Fat intake must be a number'),
]);

