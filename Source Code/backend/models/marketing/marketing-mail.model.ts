import {model, Schema} from 'mongoose'
import { aggregatePaginate, paginate } from '../../utils/mongoose';

let schema = new Schema({
    individual_mail:String,
    group: {type: Schema.Types.ObjectId,ref:'marketing_group'},
    status: {
        type: String,
        default: 'pending'
    },
    scheduled_date : String,
    subject: String,
    content: String,
    from: String,
    trainer: Boolean,
    user: Boolean,
    employee: Boolean,
    to:{
        type:[],
        default:[]
    }
}, {timestamps: true})

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const MarketingMail = model('marketing_mail', schema)

export default MarketingMail
