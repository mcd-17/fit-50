import { deleteSchedule, getAllSchedules, getAvailableTimeSlots, getEvents, getSchedule, getTrainersScheduleList, postSchedule } from '../../controllers/schedule.controller';
import Router from 'express';
import { isAdminOrEmployee, isTrainer } from '../../middlewares/auth.middleware';
import { postScheduleValidator } from '../../middlewares/schedule.middleware';

const scheduleRoutes = Router();

scheduleRoutes.post('/', isAdminOrEmployee, postScheduleValidator, postSchedule)
scheduleRoutes.get('/all', isAdminOrEmployee, getAllSchedules)
scheduleRoutes.delete('/', isAdminOrEmployee, deleteSchedule)
scheduleRoutes.get('/', getSchedule)

scheduleRoutes.get('/available-time-slots', isAdminOrEmployee, getAvailableTimeSlots)
scheduleRoutes.get('/events', getEvents)

scheduleRoutes.get('/trainers', isTrainer, getTrainersScheduleList)

export default scheduleRoutes;