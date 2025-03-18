import Group from "../models/group.models";
import Notice from "../models/notice.model";

// Create a new notice
export const postNotice = async (req, res) => {
    try {
        const { group, title, content,_id } = req.body;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).json({
                error: true,
                msg: 'User not found'
            });
        }

        if (!group || !title || !content) {
            return res.status(400).json({
                error: true,
                msg: 'Please provide all required fields'
            });
        }
        if(_id){
            await Notice.findByIdAndUpdate({ _id: _id }, { title: title, content: content })
            return res.status(200).json({
                error: false,
                msg: 'Successfully updated notice'
            });
        }

        const notice = new Notice({ user: user, group: group, title: title, content: content });
        await notice.save();
        return res.status(200).json({
            error: false,
            msg: 'Successfully created notice'
        });


    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Internal server error'
        });
    }
}

// Get all notices of the user
export const getNotices = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const filter = { user: user };
        const { query } = req;

        if (query.group) {
            filter['group'] = query.group;
        }

        const notices = await Notice.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            populate: {
                path: 'group',
                select: 'name'
            }
        });

        return res.status(200).json({
            error: false,
            data: notices
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Internal server error'
        });
    }
}


// get members notice list
export const getMembersNotice = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const group = await Group.find({ members: user });
        const groupIds = group.map(g => g._id);
        const filter = { group: { $in: groupIds } };
        const { query } = req;

        const notices = await Notice.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            populate: [
                {
                    path: 'user',
                    select: 'name email',
                },
                {
                    path: 'group',
                    select: 'name'
                }
            ]
        });

        return res.status(200).json({
            error: false,
            msg: 'Successfully fetch notices',
            data: notices
        });
    }
    catch {
        return res.status(500).json({
            error: true,
            msg: 'Internal server error'
        });
    }
};

export const deleteNotice = async (req, res) => {
    try {
        const { _id } = req.query;
        let notice = await Notice.findById({ _id: _id });
        if (!notice) {
            return res.status(400).json({
                error: true,
                msg: 'Notice not found'
            });
        }
        await Notice.findByIdAndDelete({ _id: _id })
        return res.status(200).json({
            error: false,
            msg: 'Successfully deleted notice'
        });
    }
    catch {
        return res.status(500).json({
            error: true,
            msg: 'Internal server error'
        });
    }
}

