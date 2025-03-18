import { Router } from "express";
import { delFaq, getFaq, getFaqs, postFaq } from "../../controllers/faq.controller";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";


const faqRoutes = Router();

faqRoutes.get('/list', getFaqs)
faqRoutes.get('/', getFaq)
faqRoutes.post('/', isAdminOrEmployee, postFaq)
faqRoutes.delete('/', isAdminOrEmployee, delFaq)

export default faqRoutes;