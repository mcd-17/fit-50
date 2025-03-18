import Faq from "../models/faq.model"


// get all Faqs
export const getFaqs = async (req, res) => {
    try {
        let { query } = req
        const filter = {}
        const langCode = query.langCode || 'en';
        if(!!query.search){
            filter[`question.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") }
        }
        let data = await Faq.paginate(filter, { page: query.page || 1, limit: query.limit || 10, sort: { createdAt: -1 } })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Faqs',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// create or update Faq
export const postFaq = async (req, res) => {
    try {
        let { body } = req;
        if (!!body._id) {
            await Faq.findOneAndUpdate({ _id: body._id }, body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Faq'
            })
        } else {
            delete body._id
            await Faq.create(body)
            return res.status(200).send({
                error: false,
                msg: 'Faq has been created successfully',
            })
        }
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get Faq details
export const getFaq = async (req, res) => {
    try {
        let { query } = req
        let data = await Faq.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Faq not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Faq',
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// delete Faq
export const delFaq = async (req, res) => {
    try {
        let { query } = req
        const faq = await Faq.findByIdAndDelete(query._id)

        if (!faq) {
            return res.status(400).send({
                error: true,
                msg: 'Faq not found'
            })
        }

        return res.status(200).send({
            error: false,
            msg: 'Faq has been deleted successfully'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
