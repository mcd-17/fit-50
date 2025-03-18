import Page from "../models/page.model";

// get all pages
export const getPages = async (req, res) => {
    try {
        const { query } = req
        let filter = {}
        const data = await Page.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: '-createdAt',
        })
        return res.status(200).send({
            error: false,
            msg: "Pages fetched successfully",
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get page details
export const getPage = async (req, res) => {
    try {
        const { query } = req
        let page = await Page.findOne({ slug: query.slug })
        if(!page) {
            return res.status(404).send({
                error: true,
                msg: "Page not found",
                data:{}
            })
        }
        return res.status(200).send({
            error: false,
            msg: "Page fetched successfully",
            data: page
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


export const postPage = async (req, res) => {
    try {
        const { body } = req
        if (!!body?.slug && body?._id !== undefined) {
            let p = await Page.findOneAndUpdate({ slug: body.slug }, body)
            return res.status(200).send({
                error: false,
                msg: "Page updated successfully",
                data: p

            })
        } else {
            body.slug = body.title.toLowerCase().split(' ').join('_')
            const p = await Page.create(body)
            return res.status(200).send({
                error: false,
                msg: "Page created successfully",
                data: p
            })
        }
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({
                error: true,
                msg: "Page already exists"
            })
        }
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// delete page
export const deletePage = async (req, res) => {
    try {
        let { query } = req
        await Page.deleteOne({ slug: query.slug })
        return res.status(200).send({
            error: false,
            msg: "Page deleted successfully",
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}