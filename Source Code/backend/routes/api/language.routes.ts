import { Router } from "express";
import { deleteLanguage, getLanguage, getLanguageList, getLanguageTranslations, getPublicLanguageList, postLanguage, translateLanguage } from "../../controllers/language.controller";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { postLanguageValidator } from "../../middlewares/language.middleware";



const languageRoutes = Router();

languageRoutes.get('/list', isAdminOrEmployee, getLanguageList)
languageRoutes.get('/translations', getLanguageTranslations)
languageRoutes.get('/', isAdminOrEmployee, getLanguage)
languageRoutes.post('/', isAdminOrEmployee, postLanguage)
languageRoutes.delete('/', isAdminOrEmployee, deleteLanguage)

languageRoutes.post('/translate', translateLanguage)
languageRoutes.get('/languages', getPublicLanguageList)

export default languageRoutes;