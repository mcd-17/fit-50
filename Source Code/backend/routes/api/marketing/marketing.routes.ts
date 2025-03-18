import { Router } from "express";
import { isAdminOrEmployee } from "../../../middlewares/auth.middleware";
import { getMarketingGroups,postMarketingGroups,delMarketingGroups, getAvailableUsers, postUsers } from "../../../controllers/marketing/marketing-group.controller";
import { getMarketingSettings, updateSettings } from "../../../controllers/marketing/marketing-setting.controller";
import { deleteEmail, getAllMail, postDeliveryEmail } from "../../../controllers/marketing/marketing-mail.controller";

const marketingRoutes = Router();

marketingRoutes.get('/group/list', isAdminOrEmployee, getMarketingGroups)
marketingRoutes.post('/group/create', isAdminOrEmployee, postMarketingGroups)

marketingRoutes.delete('/group/delete', isAdminOrEmployee, delMarketingGroups)

marketingRoutes.get('/group/available-user', isAdminOrEmployee, getAvailableUsers)
marketingRoutes.post('/group/available-user', isAdminOrEmployee, postUsers)

marketingRoutes.get('/settings', isAdminOrEmployee, getMarketingSettings)
marketingRoutes.post('/settings', isAdminOrEmployee, updateSettings)


marketingRoutes.post('/send-mail', isAdminOrEmployee, postDeliveryEmail)
marketingRoutes.get('/all-mail', isAdminOrEmployee, getAllMail)
marketingRoutes.delete('/mail/delete', isAdminOrEmployee, deleteEmail)

export default marketingRoutes;