import BlogComment from "../../models/blog/comment.model";

export const postBlogComment = async (req, res) => {
    try {
        const { body } = req;
        const user = res.locals.user._id;
        let comment: any;
        if (body._id) {
            await BlogComment.findByIdAndUpdate({ _id: body._id }, { content: body.content })
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Comment'
            });
        } else {
            if (!user) {
                return res.status(401).send({
                    error: true,
                    msg: "Unauthorized request. Please log in to continue."
                });
            }
            if (!body.content) {
                return res.status(400).send({
                    error: true,
                    msg: "Comment content cannot be empty. Please provide a valid comment."
                });
            }
            comment = new BlogComment({ user: user, blog: body.blog, content: body.content })
            await comment.save()
            if (!comment) {
                return res.status(400).send({
                    error: true,
                    msg: "Error is posting commment"
                });
            }
        }
        return res.status(201).send({
            error: false,
            msg: "Your comment has been posted successfully."
        });

    } catch (e) {
        console.error(e);
        return res.status(500).send({
            error: true,
            msg: "An unexpected error occurred. Please try again later."
        });
    }
};


export const delBlogComment = async (req, res) => {
    try {
        const { query } = req;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(401).send({
                error: true,
                msg: "Unauthorized request. Please log in to continue."
            });
        }
        let comment = await BlogComment.findByIdAndDelete(query?._id)
        if (!comment) {
            return res.status(400).send({
                error: true,
                msg: 'Comment not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Comment has been deleted successfully',
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            error: true,
            msg: "An unexpected error occurred. Please try again later."
        });
    }
}
