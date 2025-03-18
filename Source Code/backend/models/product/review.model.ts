import { model, Schema } from 'mongoose'
import { paginate } from '../../utils/mongoose';

let ProductReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    rating: Number,
    review: String,

}, { timestamps: true })

ProductReviewSchema.plugin(paginate)

const ProductReview = model('ProductReview', ProductReviewSchema);
export default ProductReview;