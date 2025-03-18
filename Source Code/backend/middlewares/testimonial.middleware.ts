import UserSubscription from "../models/userSubscription.model";

export const isSubscribedUser = async (req, res, next) => {
    try {
        let { user } = res.locals;
        if (!user || !user._id) {
            return res.status(401).send({
                error: true,
                msg: 'Unauthorized'
            });
        }
        let subscribe = await UserSubscription.findOne({ 'user': user._id, 'active': true });
        if (subscribe && subscribe.active===true) {
            next(); 
        } else {
            res.status(401).send({
                error: true,
                msg: 'Please subscribe to get access to this feature'
            });
        }
    } catch (err) {
        console.error("Error in isSubscribedUser:", err);
        res.status(500).send({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};