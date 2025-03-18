import { Router } from "express";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { getMailSettings, postMailSettings } from "../../controllers/mailCredential.controller";

const mailSettingRoutes = Router()

mailSettingRoutes.get('/', getMailSettings)
mailSettingRoutes.post('/', isAdminOrEmployee, postMailSettings)

export default mailSettingRoutes