import PaymentMethod from "../models/paymentMethod.model"
export const getPaymentMethods = async (req, res) => {
    try {
        let { query } = req
        let filters = {}
        const { query: { search } } = req
        if (!!search) {
            filters['name']= { $regex: search, $options: 'i' }
        }
        let data = await PaymentMethod.paginate(filters, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        })
        return res.status(200).send({
            error: false,
            msg: 'Payment methods fetched successfully',
            data
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


export const getPaymentUserMethods = async (req, res) => {
    try {
        let { query } = req
        let filters = {}
        let data = await PaymentMethod.paginate(filters, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
            select: '-config'
        })
        return res.status(200).send({
            error: false,
            msg: 'Payment methods fetched successfully',
            data
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

// get payment method details
export const getPaymentMethod = async (req, res) => {
    try {
        const { query } = req
        let data = await PaymentMethod.findById(query._id)
        if (!data) {
            return res.status(404).send({
                error: true,
                msg: 'Payment method not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Payment method fetched successfully',
            data
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}



export const postPaymentMethod = async (req, res) => {
    try {
        const { body, files } = req;
        if (typeof body.config === 'string') {
            body.config = JSON.parse(body.config);
        }

        // Ensure the config field is an object
        if (typeof body.config !== 'object') {
            return res.status(400).send({
                error: true,
                msg: 'Invalid config format'
            });
        }
        if (!!body._id) {
            let method = await PaymentMethod.findById(body._id);
            if (!method) {
                return res.status(404).send({
                    error: true,
                    msg: 'Payment method not found'
                });
            }

            await PaymentMethod.findByIdAndUpdate(body._id, body);

            return res.status(200).send({
                error: false,
                msg: 'Payment method updated successfully',
            });
        }

        // Handle creating a new payment method
        const existingMethod = await PaymentMethod.findOne({ type: body.type });
        if (existingMethod) {
            return res.status(400).send({
                error: true,
                msg: 'Payment method with the same type already exists'
            });
        }

        delete body._id;
        await PaymentMethod.create({ ...body });

        return res.status(200).send({
            error: false,
            msg: 'Payment method created successfully'
        });

    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({
                error: true,
                msg: 'Payment method already exists'
            });
        }
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
};


// delete payment method
export const deletePaymentMethod = async (req, res) => {
    try {
        const { query } = req
        let method = await PaymentMethod.findById(query?._id)
        if (!method) {
            return res.status(404).send({
                error: true,
                msg: 'Payment method not found'
            })
        }
        await PaymentMethod.findByIdAndDelete(query._id)
        return res.status(200).send({
            error: false,
            msg: 'Payment method deleted successfully'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}