import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    content_type: {
        type: String,
        enum: ['text', 'html', 'json'],
        default: 'text'
    },
    content: {
        type: Schema.Types.Map,
        of: Schema.Types.Mixed,
    },
}, { timestamps: true })

schema.plugin(paginate)

const Page = model('page', schema);
export default Page;