import { s3DeleteFiles } from "../utils/s3bucket"
import Subscription from "../models/subscription.model"


// get all subscriptions
export const getSubscriptionList = async (req, res) => {
    try {
        const { query } = req
        const filter = { is_active: true }
        if (!!query.search) {
            filter['name'] = { $regex: new RegExp(query.search.toLowerCase(), "i") }
        }
        let data = await Subscription.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets subscriptions',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get subscriptions
export const getSubscriptions = async (req, res) => {
    try {
        const { query } = req
        const filter = {}
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Subscription.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets subscriptions',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


// create or update subscription
export const createSubscription = async (req, res) => {
    try {
        let { body } = req;

        // If updating an existing subscription
        if (body?._id) {
            const existingSubscription = await Subscription.findById(body._id);

            if (!existingSubscription) {
                return res.status(404).send({
                    error: true,
                    msg: "Subscription not found"
                });
            }

            // Check if a new image is provided and delete the old one
            if (body.image && body.image !== existingSubscription.image) {
                await s3DeleteFiles([existingSubscription.image]);
            }

            // Update the subscription
            await Subscription.findOneAndUpdate({ _id: body._id }, body);
            return res.status(200).send({
                error: false,
                msg: "Subscription updated successfully"
            });

        } else {
            // Language validation for new subscriptions
            delete body._id;
            const languageKeys = Object.keys(body.name);
            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });
            const exist = await Subscription.findOne({
                $or: query
            });
            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: "Subscription with the same name already exists"
                });
            }

            // Create new subscription if no duplicate exists
            await Subscription.create(body);
            return res.status(200).send({
                error: false,
                msg: "Subscription created successfully",
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};



// delete subscription
export const deleteSubscription = async (req, res) => {
    try {
        let { query } = req
        const subs = await Subscription.findByIdAndDelete(query._id)

        if (!subs) {
            return res.status(400).send({
                error: true,
                msg: "Package Not Found"
            })
        }

        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted subscription'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// subscription details
export const getSubscription = async (req, res) => {
    try {
        const { _id } = req.query;
        const subscription = await Subscription.findById(_id).select('name monthly_price yearly_price');

        if (!subscription) {
            return res.status(404).send({
                error: true,
                msg: "Subscription not found"
            });
        }

        return res.status(200).send({
            error: false,
            msg: "Subscription details fetched successfully",
            data: subscription
        });

    } catch (error) {
        console.error('Error in getSubscription:', error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};