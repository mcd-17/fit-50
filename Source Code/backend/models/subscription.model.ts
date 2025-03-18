import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

let schema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    monthly_price: {
        type: Number,
        required: true
    },
    yearly_price: {
        type: Number,
        required: true
    },
    features: [{
        type: Schema.Types.Map,
        of: String,
        required: true,
    }],
    is_active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

schema.plugin(paginate)
schema.plugin(aggregatePaginate)

const Subscription = model('subscription', schema)

export default Subscription;