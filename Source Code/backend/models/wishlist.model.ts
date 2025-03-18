import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";


let wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        variant: {
            type: Schema.Types.ObjectId,
            required: false
        },
    }],
}, { timestamps: true })

wishlistSchema.plugin(paginate);
wishlistSchema.plugin(aggregatePaginate);

const WishList = model('wishlist', wishlistSchema);

export default WishList