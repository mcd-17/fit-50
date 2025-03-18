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
    image: String,
}, { timestamps: true })

schema.plugin(paginate)
schema.plugin(aggregatePaginate)

const Feature = model('feature', schema);
export default Feature;