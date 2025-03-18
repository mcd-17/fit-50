import { model, Schema } from "mongoose";
import { paginate } from "../../utils/mongoose";


let categorySchema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })


categorySchema.plugin(paginate)
const Category = model('category', categorySchema);
export default Category;