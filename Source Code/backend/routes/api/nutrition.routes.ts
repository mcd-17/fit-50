import { deleteNutrition, editNutrition, getNutritionDetails, getNutritionList, getUserNutritionList, postNutrition } from "../../controllers/nutrition.controller";
import { Router } from "express";
import { isTrainer, isUser } from "../../middlewares/auth.middleware";


const nutritionRoutes = Router();

nutritionRoutes.post('/add', isTrainer, postNutrition)
nutritionRoutes.post('/edit', isTrainer, editNutrition)
nutritionRoutes.get('/list', isTrainer, getNutritionList)
nutritionRoutes.get('/user/list', isUser, getUserNutritionList)
nutritionRoutes.delete('/delete', isTrainer, deleteNutrition)
nutritionRoutes.get('/details', isTrainer, getNutritionDetails)


export default nutritionRoutes