import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

let scheduleSchema = new Schema({
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    time_slots: {
        type: String,
        required: true,
        enum: ['9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'],
    },
    event: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    is_booked: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true })

scheduleSchema.plugin(paginate)
const Schedule = model('Schedule', scheduleSchema);

export default Schedule;