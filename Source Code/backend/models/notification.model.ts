import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

const schema = new Schema({
    title: {
        type: String,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    message: {
        type: String,
    },
    data: Object,
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })    

schema.plugin(paginate)
schema.plugin(aggregatePaginate)

const Notification = model('notification', schema);
export default Notification;