
import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

let currencySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    default: {
        type: Boolean,
        default: false
    },
    placement: {
        type: String,
        default: 'before'
    },
    rate: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

currencySchema.plugin(paginate)
const Currency = model('currency', currencySchema);

export default Currency;