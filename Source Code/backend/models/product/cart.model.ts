import { model, Schema } from "mongoose";
import { paginate } from "../../utils/mongoose";

let schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],

});

schema.plugin(paginate);

const Cart = model('cart', schema);

export default Cart;
