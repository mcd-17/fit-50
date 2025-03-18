import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

let newsletterSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
   
}, { timestamps: true })


newsletterSchema.plugin(paginate)
newsletterSchema.plugin(aggregatePaginate)

const Newsletter = model('newsletter', newsletterSchema);
export default Newsletter;

