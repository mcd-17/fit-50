import mongoose, { model, Schema } from "mongoose";
import { aggregatePaginate,paginate } from "../../utils/mongoose";
const schema = new Schema(
    {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        date: { type: Date, default: Date.now },
        clockIn: { type: Date },
        clockOut: { type: Date },
        status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' },
        totalHours: { type: Number, default: 0 },
    },
    { timestamps: true }
)

schema.plugin(paginate)
schema.plugin(aggregatePaginate)
const Attendance = model('attendance', schema);
export default Attendance;