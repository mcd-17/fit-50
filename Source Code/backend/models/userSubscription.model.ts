import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";


let userSubscriptionSchema = new Schema({
    uid: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscription',
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    payment: {
        method: {
            type: String,
            enum: ['paypal', 'stripe', 'razorpay', 'sslcommerz', 'mollie','cash'],
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
        },
        transaction_id: String,
        amount: Number,
        ref: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    subscription_type: {
        type: String,
        enum: ['monthly', 'yearly'],
    },
    start_date: Date,
    end_date: Date
}, { timestamps: true })

userSubscriptionSchema.plugin(paginate);
userSubscriptionSchema.plugin(aggregatePaginate);

const UserSubscription = model('user_subscription', userSubscriptionSchema);

export default UserSubscription;
