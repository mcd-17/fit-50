import validate from "./validate.middleware"
import { body, query } from "express-validator";

export const postScheduleValidator = validate([
    body('day')
        .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .withMessage('Day must be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'),
    body('time_slots')
        .isIn(['9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm'])
        .withMessage('Time slot must be one of the following: 9:00 am, 10:00 am, 11:00 am, 12:00 pm, 1:00 pm, 2:00 pm, 3:00 pm, 4:00 pm, 5:00 pm, 6:00 pm, 7:00 pm, 8:00 pm'),
    body('event')
        .notEmpty()
        .withMessage('Event is required')
]);