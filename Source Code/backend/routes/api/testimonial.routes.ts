import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { isSubscribedUser } from "../../middlewares/testimonial.middleware";
import { adminDeleteTestimonial, deleteTestimonial, getAllTestimonials, getTestimonialByUser, getTestimonials, postTestimonial, testimonialDetails, updateTestimonialStatus } from "../../controllers/testimonial.controller";
import { Router } from "express";


const testimonialRoutes = Router();

testimonialRoutes.get('/lists/admin',isAdminOrEmployee, getTestimonials)
testimonialRoutes.get('/details',isAdminOrEmployee, testimonialDetails)
testimonialRoutes.delete('/delete',isAdminOrEmployee, adminDeleteTestimonial)
testimonialRoutes.post('/update/status', isAdminOrEmployee, updateTestimonialStatus)


testimonialRoutes.post('/add', isSubscribedUser, postTestimonial)
testimonialRoutes.delete('/delete/user',isSubscribedUser, deleteTestimonial)
testimonialRoutes.get('/lists/user', isSubscribedUser, getTestimonialByUser)
testimonialRoutes.get('/lists/', getAllTestimonials)


export default testimonialRoutes