import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

let schema = new Schema({
    question: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    answer: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    }
}, { timestamps: true })

schema.plugin(paginate)
const Faq = model('faq', schema);

export default Faq;
