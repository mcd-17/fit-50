import { Router } from "express";
import { isAdminOrEmployee, isAdminOrTrainerOrEmployee } from "../../../middlewares/auth.middleware";
import { postAttendanceSettingsValidator } from "../../../middlewares/hrm/attendance.middleware";
import { allAttendance, checkCheckInOrNot, clockIn, clockOut, getAttendanceSetting, getMyAttendance, postAttendanceSetting, todaysAttendance } from "../../../controllers/hrm/attendance.controller";

const attendanceRoutes = Router();
attendanceRoutes.post("/setting",isAdminOrEmployee,postAttendanceSettingsValidator, postAttendanceSetting)
attendanceRoutes.get("/setting", getAttendanceSetting)
attendanceRoutes.post("/check-in",isAdminOrTrainerOrEmployee, clockIn)
attendanceRoutes.post("/check-out",isAdminOrTrainerOrEmployee, clockOut)
attendanceRoutes.get("/details",isAdminOrTrainerOrEmployee, getMyAttendance)
attendanceRoutes.get("/check-status",isAdminOrTrainerOrEmployee, checkCheckInOrNot)
attendanceRoutes.get("/all",isAdminOrTrainerOrEmployee, allAttendance)
attendanceRoutes.get("/today",isAdminOrTrainerOrEmployee, todaysAttendance)
export default attendanceRoutes