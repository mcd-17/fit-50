import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";


let schema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    facilities: [{
        type: Schema.Types.Map,
        of: String,
        required: true,
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    assign_trainers: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    status: {
        type: Boolean,
    },
    image: {
        type: String,
    }

}, { timestamps: true })

schema.plugin(aggregatePaginate)
schema.plugin(paginate)

let Group = model('group', schema)

export default Group