import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../../utils/mongoose";

let schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    code: String,
    value: Number,
    discount_type: String,
}, {timestamps: true})

schema.plugin(paginate)
schema.plugin(aggregatePaginate)
const UsedCoupon = model('used_coupon', schema)
export default UsedCoupon