import { model, Schema } from 'mongoose'
import { paginate } from '../../utils/mongoose';

let BlogCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'blog'
    },
    content: {
        type: String,
        required: true
    },

}, { timestamps: true })

BlogCommentSchema.plugin(paginate)

const BlogComment = model('BlogComment', BlogCommentSchema);
export default BlogComment;