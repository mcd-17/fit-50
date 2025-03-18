import { deleteNewsletter, getNewsletters, postNewsletter } from "../../controllers/newsletter.controller";
import { Router } from "express";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";


const newsletterRoutes = Router();

newsletterRoutes.get('/list',isAdminOrEmployee, getNewsletters)
newsletterRoutes.post('/', postNewsletter)
newsletterRoutes.delete('/', isAdminOrEmployee,deleteNewsletter)

export default newsletterRoutes;

