import { getAdminDashboard, getTrainerDashboard } from "../../controllers/dashboard.controller";
import { Router } from "express";
import { isAdminOrEmployee, isTrainer } from "../../middlewares/auth.middleware";

const dashboardRoutes = Router();

dashboardRoutes.get('/trainer', isTrainer, getTrainerDashboard)
dashboardRoutes.get('/admin', isAdminOrEmployee, getAdminDashboard)

export default dashboardRoutes;