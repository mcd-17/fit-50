import { getSettings, postSettings } from "../../controllers/settings.controller";
import { Router } from "express";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { getAllThemes, updateThemeStatus } from "../../controllers/theme.controler";

const settingsRoutes = Router()

settingsRoutes.get('/', getSettings)
settingsRoutes.post('/', isAdminOrEmployee, postSettings)
settingsRoutes.get('/themes', getAllThemes)
settingsRoutes.post('/themes/status', isAdminOrEmployee, updateThemeStatus)

export default settingsRoutes