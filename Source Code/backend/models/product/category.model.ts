import { model, Schema } from "mongoose";
import { paginate } from "../../utils/mongoose";


let schema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })

schema.plugin(paginate)

const ProductCategory = model('productcategory', schema);

export default ProductCategory;
