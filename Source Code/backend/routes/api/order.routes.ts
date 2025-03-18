import { adminOrderDetails, adminOrderList, molliePaymentSuccess, orderDetails, orderList, paypalPaymentCancel, paypalPaymentSuccess, postOrder, razorpayPaymentSuccess, sslCommerzPaymentSuccess, stripePaymentSuccess, updateOrderStatus } from "../../controllers/product/order.controller";
import { isAdminOrEmployee, isAnyUser } from "../../middlewares/auth.middleware";
import { Router } from "express";


const orderRoutes = Router();

orderRoutes.post('/', isAnyUser, postOrder)
orderRoutes.get('/stripe/success', isAnyUser, stripePaymentSuccess)
orderRoutes.get('/paypal/success', isAnyUser, paypalPaymentSuccess)
orderRoutes.get('/paypal/cancel', isAnyUser, paypalPaymentCancel)
orderRoutes.get('/user/list', isAnyUser, orderList)
orderRoutes.get('/user/details', isAnyUser, orderDetails)
orderRoutes.get('/admin/list', isAdminOrEmployee, adminOrderList)
orderRoutes.get('/admin/details', isAdminOrEmployee, adminOrderDetails)
orderRoutes.post('/admin/status', isAdminOrEmployee, updateOrderStatus)


orderRoutes.post('/sslcommerz/success', sslCommerzPaymentSuccess)
orderRoutes.get('/razorpay/success', razorpayPaymentSuccess)
orderRoutes.get('/mollie/success', molliePaymentSuccess)

export default orderRoutes