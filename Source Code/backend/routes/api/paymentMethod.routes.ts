import { Router } from "express";
import { isAdminOrEmployee, isAnyUser } from "../../middlewares/auth.middleware";
import { getOrDelPaymentMethodValidator, postPaymentMethodValidator } from "../../middlewares/payment_method.middleware";
import { deletePaymentMethod, getPaymentMethod, getPaymentMethods, getPaymentUserMethods, postPaymentMethod } from "../../controllers/paymentMethod.controller";

const paymentRoutes = Router();


paymentRoutes.get('/method/list', isAdminOrEmployee, getPaymentMethods)
paymentRoutes.get('/method', isAdminOrEmployee, getOrDelPaymentMethodValidator, getPaymentMethod)
paymentRoutes.post('/method', isAdminOrEmployee, postPaymentMethodValidator, postPaymentMethod)
paymentRoutes.delete('/method', isAdminOrEmployee, getOrDelPaymentMethodValidator, deletePaymentMethod)


paymentRoutes.get('/method/user/list', isAnyUser, getPaymentUserMethods)

export default paymentRoutes;