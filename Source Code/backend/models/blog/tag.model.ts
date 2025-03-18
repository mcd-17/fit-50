import { model, Schema } from "mongoose";
import { paginate } from "../../utils/mongoose";

let tagSchema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })

tagSchema.plugin(paginate)
const Tags = model('tag', tagSchema);
export default Tags;