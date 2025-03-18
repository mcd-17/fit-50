import {Router} from "express";
import {isAdminOrEmployee} from "../../middlewares/auth.middleware";
import {patchPageValidator, postPageValidator} from "../../middlewares/page.middleware";
import {deletePage, getPage, getPages, postPage} from "../../controllers/page.controller";

const pageRoutes = Router()

pageRoutes.get('/list', isAdminOrEmployee, getPages)
pageRoutes.get('/', getPage)
pageRoutes.post('/', isAdminOrEmployee, postPage)
pageRoutes.delete('/', isAdminOrEmployee, deletePage)

export default pageRoutes