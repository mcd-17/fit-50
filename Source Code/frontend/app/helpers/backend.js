import exp from "constants";
import { del, get, patch, post, postForm, patchForm, put } from "./api";
import { data } from "autoprefixer";


export const sendOtp = (data) => post("/user/send-otp", data);
export const postRegister = (data) => post("/user/registration", data);
export const postLogin = (data) => post("/user/login", data);
export const postVerifyOtp = (data) => post("/user/verify-otp", data);
export const postResetPassword = (data) => post("/user/reset-password", data);
export const postChangePassword = (data) => post("/user/password", data);


// admin services
export const fetchServices = (data) => get("/service/list", data);
export const fetchService = (data) => get("/service", data);
export const postService = (data) => post("/service", data);
export const delService = (data) => del("/service", data);
// admin faq 
export const fetchFaq = (data) => get("/faq/list", data);
export const fetchFaqDetail = (data) => get("/faq", data);
export const postFaq = (data) => post("/faq", data);
export const delFaq = (data) => del("/faq", data);

// group
export const fetchGroupList = (data) => get("/group/list", data);

export const fetchUserGroup = (data) => get("/group/user", data);

// admin cupon
export const fetchCupons = (data) => get("/coupon/admin/list", data);
export const postCupon = (data) => post("/coupon/add", data);
export const delCupon = (data) => del("/coupon/delete", data);

// admin testimonials
export const fetchTestimonials = (data) => get("/testimonial/list", data);
export const fetchTestimonial = (data) => get("/testimonial", data);
export const postTestimonial = (data) => postForm("/testimonial", data);
export const delTestimonial = (data) => del("/testimonial", data);

//  trainer group 
export const fetchTrainerGroupList = (data) => get("/group/trainer/list", data);
export const fetchMembers = (data) => get("/group/trainer/members", data);
export const delTrainer = (data) => del("/user", data);

// nutrition 
export const fetchNutrition = (data) => get("/nutrition/list", data);
export const addNutrition = (data) => post("/nutrition/add", data);
export const updateNutrition = (data) => post("/nutrition/edit", data);
export const delNutrition = (data) => del("/nutrition/delete", data)
export const fetchNutritionDetail = (data) => get("/nutrition/details", data);
export const fetchUserNutrationSchedule = (data) => get("/nutrition/user/list", data);

//contact us
export const postContactUs = (data) => post("/contact", data);
export const fetchContact = (data) => get("/contact/list", data);
export const fetchContactDetail = (data) => get("/contact", data);
export const delContact = (data) => del("/contact", data);
export const replyContact = (data) => post("/contact/reply", data);

// settings
export const fetchAdminSettings = (data) => get('/settings', data);
export const postAdminSettings = (data) => postForm('/settings', data);

export const fetchDashboardData = (data) => get('/user/dashboard', data);

// admin subscription
export const fetchSubscription = (data) => get('/subscription/list', data);
export const subscriptionHistory = (data) => get('/subscription/admin-history', data);
export const fetchSubscriptionDetails = (data) => get('/subscription', data);
export const postSubscription = (data) => post('/subscription', data);
export const delSubscription = (data) => del('/subscription', data);

// admin payment methods 
export const fetchPaymentMethods = (data) => get("/payment/method/list", data);
export const fetchUserPaymentMethods = (data) => get("/payment/method/user/list", data);
export const fetchPaymentMethod = (data) => get("/payment/method", data);
export const postPaymentMethod = (data) => post("/payment/method", data);
export const delPaymentMethod = (data) => del("/payment/method", data);


// owner subscription 
export const buyOwnerSubscription = (data) => post('/subscription/buy', data);
export const fetchOwnerSubscriptionHistory = (data) => get('/subscription/history', data);
// newsletter
export const fetchNewsletter = (data) => get('/newsletter/list', data);
export const delNewsLetter = (data) => del('/newsletter', data);
export const postNewsLetter = (data) => post('/newsletter', data);

export const fetchUsers = (data) => get('/user/list', data);
export const fetchUserDetails = (data) => get('/user/details', data);
export const fetchUser = (data) => get("/user", data);


// languages 
export const fetchLanguages = (data) => get('/language/list', data);
export const fetchLanguage = (data) => get('/language', data);
export const postLanguage = (data) => post('/language', data);
export const delLanguage = (data) => del('/language', data);

// translations 
export const fetchTranslations = (data) => get('/language/translations', data);
export const fetchPublicLanguages = (data) => get('/language/languages', data);


// admin page
export const fetchSinglePage = (data) => get("/page", data);
export const postPage = (data) => post("/page", data);

// admin feature
export const fetchFeatures = (data) => get("/features/list", data);
export const addFeature = (data) => post("/features/add", data);
export const delFeature = (data) => del("/features", data);


// admin Product order
export const fetchOrders = (data) => get("/order/admin/list", data);
export const orderDetails = (data) => get("/order/admin/details", data);
export const updateOrderStatus = (data) => post("/order/admin/status", data)

// admin group
export const fetchGroups = (data) => get("/group/list/admin", data);
export const addGroup = (data) => post("/group/add", data);
export const delGroup = (data) => del("/group/delete", data);
export const groupTrainers = (data) => get("/group/trainers", data);

//admin roles & permission
export const fetchRoleList = (data) => get("/role/list", data);
export const postRole = (data) => post('/role', data);
export const deleteRole = (data) => del('/role', data);
export const singleRole = (data) => get('/role', data);
export const fetchPermissions = (data) => get('/role/permissions', data);
export const postPermissions = (data) => post('/role/permissions', data);

//admin hrm employee
export const fetchUserEmployee = (data) => get("/user/employee-list", data);
export const addUserEmployee = (data) => post("/user/employee", data);
export const updateUserEmployee = (data) => post("/user/employee-update", data);
export const deleteEmployee = (data) => del("/user/employee", data);
export const employeePasswordChange = (data) => post("/user/employee/password-change", data);
//trainer 
export const addTrainer = (data) => post("/user/add/trainer", data);
export const fetchTrainers = (data) => get("/user/admin/trainers", data);
export const addUser = (data) => post("/user/add/user", data);
export const buySubscriptionByAdmin = (data) => post("/subscription/buy-by-admin", data);
export const removeUser = (data) => del("/user/remove/user", data);

// admin image file
export const postSingleImage = (data) => postForm("/file/single-image-upload", data);
export const postMultipleImage = (data) => postForm("/file/multiple-image-upload", data);
export const pdfFileUpload = (data) => postForm("/file/pdf-upload", data);
//agent profile
export const userProfileUpdate = (data) => postForm("/user", data);



/* ---------------------------------------- site api -------------------------------- */


// blog list
export const blogCategoryList = (data) => get("/blog/category/list", data)
export const postCategory = (data) => post("/blog/category", data)
export const delCategory = (data) => del("/blog/category", data)
export const postTag = (data) => post("/blog/tag", data)
export const fetchTagsList = (data) => get("/blog/tag/list", data)
export const fetchTag = (data) => get("/blog/tag", data)
export const delTag = (data) => del("/blog/tag", data)
export const fetchBlogsList = (data) => get("/blog/list", data)
export const fetchBlogsListUser = (data) => get("/blog/lists", data)
export const postBlog = (data) => post("/blog", data)
export const delBlog = (data) => del("/blog", data)
export const fetchBlog = (data) => get("/blog/details", data)
export const fetchPublicBlog = (data) => get("/blog/toggle-publish", data)
export const fetchPopularBlog = (data) => get("/blog/toggle-popular", data)
export const popularBlogList = (data) => get("/blog/popular", data)
export const fetchBlogsTrainer = (data) => get("blog/trainers", data)
export const fetchBlogTrainerdetails = (data) => get("/blog/trainers/details", data)

// product 
export const allProducts = (data) => get("/product", data)
export const allProductsAdmin = (data) => get("/product/list", data)
export const singleProductAdmin = (data) => get("/product/details", data)
export const deleteProduct = (data) => del("/product/delete", data)
export const postProduct = (data) => post("/product/add", data)
export const updateProduct = (data) => post("/product/update", data)
export const publishProduct = (data) => post("/product/publish", data)
export const allProductCategory = (data) => get("/product/category/list", data)
export const delProductCategory = (data) => del("/product/category", data)
export const postProductCategory = (data) => post("/product/category", data)

// wishlist
export const fatchWishlist = (data) => get("/wishlist/list", data)
export const postWishlist = (data) => post("/wishlist/add", data)

// cart
export const fetchCartlist = (data) => get("/product/cart/list", data)
export const postCartlist = (data) => post("/product/cart", data)
export const delCart = (data) => del("/product/cart", data)

//order
export const orderList = (data) => get("/order/user/list", data)
export const postOrder = (data) => post("/order", data)
export const userOrderDetails = (data) => get("/order/user/details", data)

//for order payment
export const getSuccessStripeQuery = (data) => get("/order/stripe/success", data)
export const getPaypalOrderPaymentSuccess = (data) => get("/order/paypal/success", data)
export const getMollieOrderPaymentSuccess = (data) => get("/order/mollie/success", data)
export const getRazorpayOrderPaymentSuccess = (data) => get("/order/razorpay/success", data)
export const orderSslCommerzSuccess = (data) => post("/order/sslcommerz/success", data);

// fitness history
export const fitnessHistory = (data) => get("/bmi", data)
export const postFitness = (data) => post("/bmi", data)
export const deleteFitness = (data) => del("/bmi/delete", data)


//shedule show
export const fetchShedule = (data) => get("/schedule", data)
// services list
export const getServiceList = (data) => get("/services", data)
export const getPropertyList = (data) => get("/property/list", data)

// blog comments
export const blogComments = (data) => get("/comment", data)
export const postComments = (data) => post("/blog/comment", data)
export const deleteComments = (data) => del("/blog/comment", data)
export const deleteAdminComments = (data) => del("/comment/delete-admin", data)
export const postCommentReply = (data) => post("/commentReply", data)
export const deleteCommentReply = (data) => del("/commentReply", data)
export const deleteAdminCommentReply = (data) => del("/commentReply/delete-admin", data)
export const fetchSiteSettings = (data) => get("/settings", data)
export const fetchUserTestimonials = (data) => get("/testimonials", data)
export const deleteUserTestimonials = (data) => del("/testimonial/delete/user", data)

//subscription 
export const subscriptionPlan = (data) => get("/subscription/all", data)
export const subscriptionPlanDetails = (data) => get("/subscription/details", data)
export const createStripeSubscription = (data) => post("/subscription/create-stripe-subscription", data)
export const getUserHistorySubscription = (data) => get("/subscription/user-history", data);


// subscription payment
export const getSuccessSubscriptionStripe = (data) => get("/subscription/stripe/success", data)
export const getCancelStripe = (data) => get("/subscription/stripe/cancel", data)
export const getPaypalPaymentSuccess = (data) => get("/subscription/paypal/success", data);
export const getPaypalPaymentFailed = (data) => get("/subscription/paypal/cancel", data);
export const getRazorpayPaymentSuccess = (data) => get("/subscription/razorpay/success", data);
export const getMolliePaymentSuccess = (data) => get("/subscription/mollie/success", data);
export const postSslCommmerceSuccess = (data) => post("/subscription/sslcommerz/success", data);

export const getMollieSuccess = (data) => get("/subscription/mollie/success", data);


// admin sehedule list
export const fetchAdminSheduleList = (data) => get("/schedule/all", data)
export const delSchedule = (data) => del("/schedule", data)
export const postSchedule = (data) => post("/schedule", data)

//email settings 
export const fetchEmailSettings = (data) => get("/mail-credential", data)
export const postEmailSettings = (data) => post("/mail-credential", data)

//general setting
export const fetchGeneralSettings = (data) => get("/general-setting", data)
export const postGeneralSettings = (data) => post("/general-setting", data)

export const fetchAdminDashboardData = (data) => get("/dashboard/admin", data)

export const postCompareProperties = (data) => post('/compare', data);


//trainer list
export const fetchTrainerList = (data) => get("/user/trainers", data);
export const trainerdetails = (data) => get("/user/trainers/details", data);

// trainer notice 
export const fetchTrainerNotice = (data) => get("/notice/list", data);

// Currency
export const fetchCurrency = (data) => get("/currency/list", data);
export const fetchSingleCurrency = (data) => get("/currency", data);
export const postCurrency = (data) => post("/currency", data);
export const delCurrency = (data) => del("/currency", data);


export const fetchNotifications = (data) => get("/notification/list", data);
export const postReadNotification = (data) => post('/notification/read', data)
export const postReadAllNotification = (data) => post('/notification/read/all', data)


// marketing group
export const fetchMarketingGroupList = (data) => get("/marketing/group/list", data);
export const postMarketingGroup = (data) => post("/marketing/group/create", data);
export const delMarketingGroup = (data) => del("/marketing/group/delete", data);
export const fetchMarketingGroupUserList = (data) => get("/marketing/group/available-user", data);
export const addOrRemoveMarketingGroupUser = (data) => post("/marketing/group/available-user", data);

export const fetchMarketingSettings = (data) => get("/marketing/settings", data);
export const postMarketingSettings = (data) => post("/marketing/settings", data)


export const groupDetails = (data) => get("/group/details", data)
export const joinGroup = (data) => post("/group/join", data)
export const leaveGroup = (data) => post("/group/join", data)

// translation 
export const translateLanguage = (data) => post("/language/translate", data)

// trainer groupList
export const fetchuserlistForGroup = (data) => get("/group/trainer/members", data);
export const fetchMemberDetails = (data) => get("/group/trainer/member", data);

// trainer workout
export const postTrainerWorkout = (data) => post("/workout", data);
export const fetchTrainerWorkout = (data) => get("/workout/list", data);
export const singleTrainerWorkout = (data) => get("/workout/details", data);
export const updateTrainerWorkout = (data) => post("/workout/update", data);
export const delTrainerWorkout = (data) => del("/workout/delete", data);

// trainer notice
export const postTrainerNotice = (data) => post("/notice", data);
export const fetchTrainerNoticeList = (data) => get("/notice/list", data);
export const singleTrainerNotice = (data) => get("/notice/details", data);
export const updateTrainerNotice = (data) => post("/notice", data);
export const delTrainerNotice = (data) => del("/notice/delete", data);

//user workout 
export const fetchUserWorkout = (data) => get("/workout/users", data);
//user notice
export const fetchUserNoticeList = (data) => get("/notice/list/user", data);
// Review

export const postReviews = (data) => post("/product/review", data);


// user testimonial
export const fetchUserTestimonial = (data) => get("/testimonial/lists/user", data);
export const postUserTestimonial = (data) => post("/testimonial/add", data);

// admin testimonial
export const fetchAdminTestimonial = (data) => get("/testimonial/lists/admin", data);
export const delAdminTestimonial = (data) => del("/testimonial/delete", data);
export const postAdminTestimonial = (data) => post("/testimonial/update/status", data);
export const allTestimonial = (data) => get("/testimonial/lists", data);
export const detailsTestimonial = (data) => get("/testimonial/details", data);

// admin newsletter
export const fetchAdminNewsletter = (data) => get("/newsletter/list", data);
export const postAdminNewsletter = (data) => post("/newsletter", data);
export const delAdminNewsletter = (data) => del("/newsletter", data);
// admin events
export const fetchEvents = (data) => get("/event/list", data);
export const postEvents = (data) => post("/event/add", data);
export const deleteEvents = (data) => del("/event/delete", data);
export const fetchAllevent = (data) => get("/event", data);
export const eventdetail = (data) => get("/event/details", data);
export const intersted = (data) => post("/event/interest", data);


// user coupon
export const fetchUserCoupon = (data) => get("/coupon/list", data);
export const applyCoupon = (data) => post("/coupon/apply", data);
// gallery
export const fetchAdminGallery = (data) => get("/gallery/list", data);
export const postGallery = (data) => post("/gallery/post", data);
export const deleteGallery = (data) => del("/gallery/delete", data);

// theme
export const updateTheme = (data) => post("/settings/themes/status", data)
export const fetchTheme = (data) => get("/settings/themes", data)

//notification
export const fetchAdminNotification = (data) => get("/notification/list/admin", data);
export const readAdminNotification = (data) => post("/notification/read", data);
export const readAllMarkAdminNotification = (data) => post("/notification/read-all", data);
export const deleteAdminNotification = (data) => del("/notification/delete", data);

// message
export const userListMessaged = (data) => get("/message/list/users", data);
export const messageList = (data) => get("/message/list", data);
export const postMessage = (data) => post("/message", data);
export const deleteMessage = (data) => del("/message/delete", data);

// attendances
export const fetchAttendances = (data) => get("/attendance/details", data); 
export const postCheckIn = (data) => post("/attendance/check-in", data);
export const postCheckOut = (data) => post("/attendance/check-out", data);
export const checkInStatus = (data) => get("/attendance/check-status", data);
export const fetchAttendanceSettings = (data) => get("/attendance/setting", data);
export const postAttendanceSettings = (data) => post("/attendance/setting", data);
export const fetchAttendanceAdmin = (data) => get("/attendance/all", data);
export const todayAttendanceAdmin = (data) => get("/attendance/today", data);


// marketing email
export const allMarketingEmail = (data) => get("/marketing/all-mail", data);
export const delMarketingMail = (data) => del("/marketing/mail/delete", data);
export const sendMarketingMail = (data) => post("/marketing/send-mail", data);