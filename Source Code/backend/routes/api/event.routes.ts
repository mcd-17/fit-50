import { deleteEvent, getAdminEvents, getEventDetails, getEventList, postEvent, postInterestedEvent } from "../../controllers/event.controller";
import { Router } from "express";
import { isAdminOrEmployee, isUser } from "../../middlewares/auth.middleware";

const eventRoutes = Router();

eventRoutes.post('/add', isAdminOrEmployee, postEvent)
eventRoutes.get('/list', isAdminOrEmployee, getAdminEvents)

eventRoutes.get('/', getEventList)
eventRoutes.get('/details', getEventDetails)
eventRoutes.delete('/delete', isAdminOrEmployee, deleteEvent)

eventRoutes.post('/interest', isUser, postInterestedEvent)

export default eventRoutes;