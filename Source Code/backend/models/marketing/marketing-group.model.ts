import { model, Schema } from 'mongoose'
import { aggregatePaginate, paginate } from '../../utils/mongoose';
let schema = new Schema({
    type:{
        type:String,
        required:true
    },
    name: {
        type: String,
        trim: true
    },
    status:{
        type: Boolean,
        default: true
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }]

}, { timestamps: true })

schema.plugin(paginate);
schema.plugin(aggregatePaginate);

const MarketingGroup = model('marketing_group', schema)

export default MarketingGroup