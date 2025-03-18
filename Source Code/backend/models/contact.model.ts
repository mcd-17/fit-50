import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

let replySchema = new Schema({
    email: {
        type: String,
        lowercase: true,
    },
    message: {
        type: String,
    },
    subject: String,

});

let schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    phone: {
        type: String,
    },
    subject: String,
    message: {
        type: String,
        required: true,
    },
    reply: replySchema,
    status: {
        type: Boolean,
        default: false
    },


}, { timestamps: true })

schema.plugin(paginate)
const Contact = model('contact', schema);
export default Contact;