import { applyCoupon, deleteCoupon, getAdminCouponList, getCouponList, postCoupon, toggleCouponStatus } from "../../controllers/product/coupon.controller";
import { Router } from "express";
import { isAdminOrEmployee, isAnyUser } from "../../middlewares/auth.middleware";

const couponRoutes = Router()

couponRoutes.get('/admin/list', isAdminOrEmployee, getAdminCouponList)
couponRoutes.post('/add', isAdminOrEmployee, postCoupon)
couponRoutes.delete('/delete', isAdminOrEmployee, deleteCoupon)
couponRoutes.post('/status', isAdminOrEmployee, toggleCouponStatus)

couponRoutes.get('/list', getCouponList)
couponRoutes.post('/apply', isAnyUser, applyCoupon)


export default couponRoutes