import Currency from "../models/currency.model";


export const getCurrencyList = async (req, res) => {
    try {

        let data = await Currency.find();

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets categories',
            data
        })

    } catch (error) {
        return res.status(500).json({
            msg: 'Internal server error',
            error: true,
        });
    }
}

export const postCurrency = async (req, res) => {
    try {
        const { body } = req;

        if (body._id) {
            const curr = await Currency.findById(body._id);

            if (!curr) {
                return res.status(404).json({
                    msg: 'Currency not found',
                    error: true
                });
            }

            // Handle setting default currency
            if (body.default === true) {
                // Find the currently default currency and unset it
                await Currency.findOneAndUpdate({ default: true }, { default: false });

                curr.default = true;
            } else if (body.default === false) {
                curr.default = false;
            }

            // Update other fields
            Object.assign(curr, body);

            await curr.save();

            return res.status(200).json({
                msg: 'Currency updated successfully',
                error: false,
                data: curr
            });
        } else {
            // Create new currency case
            if (body.default === true) {
                // Unset any existing default currency
                await Currency.updateMany({}, { default: false });
            }

            delete body._id; // Remove _id if passed to ensure a new currency is created

            const currency = await Currency.create(body);

            return res.status(200).json({
                msg: 'Currency created successfully',
                error: false,
                data: currency
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal server error',
            error: true,
        });
    }
};


export const delCurrency = async (req, res) => {
    try {
        const { query } = req;
        const curr = await Currency.findOne({ _id: query._id, default: true });

        if (curr) {
            return res.status(400).json({
                msg: 'Default currency cannot be deleted',
                error: true,
            });
        }

        await Currency.findByIdAndDelete(query._id);
        return res.status(200).json({
            msg: 'Currency deleted successfully',
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal server error',
            error: true,
        });
    }
};
