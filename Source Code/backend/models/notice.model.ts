import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

let schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {timestamps: true});

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const Notice = model('notice', schema);

export default Notice;