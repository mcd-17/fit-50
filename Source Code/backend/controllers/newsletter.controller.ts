import Newsletter from "../models/newsletter";

export const getNewsletters = async (req, res) => {
    try {
        const { query } = req
        const filter = {}

        if (!!query.search) {
            filter['email'] = { $regex: `${query.search}`, $options: 'i' };
        }
        let data = await Newsletter.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 }
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully fetched newsletters',
            data
        })
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message })
    }
}

export const postNewsletter = async (req, res) => {
    try {
        const { body } = req
        const exist = await Newsletter.findOne({ email: body.email })
        if (exist) {
            return res.status(400).send({
                error: true,
                msg: 'Email already subscribed'
            })
        }
        await Newsletter.create(body)
        return res.status(200).send({
            error: false,
            msg: 'Successfully subscribed'
        })
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message })
    }
}

export const deleteNewsletter = async (req, res) => {
    try {
        const { query } = req
        await Newsletter.findByIdAndDelete(query._id)
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted'
        })
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message })
    }
}