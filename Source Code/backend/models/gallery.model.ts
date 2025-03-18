import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";


let schema = new Schema({
    image: {
        type: String,
        required: true
    }
}, { timestamps: true })

schema.plugin(paginate)

const Gallery = model('gallery', schema);
export default Gallery