import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../../utils/mongoose";

let couponSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['percentage', 'flat'],
        required: true
    },
    usage_limit_per_user: Number,
    minimum_order_amount: Number,
    expire_at: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean
    }
}, { timestamps: true })

couponSchema.plugin(paginate)
couponSchema.plugin(aggregatePaginate)

const Coupon = model('coupon', couponSchema)

export default Coupon