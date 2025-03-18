import { s3DeleteFiles, s3UploadFile } from "../utils/s3bucket";
import Settings from "../models/settings.model";
import Currency from "../models/currency.model";


// get site settings
export const getSiteSettings = async (req, res) => {
    try {
        const currency = await Currency.findOne({ default: true }, 'symbol');
        const data = await Settings.findOne({}, 'title description logo dark_logo footer_text email phone address facebook twitter instagram linkedin youtube ai_key')

        const responseData = {
            ...data.toObject(),
            currency: currency ? currency.symbol : null
        };

        return res.status(200).send({
            error: false,
            msg: 'Site settings fetched successfully',
            data: responseData
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

// get setting
export const getSettings = async (req, res) => {
    try {
        const data = await Settings.findOne({});
        const currency = await Currency.findOne({ default: true }, 'symbol');
        const responseData = {
            ...data.toObject(),
            currency: currency ? currency.symbol : null
        };

        return res.status(200).send({
            error: false,
            msg: 'Settings fetched successfully',
            data: responseData
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
};

// update settings
export const postSettings = async (req, res) => {
    try {
        const { body, files } = req
        const settingData = await Settings.findById(body?._id)
        if (!!files?.logo) {
            if (!!settingData?.logo) {
                await s3DeleteFiles([settingData?.logo])
            }
            body["logo"] = await s3UploadFile(files.logo, `settings/logo`)
        }

        await Settings.updateOne({}, body, {
            upsert: true
        })
        return res.status(200).send({
            error: false,
            msg: 'Settings updated successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

