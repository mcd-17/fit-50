import { populate } from "dotenv";
import Testimonial from "../models/testimonial.model";

export const getTestimonials = async (req, res) => {
    try {
        let { query } = req;
        const filter = {};

        if (!!query.search) {
            filter[`description`] = { $regex: `${query.search}`, $options: 'i' };
        }
        let data = await Testimonial.paginate(filter, { page: query.page || 1, limit: query.limit || 10, sort: { createdAt: -1 } })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets testimonials',
            data: data,
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const testimonialDetails = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};

        if (query._id) {
            filter['_id'] = query._id;
        }

        // Retrieve a single testimonial based on the filter
        const testimonial = await Testimonial.findOne(filter)
            .populate({
                path: 'user',
                select: 'name email image'
            })
            .sort({ createdAt: -1 });

        if (!testimonial) {
            return res.status(404).send({
                error: true,
                msg: 'Testimonial not found'
            });
        }

        return res.status(200).send({
            error: false,
            msg: 'Successfully retrieved testimonial',
            data: testimonial
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const postTestimonial = async (req, res) => {
    try {
        let { body } = req;
        let {_id} = body
        const user = res.locals.user._id;
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }
        body.user = user
        if(!!_id){
            let data = await Testimonial.findOneAndUpdate({ _id }, body, { new: true })
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated testimonials',
                data: data,
            });
        }else{
            let data = await Testimonial.create(body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully created testimonials',
                data: data,
            });
        }
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const updateTestimonialStatus = async (req, res) => {
    try {
        const { body } = req;
        const { _id } = body;
        const user = res.locals.user._id;
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }
        let data = await Testimonial.findOneAndUpdate({ _id }, body, { new: true })
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Testimonial not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully updated testimonials',
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,    
            msg: 'Internal server error'
        });
    }
}

export const deleteTestimonial = async (req, res) => {
    try {
        const { _id } = req.query;
        let data = await Testimonial.findOneAndDelete({ _id:_id })
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Testimonial not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted testimonials',
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const adminDeleteTestimonial = async (req, res) => {
    try {
        const { _id } = req.query;
        let data = await Testimonial.findOneAndDelete({ _id })
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Testimonial not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted testimonials',
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const getTestimonialByUser = async (req, res) => {
    try {
        let { query } = req;
        let user = res.locals.user._id;
        let data = await Testimonial.paginate({ user: user }, { page: query.page || 1, limit: query.limit || 10, sort: { createdAt: -1 } })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets testimonials',
            data: data,
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const getAllTestimonials = async (req, res) => {
    try {
        let { query } = req;
        let data = await Testimonial.paginate({ active: true }, { page: query.page || 1, limit: query.limit || 10, sort: { createdAt: -1 },populate:{
            path: 'user',
            select: 'name role'
        } })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets testimonials',
            data: data,
        });
    } catch (error) {
        console.error("Testimonial error:", error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}