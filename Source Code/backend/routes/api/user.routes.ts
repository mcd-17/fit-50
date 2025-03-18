import { Router } from 'express'
import { isAdminOrEmployee, isAnyUser } from '../../middlewares/auth.middleware'
import {
    findUserValidator,
    registrationValidator,
    sendOtpValidator,
    verifyOtpValidator,
    resetPasswordValidator,
    loginValidator,
    updateUserValidator,
    postPasswordValidator,
    employeeCreateValidator,
    employeeUpdateValidator
} from "../../middlewares/user.middleware";
import {
    findUser,
    userRegistration,
    sendOtp,
    verifyOtp,
    resetPassword,
    userLogin,
    postPassword,
    getUserDetails,
    getUser,
    addTrainer,
    updateUser,
    getAllTrainers,
    getAdminAllTrainers,
    getTrainerDetails,
    deleteUser,
    getUserList,
    addUser,
    removeUser,
    employeeCreate,
    employeePasswordChange,
    employeeList,
    deleteEmployee,
    employeeUpdate
} from "../../controllers/user.controller"



const userRoutes = Router()

userRoutes.post('/find', findUserValidator, findUser)
userRoutes.post('/registration', registrationValidator, userRegistration)
userRoutes.post('/send-otp', sendOtpValidator, sendOtp)
userRoutes.post('/verify-otp', verifyOtpValidator, verifyOtp)
userRoutes.post('/reset-password', resetPasswordValidator, resetPassword)
userRoutes.post('/login', loginValidator, userLogin)
userRoutes.get('/', isAnyUser, getUser)
userRoutes.post('/', isAnyUser, updateUserValidator, updateUser)
userRoutes.post('/password', isAnyUser, postPasswordValidator, postPassword)

userRoutes.get('/details', isAnyUser, getUserDetails)

userRoutes.post('/add/trainer', isAdminOrEmployee, addTrainer)
userRoutes.get('/admin/trainers', isAdminOrEmployee, getAdminAllTrainers)

userRoutes.post('/employee', isAdminOrEmployee, employeeCreateValidator , employeeCreate);
userRoutes.post('/employee-update', isAdminOrEmployee, employeeUpdateValidator , employeeUpdate);
userRoutes.post('/employee/password-change', isAdminOrEmployee, employeePasswordChange);
userRoutes.get('/employee-list', isAdminOrEmployee, employeeList);
userRoutes.delete('/employee', isAdminOrEmployee, deleteEmployee);

userRoutes.post('/add/user', isAdminOrEmployee, addUser)
userRoutes.delete('/remove/user', isAdminOrEmployee, removeUser)

userRoutes.get('/trainers', getAllTrainers)
userRoutes.get('/trainers/details', getTrainerDetails)
userRoutes.delete('/', isAdminOrEmployee, deleteUser);

userRoutes.get('/list', isAdminOrEmployee, getUserList);

export default userRoutes