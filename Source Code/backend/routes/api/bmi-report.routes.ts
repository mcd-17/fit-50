import { isAnyUser } from "../../middlewares/auth.middleware";
import { deleteBMIReport, getBMIReport, saveBMIReport } from "../../controllers/bmi-report.controller";
import { Router } from "express";
import { postBmiValidator } from "../../middlewares/bmi.middleware";

const bmiRouter = Router();

bmiRouter.get('/',isAnyUser, getBMIReport)
bmiRouter.post('/',isAnyUser,postBmiValidator, saveBMIReport)
bmiRouter.delete('/delete',isAnyUser, deleteBMIReport)

export default bmiRouter