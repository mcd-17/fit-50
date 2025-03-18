import { s3DeleteFiles } from "../utils/s3bucket"
import Gallery from "../models/gallery.model"

export const postGallery = async (req, res) => {
    try {
        let { body } = req
        await Gallery.create(body)
        return res.status(200).send({
            error: false,
            msg: 'Gallery created successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const getGallery = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        let data = await Gallery.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 }
        })
        return res.status(200).send({
            error: false,
            msg: 'Gallery fetched successfully',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const deleteGallery = async (req, res) => {
    try {
        let { query } = req
        let data = await Gallery.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Gallery not found'
            })
        }
        if(!!data?.image) {
            s3DeleteFiles([data?.image])
        }
        await Gallery.findOneAndDelete({ _id: query._id })
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted Gallery'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })  
    }
}