import { model, Schema } from "mongoose";


const schema = new Schema({
    default: String,
    sendgrid: {
        host: String,
        port: String,
        username: String,
        password: String,
        sender_email: String,
    },
    gmail: {
        auth_email: String,
        password: String,
        service_provider: String,
    },
    other: {
        host: String,
        port: String,
        address: String,
        password: String,
        provider_name: String,
    },
})

const MailSettings = model('mailsetting', schema);
export default MailSettings;