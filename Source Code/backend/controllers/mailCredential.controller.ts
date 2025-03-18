import MailSettings from "../models/mailCredential.model";

// create or update mail settings
export const postMailSettings = async (req, res) => {
    try {
        let { body } = req;
        if (!!body._id) {
            const data = await MailSettings.findOneAndUpdate(
                { _id: body._id },
                body,
                { new: true, useFindAndModify: false }
            ).lean();
            return res.status(200).send({
                error: false,
                data,
                msg: 'Mail settings updated successfully',
            })
        }
        delete body._id;
        const newMailSettings = new MailSettings(body);
        const data = await newMailSettings.save();
        return res.status(200).send({
            error: false,
            msg: 'Mail settings saved successfully',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

// get mail settings
export const getMailSettings = async (req, res) => {
    try {
        const data = await MailSettings.findOne({})
        return res.status(200).send({
            error: false,
            msg: 'Mail settings fetched successfully',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}
