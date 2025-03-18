import {model, Schema} from 'mongoose'
import { aggregatePaginate, paginate } from '../../utils/mongoose';

let schema = new Schema({
    email: {
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

    },
    email_template: [{ type: String }],
}, {timestamps: true})

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const MarketingSettings = model('marketing_setting', schema)

export default MarketingSettings
