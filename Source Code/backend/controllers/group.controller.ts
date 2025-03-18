import User from "../models/user.model";
import Group from "../models/group.models";
import mongoose from "mongoose";
import UserSubscription from "../models/userSubscription.model";


// group list for admin
export const getGroupListAdmin = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Group.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
            populate: {
                path: 'assign_trainers',
                select: '-__v -password -createdAt -updatedAt -status -email -phone -address -dob'
            }
        });
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Group List',
            data,
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        })
    }
}


// add or update group
export const postGroup = async (req, res) => {
    try {
        const { body } = req;
        const { _id, name, facilities, status, assign_trainers, image } = body;

        if (_id) {
            // Update existing group
            const updatedGroup = await Group.findByIdAndUpdate(
                _id,
                { name, facilities, status, assign_trainers, image },
                { new: true, runValidators: true }
            );

            if (!updatedGroup) {
                return res.status(404).json({
                    error: true,
                    msg: 'Group not found'
                });
            }

            return res.status(200).json({
                error: false,
                msg: 'Group updated successfully',
                data: updatedGroup
            });
        } else {
            const languageKeys = Object.keys(body.name);

            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });
            const exist = await Group.findOne({
                $or: query
            });
            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: `Group already exists with name ${name[languageKeys[0]]}`
                });
            }

            const newGroup = new Group({ name, facilities, status, assign_trainers, image });
            await newGroup.save();

            return res.status(201).json({
                error: false,
                msg: 'Group added successfully',
                data: newGroup
            });
        }
    } catch (error) {
        console.error('Error in addGroup:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};


// get trainers list
export const getTrainerList = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }, 'name email gender image');

        return res.status(200).json({
            error: false,
            msg: 'Successfully gets Trainer List',
            data: trainers
        });
    } catch (error) {
        console.error('Error in getTrainerList:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
}


// delete group
export const deleteGroup = async (req, res) => {
    try {
        const { _id } = req.query;

        const group = await Group.findByIdAndDelete({ _id: _id });

        if (!group) {
            return res.status(404).json({
                error: true,
                msg: 'Group not found'
            });
        }

        return res.status(200).json({
            error: false,
            msg: 'Group deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteGroup:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
}


// group list for user
export const getGroupListUser = async (req, res) => {
    try {
        const { query } = req;
        const filter = { status: true };
        const langCode = query.langCode || 'en';
        const user = res.locals.user ? res.locals.user._id : null;

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Group.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v -assign_trainers',
            lean: true
        });

        // Clean up the response and conditionally add in_group field
        data.docs = data.docs.map(group => {
            const cleanGroup = {
                _id: group._id.toString(),
                name: group.name,
                facilities: group.facilities,
                members: group.members.map(id => id.toString()),
                status: group.status,
                image: group.image,
                createdAt: group.createdAt,
                updatedAt: group.updatedAt,
            };

            // Conditionally add the in_group field if the user is logged in
            if (user) {
                cleanGroup['in_group'] = group.members.includes(user);
            }

            return cleanGroup;
        });

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Group List',
            data,
        });
    } catch (error) {
        console.error('Error in getGroupListUser:', error);
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
};

// group details
export const getGroupDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user ? res.locals.user._id : null;

        // Fetch group details and populate 'assign_trainers' and 'members' fields
        const group = await Group.findById(_id)
            .populate({
                path: 'assign_trainers',
                select: 'name phone email image _id role'
            })
            .populate({
                path: 'members',
                select: 'name email phone image _id'
            });

        if (!group) {
            return res.status(404).json({
                error: true,
                msg: 'Group not found'
            });
        }

        // Clean up the response and conditionally add in_group field
        const cleanGroup = {
            _id: group._id.toString(),
            name: group.name,
            facilities: group.facilities,
            members: group.members.map(member => ({
                _id: member._id.toString(),
                name: member.name,
                phone: member.phone,
                email: member.email,
                image: member.image
            })),
            assign_trainers: group.assign_trainers.map(trainer => ({
                _id: trainer._id.toString(),
                name: trainer.name,
                phone: trainer.phone,
                email: trainer.email,
                image: trainer.image
            })),
            status: group.status,
            image: group.image,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        };

        // Conditionally add the in_group field if the user is logged in
        if (user) {
            cleanGroup['in_group'] = group.members.some(member => member._id.toString() === user.toString());
        }

        return res.status(200).json({
            error: false,
            msg: 'Successfully gets Group Details',
            data: cleanGroup
        });

    } catch (error) {
        console.error('Error in getGroupDetails:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};


// join group
export const joinOrLeaveGroup = async (req, res) => {
    try {
        const { _id } = req.body;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(401).json({
                error: true,
                msg: 'Please login to join group'
            });
        }

        // check user has subscription or not (for joining)
        const userSubscription = await UserSubscription.findOne({ user: user, active: true });

        if (!userSubscription) {
            return res.status(400).json({
                error: true,
                msg: 'You need to have an active subscription to join a group'
            });
        }

        const group = await Group.findById({ _id: _id });

        if (!group) {
            return res.status(404).json({
                error: true,
                msg: 'Group not found'
            });
        }

        const isMember = group.members.includes(user);

        if (isMember) {
            // Leave the group
            group.members = group.members.filter(member => member.toString() !== user.toString());
            await group.save();

            return res.status(200).json({
                error: false,
                msg: 'You have successfully left the group'
            });
        } else {
            // Join the group
            group.members.push(user);
            await group.save();

            return res.status(200).json({
                error: false,
                msg: 'You have successfully joined the group'
            });
        }
    } catch (error) {
        console.error('Error in joinOrLeaveGroup:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};


// trainer group lists
export const trainerGroupList = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const filter = { assign_trainers: user };

        const data = await Group.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
            lean: true
        });
        

        return res.status(200).json({
            error: false,
            msg: 'Successfully gets Trainer Group List',
            data
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
}

// see members under this group for 
export const getGroupMembers = async (req, res) => {
    try {
        const { _id } = req.query;

        const user = res.locals.user._id;

        if (!user) {
            return res.status(401).json({
                error: true,
                msg: 'Please login to see group members'
            });
        }

        const filter = { _id: _id };

        const members = await Group.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            select:'members',
            populate: {
                path: 'members',
                select: 'name email image phone ',
            }
        })

        return res.status(200).json({
            error: false,
            msg: 'Successfully gets Group Members',
            data: members
        });


    } catch (error) {
        console.error('Error in getGroupMembers:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};


export const getGroupMemberDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(401).json({
                error: true,
                msg: 'Please login to see group members'
            });
        }

        const member = await User.findById({ _id: _id }).select('name email phone image uid skills dob gender address');  
        const subscription = await UserSubscription.find({ user: _id, active: true }).select("uid price subscription_type active start_date end_date");  
        const newMember = { member, subscription }

        return res.status(200).json({
            error: false,
            msg: 'Successfully gets Group Member Details',
            data: newMember
        });

    } catch (error) {
        console.error('Error in getGroupMemberDetails:', error);
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
}


// user groups
export const getUserGroups = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const filter = { members: user };

        const data = await Group.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
            lean: true
        });

        return res.status(200).json({
            error: false,
            msg: 'Successfully gets User Group List',
            data
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Internal Server Error'
        });
    }
}