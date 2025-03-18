import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

const schema = new Schema({
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
    icon: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true })

schema.plugin(paginate)
schema.plugin(aggregatePaginate)

const Service = model('service', schema);
export default Service;