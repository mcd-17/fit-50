import { s3DeleteFiles } from "../utils/s3bucket";
import Feature from "../models/feature.model";


export const getFeatures = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }
        let data = await Feature.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        });
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Features',
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}


export const postFeature = async (req, res) => {
    try {
        let { body } = req;
        if (!!body?._id) {
            let data = await Feature.findById(body._id)

            if (!!data?.image) {
                await s3DeleteFiles([data?.image])
            }

            if (!data) {
                return res.status(400).send({
                    error: true,
                    msg: 'Feature not found'
                })
            }

            await Feature.findOneAndUpdate({ _id: body._id }, body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Feature'
            })
        } else {
            // Check for duplicate names in any language
            const languageKeys = Object.keys(body.name);
            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });
            const exist = await Feature.findOne({
                $or: query
            });
            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: 'Feature with this name already exists in one of the languages'
                })
            }

            let data = await Feature.create({
                name: body.name,
                description: body.description,
                image: body.image
            });
            return res.status(200).send({
                error: false,
                msg: 'Feature successfully created',
                data,
            });
        }
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}


export const delFeature = async (req, res) => {
    try {
        const { _id } = req.query;
        let data = await Feature.findById(_id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Feature not found'
            })
        }
        if (!!data?.icon) {
            await s3DeleteFiles([data?.icon])
        }
        await Feature.findOneAndDelete({ _id: data._id })
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted Feature'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}
