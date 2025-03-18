import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { delFeature, getFeatures, postFeature } from "../../controllers/feature.controller";
import { Router } from "express";


const featureRoutes = Router();

featureRoutes.get('/list', getFeatures)
featureRoutes.post('/add', isAdminOrEmployee, postFeature)
featureRoutes.delete('/', isAdminOrEmployee, delFeature)


export default featureRoutes