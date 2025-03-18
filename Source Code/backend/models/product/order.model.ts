import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../../utils/mongoose";

let orderSchema = new Schema({
    uid: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    location: {
        type: String,
    },
    city: {
        type: String,
    },
    zip_code: {
        type: String,
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            variantId: {
                type: Schema.Types.ObjectId,
                ref: 'variant',
                required: false
            },
            quantity: {
                type: Number,
            },
            total: {
                type: Number,
            }
        }
    ],
    subTotal: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    discount_coupon: {
        type: String,
    },
    discount_amount: {
        type: Number,
        default: 0
    },
    payment: {
        method: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
        },
        transaction_id: String,
        amount: Number,
        currency: String
    }
}, { timestamps: true })


orderSchema.plugin(paginate)
orderSchema.plugin(aggregatePaginate)

const Order = model('order', orderSchema);
export default Order;

