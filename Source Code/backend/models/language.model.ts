import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

const languageSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    rtl: {
        type: Boolean,
        default: false
    },
    flag: String,
    translations: Schema.Types.Mixed,
    default: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

languageSchema.plugin(paginate)

const Language = model('language', languageSchema);
export default Language;