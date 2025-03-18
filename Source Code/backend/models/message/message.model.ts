import {model, Schema} from 'mongoose'
import { aggregatePaginate, paginate } from '../../utils/mongoose'


let schema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false,
    },
    message: {
        type: String,
    },
    image: {
        type: String
    },
    file: {
        type: String
    },
    delivered: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})
schema.plugin(paginate)
schema.plugin(aggregatePaginate)
const Message = model('message', schema)
export default Message