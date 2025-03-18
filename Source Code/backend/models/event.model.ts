import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

let schema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    description: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },  
    end_date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    total_interested_users: {
        type: Number,
        default: 0,
    },
    interested_users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
    
}, {timestamps: true});

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const Event = model('Event', schema);

export default Event;