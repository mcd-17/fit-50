import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

const paymentMethodSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['paypal', 'stripe', 'sslcommerz', "razorpay", "mollie"],
        default: 'stripe'
    },
    
    config: {
        clientId: String,
        clientSecret: String,
        mode: {
            type: String,
            enum: ['sandbox', 'live'],
            default: 'sandbox'
        },
        is_live: Boolean,
    }

}, { timestamps: true })

paymentMethodSchema.plugin(paginate)
const PaymentMethod = model('payment_method', paymentMethodSchema);

export default PaymentMethod;
