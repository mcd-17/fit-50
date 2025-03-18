import { Router } from "express";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { deleteNotification, getAllNotifications, markAllNotificationAsRead, markNotificationAsRead } from "../../controllers/notification.controller";

const notificationRoutes = Router();

notificationRoutes.get('/list/admin', isAdminOrEmployee, getAllNotifications)
notificationRoutes.post("/read", isAdminOrEmployee, markNotificationAsRead)
notificationRoutes.post("/read-all", isAdminOrEmployee, markAllNotificationAsRead)
notificationRoutes.delete("/delete", isAdminOrEmployee, deleteNotification)
export default notificationRoutes;

