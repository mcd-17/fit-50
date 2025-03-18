import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../../utils/mongoose";

let blogSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
    title: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    image: {
        type: String,
    },
    short_description: {
        type: Schema.Types.Map,
        of: String
    },
    details: {
        type: Schema.Types.Map,
        of: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tags',
    }],
    add_to_popular: {
        type: Boolean,
        default: false,
    },
    published: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

blogSchema.plugin(paginate)
blogSchema.plugin(aggregatePaginate)
const Blog = model('blog', blogSchema);

export default Blog;