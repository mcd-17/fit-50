import { Router } from "express";
import { isAdminOrEmployee, isAnyUser } from "../../middlewares/auth.middleware";
import { createSubscription, deleteSubscription, getSubscription, getSubscriptionList, getSubscriptions } from "../../controllers/subscription.controller";
import { getOrDelSubscriptionValidator } from "../../middlewares/subscription.middleware";
import { adminAddSubscriptionForUser, allSubscriptionHistoryAdmin, buySubscription, getSubscriptionPaypalPaymentCancel, getSubscriptionRazorpayPaymentSuccess, getSubscriptionStripePaymentCancel, getUserSubscriptionHistory, molliePaymentSuccess, paypalPaymentSuccess, SSLCommerzPaymentSuccess, stripePaymentSuccess } from "../../controllers/userSubscription.controller";

const subscriptionRoutes = Router();


subscriptionRoutes.get('/all', getSubscriptionList)

subscriptionRoutes.get('/list', isAdminOrEmployee, getSubscriptions)
subscriptionRoutes.get('/', getSubscription)
subscriptionRoutes.post('/', isAdminOrEmployee, createSubscription)
subscriptionRoutes.delete('/', isAdminOrEmployee, getOrDelSubscriptionValidator, deleteSubscription)

subscriptionRoutes.post('/buy', isAnyUser, buySubscription)
subscriptionRoutes.post('/buy-by-admin', isAdminOrEmployee, adminAddSubscriptionForUser)
subscriptionRoutes.get('/stripe/success', isAnyUser, stripePaymentSuccess)
subscriptionRoutes.get('/stripe/cancel', isAnyUser, getSubscriptionStripePaymentCancel)

subscriptionRoutes.get('/paypal/success', isAnyUser, paypalPaymentSuccess)
subscriptionRoutes.get('/paypal/cancel', isAnyUser, getSubscriptionPaypalPaymentCancel)

subscriptionRoutes.post('/sslcommerz/success', SSLCommerzPaymentSuccess)
subscriptionRoutes.get('/razorpay/success', getSubscriptionRazorpayPaymentSuccess)
subscriptionRoutes.get('/mollie/success', molliePaymentSuccess)


subscriptionRoutes.get('/user-history', isAnyUser, getUserSubscriptionHistory)
subscriptionRoutes.get('/admin-history', isAdminOrEmployee, allSubscriptionHistoryAdmin)

export default subscriptionRoutes;