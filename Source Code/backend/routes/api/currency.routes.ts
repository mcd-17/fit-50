import { Router } from "express";
import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { delCurrency, getCurrencyList, postCurrency } from "../../controllers/currency.controller";

const currencyRoutes = Router();

currencyRoutes.get('/list', getCurrencyList)
currencyRoutes.post('/', isAdminOrEmployee, postCurrency)
currencyRoutes.delete('/', isAdminOrEmployee, delCurrency)


export default currencyRoutes;