
import { sendUserEmailGeneral } from "../utils/userEmailSend"
import Contact from "../models/contact.model"

// get all contacts
export const getContacts = async (req, res) => {
    try {
        const { query } = req
        const filter = {}
        if (!!query.search) {
            filter['email'] = { $regex: new RegExp(query.search.toLowerCase(), "i") }
        }
        let data = await Contact.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v -reply',
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets contacts',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get contact details
export const getContact = async (req, res) => {
    try {
        let { query } = req
        let data = await Contact.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Contact not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Contact',
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// post contact
export const postContact = async (req, res) => {
    try {
        let { body } = req;
        await Contact.create(body)
        return res.status(200).send({
            error: false,
            msg: 'Message has been sent successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// post reply contact
export const postReplyContact = async (req, res) => {
    try {
        let { body } = req;
        let data = await Contact.findById(body._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Contact not found'
            })
        }
        if (data.status === true) {
            return res.status(400).send({
                error: true,
                msg: 'Message already replied'
            })
        }
        if (body.email) {
            const data = {
                email: body.email,
                subject: body.subject,
                message: body.message
            }
            await sendUserEmailGeneral(data)
        }
        const reply = {
            email: body.email,
            message: body.message,
            subject: body.subject
        }
        await Contact.updateOne({ _id: body._id }, { status: true, reply: reply })

        return res.status(200).send({
            error: false,
            msg: 'Message has been sent successfully',
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// delete contact
export const delContact = async (req, res) => {
    try {
        let { query } = req
        await Contact.findByIdAndDelete(query._id)
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted contact'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
