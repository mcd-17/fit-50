import { getOrDelServiceValidator, postServiceValidator } from "../../middlewares/service.middleware";
import { delService, getService, getServices, postService } from "../../controllers/service.controller";
import { Router } from "express";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";

const serviceRoutes = Router();


serviceRoutes.get('/list', getServices)
serviceRoutes.get('/', getOrDelServiceValidator, getService)
serviceRoutes.post('/', isAdminOrEmployee, postServiceValidator, postService)
serviceRoutes.delete('/', isAdminOrEmployee, getOrDelServiceValidator, delService)


export default serviceRoutes