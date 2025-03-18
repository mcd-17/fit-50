import { model, Schema } from "mongoose";

const schema = new Schema(
    {
        checkInTime: { type: String, required: true },
        checkOutTime: { type: String, required: true },
        weekend: { type: [Number], default: [0, 6]},
    },
    { timestamps: true }
)

const AttendanceSetting = model('attendance_setting', schema);
export default AttendanceSetting;