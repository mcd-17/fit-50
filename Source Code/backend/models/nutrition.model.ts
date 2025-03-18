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
    nutrition: [{
        type: {
            type: String,
            required: true,
            enum: ['Breakfast', 'Mid Morning Snacks', 'Lunch', 'Afternoon Snacks', 'Dinner'],
        },
        description: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const Nutrition = model('Nutrition', schema);
export default Nutrition;
