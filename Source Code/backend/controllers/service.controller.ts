import { s3DeleteFiles } from "../utils/s3bucket";
import Service from "../models/service.model";

// get all services
export const getServicePublic = async (req, res) => {
    try {
        const { query } = req;
        let data = await Service.paginate(
            {},
            {
                page: query.page || 1,
                limit: query.limit || 10,
                select: '-__v',
            }
        )
        return res.status(200).send({
            error: false,
            msg: "Service",
            data,
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get services 
export const getServices = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }
        let data = await Service.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        });
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Service',
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}

// get service details
export const getService = async (req, res) => {
    try {
        const { _id } = req.query;
        let data = await Service.findOne({ _id }, '-__v');
        if (!data) {
            return res.status(404).send({
                error: true,
                msg: 'Service not found',
            });
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Service',
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}

// create or update service
export const postService = async (req, res) => {
    try {
        let { body } = req;
        if (!!body?._id) {
            let data = await Service.findById(body._id)
            if (!data) {
                return res.status(400).send({
                    error: true,
                    msg: 'Service not found'
                })
            }
            await Service.findOneAndUpdate({ _id: body._id }, body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Service'
            })
        } else {
            // Check for duplicate names in any language
            const languageKeys = Object.keys(body.name);
            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });
            const exist = await Service.findOne({
                $or: query
            });
            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: 'Service with this name already exists in one of the languages'
                })
            }

            let data = await Service.create({
                name: body.name,
                description: body.description,
                icon: body.icon,
                image: body.image
            });
            return res.status(200).send({
                error: false,
                msg: 'Service successfully created',
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

// delete service 
export const delService = async (req, res) => {
    try {
        const { _id } = req.query;
        let data = await Service.findById(_id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Service not found'
            })
        }
        if (!!data?.icon) {
            await s3DeleteFiles([data?.icon])
        }
        await Service.findOneAndDelete({ _id: data._id })
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted Service'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}
