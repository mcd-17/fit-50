import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../../utils/mongoose";

let productSchema = new Schema({
    name: {
        type: Schema.Types.Map,
        of: String,
        required: true,
        unique: true,
    },
    short_description: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    description: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'productcategory',
        required: true
    },
    variants: [{
        name: {
            type: Schema.Types.Map,
            of: String,
        },
        price: {
            type: Number,
        },
        in_stock: {
            type: Boolean,
        }
    }],
    thumbnail_image: {
        type: String,
        required: true
    },
    images: [{
        type: String,
    }],
    in_stock: {
        type: Boolean,
    },
    is_active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

productSchema.plugin(paginate)
productSchema.plugin(aggregatePaginate)

const Product = model('product', productSchema)

export default Product;

