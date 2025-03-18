import { s3DeleteFiles } from "../../utils/s3bucket";
import Blog from "../../models/blog/blog.model";
import BlogComment from "../../models/blog/comment.model";
import mongoose from "mongoose";


// get all blogs
export const getBlogs = async (req, res) => {
    try {
        const { query } = req
        const filter = {}
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`title.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") }
        }

        let data = await Blog.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
            populate: [
                {
                    path: 'category',
                    model: 'category',
                    select: 'name'
                },
                {
                    path: 'tags',
                    model: 'tag',
                    select: 'name'
                }
            ]
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets blogs',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
// get blogs for user
export const getBlogsForUser = async (req, res) => {
    try {
        const { query } = req
        const filter = {}
        const langCode = query.langCode || 'en';
        if (!!query.category) {
            filter[`category`] = query.category
        }
        filter['published'] = true
        let data = await Blog.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v -short_description -description -tags -category -published',
            populate: [
                {
                    path: 'category',
                    model: 'category',
                    select: 'name'
                },
                {
                    path: 'tags',
                    model: 'tag',
                    select: 'name'
                },
                {
                    path: 'user',
                    select: 'name email image'
                }
            ]
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets blogs',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get blogs for trainer
export const getTrainersBlogs = async (req, res) => {
    try {
        const { query } = req
        const user = res.locals.user._id;
        const filter = { user: user }
        const langCode = query.langCode || 'en';
        if (!!query.search) {
            filter[`title.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") }
        }

        let data = await Blog.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v -short_description -description',
            populate: [
                {
                    path: 'category',
                    model: 'category',
                    select: 'name'
                },
                {
                    path: 'tags',
                    model: 'tag',
                    select: 'name'
                }
            ]
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets blogs',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get blog details for trainer
export const getTrainerBlogDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user._id;

        let data = await Blog.findOne({ _id: _id, user: user }).select('-__v').populate({
            path: 'category',
            model: 'category',
            select: 'name'
        }).populate({
            path: 'tags',
            model: 'tag',
            select: 'name'
        })

        if (!data) {
            return res.status(404).send({
                error: true,
                msg: "Blog not found"
            });
        }

        return res.status(200).send({
            error: false,
            msg: "Successfully fetched blog details",
            data: data
        });

    } catch (error) {
        console.error("🚀 ~ getBlogDetails ~ error:", error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// add blog
export const postBlog = async (req, res) => {
    try {
        let { body } = req;

        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }

        if (!!body._id) {
            let data = await Blog.findById(body._id)
            if (!data) {
                return res.status(400).send({
                    error: true,
                    msg: 'Blog not found'
                })
            }

            if (body.image && body.image !== data.image) {
                await s3DeleteFiles([data.image]);
            }

            if (!!body.tags) {
                body.tags = Array.isArray(body.tags) ? body.tags : [body.tags]
            } else {
                return res.status(400).send({
                    error: true,
                    msg: 'Tags is required'
                })
            }

            await Blog.findOneAndUpdate({ _id: body._id }, body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Blog'
            })
        }

        if (!!body.tags) {
            body.tags = Array.isArray(body.tags) ? body.tags : [body.tags]
        } else {
            return res.status(400).send({
                error: true,
                msg: 'Tags is required'
            })
        }
        await Blog.create({
            title: body.title,
            image: body.image,
            short_description: body.short_description,
            details: body.details,
            category: body.category,
            tags: body.tags,
            add_to_popular: body.add_to_popular,
            published: body.published,
            user: user
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully created Blog',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// delete blog
export const deleteBlog = async (req, res) => {
    try {
        let { query } = req
        let data = await Blog.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Blog not found'
            })
        }
        await Blog.findOneAndDelete({ _id: query._id })
        if (!!data?.image) {
            await s3DeleteFiles([data?.image])
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted Blog'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// toggle blog publish
export const toggleBlogPublish = async (req, res) => {
    try {
        let { query } = req
        let data = await Blog.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Blog not found'
            })
        }
        await Blog.findOneAndUpdate({ _id: query._id }, { published: !data.published })
        return res.status(200).send({
            error: false,
            msg: 'Successfully updated Blog'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// toggle blog add to popular
export const toggleBlogAddToPopular = async (req, res) => {
    try {
        let { query } = req
        let data = await Blog.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Blog not found'
            })
        }
        await Blog.findOneAndUpdate({ _id: query._id }, { add_to_popular: !data.add_to_popular })
        return res.status(200).send({
            error: false,
            msg: 'Successfully updated Blog'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// get all popular blogs
export const getPopularBlogs = async (req, res) => {
    try {
        const { query } = req;
        const filter = { published: true, add_to_popular: true };

        if (!!query.search && !!query.langCode) {
            const langCode = query.langCode;
            filter[`title.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .limit(query.limit || 6)
            .select('-__v -category -tags');

        return res.status(200).send({
            error: false,
            msg: 'Successfully get popular blogs',
            data
        });
    } catch (e) {
        console.error("Error in getPopularBlogs:", e);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};


// get blog details
export const getBlogDetails = async (req, res) => {
    try {
        const { query } = req
        let data = await Blog.findOne({ _id: query._id }).select('-__v').populate({
            path: 'category',
            model: 'category',
            select: 'name'
        }).populate({
            path: 'tags',
            model: 'tag',
            select: 'name'
        })
        const comments = await BlogComment.aggregate([
            { $match: { blog: new mongoose.Types.ObjectId(query._id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    'user.name': 1,
                    'user.email': 1,
                    'user.image': 1
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            }
        ])
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Blog not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully get blog',
            data: {
                _id: data._id,
                title: data.title,
                image: data.image,
                short_description: data.short_description,
                details: data.details,
                category: data.category,
                published: data.published,
                tags: data.tags,
                createdAt: data.createdAt,
                comments,
                updatedAt: data.updatedAt

            }
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

