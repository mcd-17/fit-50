import {body, query} from "express-validator";
import validate from "../validate.middleware";

export const postAttendanceSettingsValidator = validate([
    body('checkInTime').exists().notEmpty().withMessage('Check in time is required'),
    body('checkOutTime').exists().notEmpty().withMessage('Check out time is required'),
    body('weekend').exists().isArray().notEmpty().withMessage('Weekend is required'),
    
])