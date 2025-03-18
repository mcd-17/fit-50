import { Router } from "express";
import pageRoutes from "./api/page.routes";
import userRoutes from "./api/user.routes";
import serviceRoutes from "./api/service.routes";
import languageRoutes from "./api/language.routes";
import settingsRoutes from "./api/setting.routes";
import currencyRoutes from "./api/currency.routes";
import mailSettingRoutes from "./api/mailCredential.routes";
import contactRoutes from "./api/contact.routes";
import featureRoutes from "./api/feature.routes";
import blogRoutes from "./api/blog.routes";
import scheduleRoutes from "./api/schedule.routes";
import faqRoutes from "./api/faq.routes";
import filesRoutes from "./api/files.routes";
import productRoutes from "./api/product.routes";
import wishlistRoutes from "./api/wishlist.routes";
import paymentRoutes from "./api/paymentMethod.routes";
import orderRoutes from "./api/order.routes";
import subscriptionRoutes from "./api/subscription.routes";
import groupRoutes from "./api/group.routes";
import couponRoutes from "./api/coupon.routes";
import nutritionRoutes from "./api/nutrition.routes";
import workoutRoutes from "./api/workout.routes";
import noticeRoutes from "./api/notice.routes";
import dashboardRoutes from "./api/dashboard.routes";
import eventRoutes from "./api/event.routes";
import testimonialRoutes from "./api/testimonial.routes";
import newsletterRoutes from "./api/newsletter.routes";
import GalleryRoutes from "./api/gallery.routes";
import notificationRoutes from "./api/notification.routes";
import messageRoutes from "./api/message.routes";
import roleRoutes from "./api/hrm/role.routes";
import bmiRouter from "./api/bmi-report.routes";
import attendanceRoutes from "./api/hrm/attendance.routes";
import marketingRoutes from "./api/marketing/marketing.routes";

const apiRoutes = Router();

apiRoutes.use('/page', pageRoutes)
apiRoutes.use('/user', userRoutes)
apiRoutes.use('/service', serviceRoutes)
apiRoutes.use('/language', languageRoutes)
apiRoutes.use('/settings', settingsRoutes)
apiRoutes.use('/currency', currencyRoutes)
apiRoutes.use('/mail-credential', mailSettingRoutes)
apiRoutes.use('/contact', contactRoutes)
apiRoutes.use('/features', featureRoutes)
apiRoutes.use('/blog', blogRoutes)
apiRoutes.use('/schedule', scheduleRoutes)
apiRoutes.use('/faq', faqRoutes)
apiRoutes.use('/file', filesRoutes)
apiRoutes.use('/product', productRoutes)
apiRoutes.use('/wishlist', wishlistRoutes)
apiRoutes.use('/payment', paymentRoutes)
apiRoutes.use('/order', orderRoutes)
apiRoutes.use('/subscription', subscriptionRoutes)
apiRoutes.use('/group', groupRoutes)
apiRoutes.use('/coupon', couponRoutes)
apiRoutes.use('/nutrition', nutritionRoutes)
apiRoutes.use('/testimonial', testimonialRoutes)
apiRoutes.use('/newsletter', newsletterRoutes)


apiRoutes.use('/workout', workoutRoutes)
apiRoutes.use('/notice', noticeRoutes)

apiRoutes.use('/dashboard', dashboardRoutes)
apiRoutes.use('/event', eventRoutes)
apiRoutes.use('/gallery',GalleryRoutes)
apiRoutes.use('/notification',notificationRoutes)
apiRoutes.use('/message',messageRoutes)
apiRoutes.use('/role', roleRoutes)
apiRoutes.use('/bmi', bmiRouter)
apiRoutes.use('/attendance', attendanceRoutes)

apiRoutes.use('/marketing', marketingRoutes)
export default apiRoutes