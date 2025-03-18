import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

let schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group',
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    selected_days: [{
        type: String,
        required: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: 'service',
    }],
    description: {
        type: Schema.Types.Map,
        of: String,
        required: true
    }
}, { timestamps: true });

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const Workout = model('Workout', schema);

export default Workout;