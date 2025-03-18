import mongoose from "mongoose";
import MarketingGroup from "../../models/marketing/marketing-group.model";
import User from "../../models/user.model";

export const getMarketingGroups = async (req, res) => {
    const {query} = req;
    if (query._id) {
        try {
            // @ts-ignore
            const _id = new mongoose.Types.ObjectId(query._id);
            // @ts-ignore
            const data = await MarketingGroup.aggregatePaginate(
                    MarketingGroup.aggregate([
                        {
                            $match: {_id: _id}
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "groups",
                                foreignField: "_id",
                                as: "groups"
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                groups: {
                                    _id: 1,
                                    name: 1,
                                    phone: 1,
                                    email: 1,
                                }
                            }
                        },
                    ]),
                    {
                        page: query.page || 1,
                        limit: query.size || 20,
                    }
                )
            ;
            const payload = {_id: mongoose.Types.ObjectId, name: '', docs: []};
            // @ts-ignore
            payload._id = _id
            payload.name = data.docs[0]?.name || ''
            payload.docs = data.docs[0]?.groups || ''

            //search filters
            const filters = {}
            if (query.search) {
                filters['name'] = new RegExp(query.search, 'i');
                filters['email'] = new RegExp(query.search, 'i');
                filters['phone'] = new RegExp(query.search, 'i');
            }
            payload.docs = payload.docs.filter((item) => {
                return item.name.match(filters['name']) || item.email.match(filters['email']) || item.phone.match(filters['phone'])
            })

            return res.status(200).send({
                error: false,
                msg: "Fetch Successful",
                data: payload
            })
        } catch (err) {
            console.log('This error occurred in getMarketingGroups function');
            return res.status(500).send({
                error: true,
                msg: "Server failed"
            })
        }


    } else {
        try {
            let data = [];
            let filter = {};
            if(!!query.status) {
                filter['status'] = query.status == 'true'
            }
            if(!!query?.type) {
                filter['type'] = query.type ;
            }
            // if (req.query.type === "email") {
            //     if (req.query.status === 'true') {
            //         data = await MarketingGroup.find({type: "email", status: true})
            //     } else {
            //         data = await MarketingGroup.find({type: "email"})
            //     }
            // } else if (req.query.type === "sms") {
            //     if (req.query.status === 'true') {
            //         data = await MarketingGroup.find({type: "sms", status: true})
            //     } else {
            //         data = await MarketingGroup.find({type: "sms"})
            //     }
            // } else if (req.query.type === "whatsapp_sms") {
            //     if (req.query.status === 'true') {
            //         data = await MarketingGroup.find({type: "whatsapp_sms", status: true})
            //     } else {
            //         data = await MarketingGroup.find({type: "whatsapp_sms"})
            //     }
            // } else if (req.query.type === "notification") {
            //     if (req.query.status === 'true') {
            //         data = await MarketingGroup.find({type: "notification", status: true})
            //     } else {
            //         data = await MarketingGroup.find({type: "notification"})
            //     }
            // }else{
                data = await MarketingGroup.aggregatePaginate([
                    {
                        $match:filter
                    }
                ],{
                    page: query.page || 1,
                    limit: query.limit || 10,
                    sort:{createdAt:-1}
                })
            

            return res.status(200).send({
                error: false,
                msg: "Fetch Successful",
                data: data
            })
        } catch (err) {
            console.log('This error occurred in getMarketingGroups function');
            return res.status(500).send({
                error: true,
                msg: "Server failed"
            })
        }
    }
}
export const postMarketingGroups = async (req, res) => {

    const {body} = req;

    if (!!body._id) {
        try {
            await MarketingGroup.findByIdAndUpdate(body._id, body, {new: true});
            return res.status(200).send({
                error: false,
                msg: "Update Successful",
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).send({
                error: true,
                msg: "Server failed"
            })
        }

    } else {
        try {
            await MarketingGroup.create({name: body.name, groups: body.groups, active: true, type: body.type});
            return res.status(200).send({
                error: false,
                msg: "Successfully Created Group",
            })

        } catch (err) {
            console.log(err.message);
            return res.status(500).send({
                error: true,
                msg: "Server failed"
            })
        }
    }
}

export const delMarketingGroups = async (req, res) => {
    try {
        await MarketingGroup.findByIdAndDelete(req.query._id);
        return res.status(200).send({
            error: false,
            msg: "Delete Successful",
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            error: true,
            msg: "Server failed"
        })
    }
}

export const getAvailableUsers = async (req, res) => {
    try {
        const { query } = req;
        const { groupId, search } = query;

        const availableUsers = await MarketingGroup.findById(groupId).populate({
            path: 'groups',
            model: 'user',
            select: 'name email phone image role',
            match: search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {}
        });

        return res.status(200).send({
            error: false,
            data: availableUsers
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const postUsers = async (req, res) => {
    try {
        const { body } = req;
        const { _id, userId, delete: isDelete } = body;

        if (!_id) {
            return res.status(400).send({
                error: true,
                msg: "Marketing group ID is required"
            });
        }

        if (!userId) {
            return res.status(400).send({
                error: true,
                msg: "User ID is required"
            });
        }

        const marketingGroup = await MarketingGroup.findById(_id);

        if (!marketingGroup) {
            return res.status(404).send({
                error: true,
                msg: "Marketing group not found"
            });
        }

        if (isDelete) {
            // Remove user from the group
            marketingGroup.groups = marketingGroup.groups.filter((groupId) => groupId.toString() !== userId.toString());
        } else {
            // Add user to the group
            if (!marketingGroup.groups.includes(userId)) {
                marketingGroup.groups.push(userId);
            }
        }

        await marketingGroup.save();

        return res.status(200).send({
            error: false,
            msg: isDelete ? "User removed from the group" : "User added to the group"
        });
    } catch (error) {
        console.error("Error in postUsers:", error);
        return res.status(500).send({
            error: true,
            msg: "Internal server error"
        });
    }
};