import UsedCoupon from "../../models/product/used_coupon.model";
import Coupon from "../../models/product/coupon.model";
import moment from "moment";


// coupon list for admin
export const getAdminCouponList = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};

        if (!!query.search) {
            filter["$or"] = [
                { name: { $regex: query.search, $options: 'i' } },
                { code: { $regex: query.search, $options: 'i' } }
            ];
        }

        let data = await Coupon.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        });

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Coupon',
            data,
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }

}

// add or update coupon
export const postCoupon = async (req, res) => {
    try {
        const { body } = req;
        if (body._id) {
            if (!!body.code) delete body.code;
            await Coupon.findByIdAndUpdate(body._id, { $set: body });
            return res.status(200).json({
                error: false,
                msg: 'Successfully updated'
            });
        } else {
            delete body._id
            const isExists = await Coupon.findOne({ code: body?.code?.toLowerCase() })
            if (!!isExists) {
                return res.status(404).json({
                    error: true,
                    msg: 'Coupon code already exists'
                })
            }
            await Coupon.create({ ...body });
            return res.status(200).json({
                error: false,
                msg: 'Successfully created'
            })
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}


// delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { _id } = req.query;

        const deletedCoupon = await Coupon.findByIdAndDelete(_id);

        if (!deletedCoupon) {
            return res.status(404).json({
                error: true,
                msg: 'Coupon not found'
            });
        }

        return res.status(200).json({
            error: false,
            msg: 'Coupon deleted successfully'
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}


// toggle coupon status
export const toggleCouponStatus = async (req, res) => {
    try {
        const { _id } = req.query;

        const coupon = await Coupon.findById(_id);

        if (!coupon) {
            return res.status(404).json({
                error: true,
                msg: 'Coupon not found'
            });
        }

        await Coupon.findByIdAndUpdate(_id, { status: !coupon.status });

        return res.status(200).json({
            error: false,
            msg: 'Successfully updated Coupon'
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}


// coupon list for user
export const getCouponList = async (req, res) => {
    try {
        const filter = { status: true, expire_at: { $gte: new Date() } };
        let data = await Coupon.find(filter).sort({ createdAt: -1 }).select('-__v');
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Coupon',
            data,
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}

export const applyCoupon = async (req, res, next) => {
    try {
        const { body } = req;
        await couponCheck(body, req, res, false)
    } catch (e) {
        return res.status(500).json({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const couponCheck = async (body, req, res, order = false) => {
    try {
        const { user } = res.locals;
        const couponCode = await Coupon.findOne({ code: body?.code?.trim()?.toLowerCase() });
        const cusUsed = await UsedCoupon.find({ user: user?._id }).count();

        if (!couponCode) {
            return res.status(400).json({
                error: true,
                msg: `Coupon does not exist!`
            })
        }
        if (couponCode?.status === false) {
            return res.status(400).json({
                error: true,
                msg: `Coupon is not in service!`
            })
        }

        const todayDate = moment(Date.now()).format();
        const expireDate = moment(couponCode.expire_at).format();

        if (todayDate >= expireDate) {
            const msg = `Coupon "${body?.code}" expired!`;
            return res.status(400).json({
                error: true,
                msg
            });
        }
        if (cusUsed >= couponCode.usage_limit_per_user) {
            const msg = `Failed, user maximum limit crossed!`;
            return res.status(400).json({ error: true, msg });
        }

        // if ((+body?.net_price) !== (+body?.sub_total)) {
        //     return res.status(404).json({
        //         error: true,
        //         msg: "Wrong Input"
        //     })
        // }

        // minimum order price check
        if (couponCode?.minimum_order_amount >= +body?.sub_total) {
            return res.status(404).json({
                error: true,
                msg: `Minimum order amount: ${couponCode?.min_spend}`
            })
        }


        let current_subtotal, saved_money, coupon_value;
        if (couponCode?.type === 'percentage') {
            saved_money = (body?.sub_total * couponCode?.discount) / 100
            current_subtotal = Number((body?.sub_total - saved_money).toFixed(2))
            coupon_value = `${couponCode?.discount}%`

        } else if (couponCode?.type === 'flat') {
            saved_money = couponCode?.discount
            current_subtotal = Number((body?.sub_total - saved_money).toFixed(2))
            coupon_value = `${couponCode?.discount}`
        }

        if (order === true) {
            return {
                current_subtotal: Number(current_subtotal).toFixed(2),
                saved_money : Number(saved_money).toFixed(2)
            }
        } else {
            return res.status(200).send({
                error: false,
                msg: "Coupon applied successfully",
                data: {
                    current_subtotal,
                    saved_money,
                    coupon_value
                }
            })
        }

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}
