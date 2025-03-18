import { Request, Response } from "express";
import Attendance from "../../models/hrm/attendance.model";
import AttendanceSetting from "../../models/hrm/attendance-setting.model";
import moment from 'moment';
import { populate } from "dotenv";
import mongoose from "mongoose";

export const postAttendanceSetting = async (req: Request, res: Response) => {
    try {
        const { checkInTime, checkOutTime, weekend, _id } = req.body;
        let setting = await AttendanceSetting.findOne();
        if (setting) {
            setting.checkInTime = checkInTime;
            setting.checkOutTime = checkOutTime;
            setting.weekend = weekend;

            await setting.save();
            return res.status(200).json({ error: false, msg: "Successfully updated" });
        }
        setting = new AttendanceSetting({ checkInTime, checkOutTime, weekend });
        await setting.save();

        return res.status(200).json({ error: false, msg: "Successfully created", data: setting });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
};
export const getAttendanceSetting = async (req: Request, res: Response) => {
    try {
        let data = await AttendanceSetting.findOne();
        if (!data) {
            return res.status(404).json({
                error: true,
                msg: "No attendance setting found"
            });
        }

        return res.status(200).json({ error: false, msg: "Successfully retrieved", data });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
};
export const clockIn = async (req: Request, res: Response) => {
    try {
        const employee = res.locals.user._id;
        const today = moment().startOf('day');
        const attendanceSetting = await AttendanceSetting.findOne();
        if (!attendanceSetting) {
            return res.status(400).json({ error: true, msg: "Attendance settings not found" });
        }
        const dayOfWeek = today.day();
        if (attendanceSetting.weekend.includes(dayOfWeek)) {
            return res.status(400).json({ error: true, msg: "Check-in is not allowed on weekends" });
        }
        const existingAttendance = await Attendance.findOne({
            employee,
            date: { $gte: today.toDate(), $lt: today.endOf('day').toDate() }
        });
        if (existingAttendance) {
            return res.status(400).json({ error: true, msg: "You have already clocked in today" });
        }
        const currentHour = moment().hour();
        const checkInHour = parseInt(attendanceSetting.checkInTime.split(":")[0]);
        let status = "present";
        if (currentHour > checkInHour) {
            status = "late";
        }
        const attendance = new Attendance({ employee, clockIn: new Date(), status });
        await attendance.save();
        return res.status(200).json({ error: false, msg: "Successfully clocked in", data: attendance });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
};
export const clockOut = async (req: Request, res: Response) => {
    try {
        const employee = res.locals.user._id;
        const today = moment().startOf('day');
        const attendance = await Attendance.findOne({
            employee,
            date: { $gte: today.toDate(), $lt: today.endOf('day').toDate() }
        });
        if (!attendance || !attendance.clockIn) {
            return res.status(400).json({ error: true, msg: "You must clock in first" });
        }
        if (attendance.clockOut) {
            return res.status(400).json({ error: true, msg: "You have already clocked out today" });
        }
        const clockOutTime = moment();
        const totalHours = clockOutTime.diff(moment(attendance.clockIn), 'hours', true);
        attendance.clockOut = clockOutTime.toDate();
        attendance.totalHours = totalHours;
        await attendance.save();

        return res.status(200).json({ error: false, msg: "Successfully clocked out", data: attendance });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
};
export const getMyAttendance = async (req: Request, res: Response) => {
    try {
        const employee = req.query?._id ? req.query._id : res.locals.user._id;
        const { year, month, page = 1, limit = 10 } = req.query;
        const filter: any = { employee: new mongoose.Types.ObjectId(employee as string) };
        if (year && !isNaN(Number(year))) {
            const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
            filter.date = { $gte: startOfYear, $lte: endOfYear };
            if (month) {
                let monthNumber: number;
                if (isNaN(Number(month))) {
                    const monthNames: { [key: string]: number } = {
                        January: 1,
                        February: 2,
                        March: 3,
                        April: 4,
                        May: 5,
                        June: 6,
                        July: 7,
                        August: 8,
                        September: 9,
                        October: 10,
                        November: 11,
                        December: 12,
                    };
                    monthNumber = monthNames[month as keyof typeof monthNames];
                } else {
                    monthNumber = Number(month);
                }

                if (monthNumber >= 1 && monthNumber <= 12) {
                    const formattedMonth = String(monthNumber).padStart(2, "0");
                    const startOfMonth = new Date(`${year}-${formattedMonth}-01T00:00:00.000Z`);
                    const endOfMonth = new Date(Number(year), monthNumber, 0, 23, 59, 59, 999);

                    filter.date = { $gte: startOfMonth, $lte: endOfMonth };
                }
            }
        }
        const data = await Attendance.paginate(filter, {
            page: parseInt(String(page), 10),
            limit: parseInt(String(limit), 10),
            sort: { createdAt: -1 },
        });
        return res.status(200).json({ error: false, msg: "Successfully Fetched Attendances", data });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
};

export const checkCheckInOrNot = async(req: Request, res: Response) => {
    try {
        const employee = res.locals.user._id;
        const today = moment().startOf('day');
        const attendance = await Attendance.findOne({
            employee,
            date: { $gte: today.toDate(), $lt: today.endOf('day').toDate() }
        });
        if (!attendance || !attendance.clockIn) {
            return res.status(400).json({ error: false, msg: "You must clock in first",data: attendance });
        }
        return res.status(200).json({ error: false, msg: "You have already clocked in today", data: attendance });
        
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
}

// all attendance list for admin 
export const allAttendance = async(req: Request, res: Response) => {
    try {
        const { year, month, page = 1, limit = 10 } = req.query;
        const filter: any = {};
        if (year && !isNaN(Number(year))) {
            const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
            filter.date = { $gte: startOfYear, $lte: endOfYear };
            if (month) {
                let monthNumber: number;
                if (isNaN(Number(month))) {
                    const monthNames: { [key: string]: number } = {
                        January: 1,
                        February: 2,
                        March: 3,
                        April: 4,
                        May: 5,
                        June: 6,
                        July: 7,
                        August: 8,
                        September: 9,
                        October: 10,
                        November: 11,
                        December: 12,
                    };
                    monthNumber = monthNames[month as keyof typeof monthNames];
                } else {
                    monthNumber = Number(month);
                }

                if (monthNumber >= 1 && monthNumber <= 12) {
                    const formattedMonth = String(monthNumber).padStart(2, "0");
                    const startOfMonth = new Date(`${year}-${formattedMonth}-01T00:00:00.000Z`);
                    const endOfMonth = new Date(Number(year), monthNumber, 0, 23, 59, 59, 999);

                    filter.date = { $gte: startOfMonth, $lte: endOfMonth };
                }
            }
        }
        const data = await Attendance.paginate(filter, {
            page: parseInt(String(page), 10),
            limit: parseInt(String(limit), 10),
            sort: { createdAt: -1 },
            populate: {
                path: "employee",
                select: "name email image _id phone"
            }
        });
        return res.status(200).json({ error: false, msg: "Successfully Fetched Attendances", data });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
}

export const todaysAttendance = async(req: Request, res: Response) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); 
        const todayEnd = new Date(todayStart);
        todayEnd.setHours(23, 59, 59, 999); 

        const filter: any = {
            date: { $gte: todayStart, $lte: todayEnd }
        };

        if (status && ['present', 'absent', 'late'].includes(status as string)) {
            filter.status = status;
        }
        const data = await Attendance.paginate(filter, {
            page: parseInt(String(page), 10),
            limit: parseInt(String(limit), 10),
            sort: { createdAt: -1 },
            populate: {
                path: 'employee',
                select: 'name email image _id phone'
            }
        });

        return res.status(200).json({ error: false, msg: "Successfully Fetched Today's Attendances", data });
    } catch (error) {
        return res.status(500).json({ error: true, msg: "Internal Server Error" });
    }
}
