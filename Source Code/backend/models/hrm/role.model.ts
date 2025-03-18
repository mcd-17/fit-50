import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../../utils/mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    deletable: {
        type: Boolean,
        default: true
    },
    permissions: [String],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
}, { timestamps: true });

schema.plugin(paginate);
schema.plugin(aggregatePaginate);
const Role = model('role', schema)

export default Role;
