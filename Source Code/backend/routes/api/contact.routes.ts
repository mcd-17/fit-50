import { Router } from "express";
import { delContact, getContact, getContacts, postContact, postReplyContact } from "../../controllers/contact.controller";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { getOrDelContactValidator, patchContactValidator, postContactValidator } from "../../middlewares/contact.middleware";



const contactRoutes = Router();

contactRoutes.get('/list', isAdminOrEmployee, getContacts)
contactRoutes.get('/', isAdminOrEmployee, getOrDelContactValidator, getContact)
contactRoutes.post('/', postContactValidator, postContact)
contactRoutes.post('/reply', isAdminOrEmployee, patchContactValidator, postReplyContact)
contactRoutes.delete('/', isAdminOrEmployee, getOrDelContactValidator, delContact)


export default contactRoutes;