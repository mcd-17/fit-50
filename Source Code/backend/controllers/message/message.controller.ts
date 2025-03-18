import User from "../../models/user.model";
import Message from "../../models/message/message.model";
import mongoose from "mongoose";
import { s3DeleteFiles } from "../../utils/s3bucket";

export const createMessage = async (req,res)=>{
    try {
        const user = res.locals.user;
        if(!user){
            return res.status(400).send({error:true,msg:"Unauthorized"})
        }
        req.body.from = user._id
        const message = await Message.create(req.body)
        res.locals.io.emit('newMessage', {
            to: req.body.to,  
            from: req.body.from,
            message,           
        });
        res.status(200).send({error:false,msg:"Message sent successfully",
            data:message
        })
    } catch (error) {
        res.status(500).send({error:true,msg:error.message})
    }
}



export const userListMessageSend = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        const user = res.locals.user;
        if(user){
            filter["from"] = user._id
        }
        const usersMessage = await Message.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            populate: [
                { path: "to", select: "name email image" },
            ],
            // select: "to",
        })
        const getUniqueUser = Array.from(new Set(usersMessage?.docs?.map((item) => item.to)))
        res.status(200).send({ error: false,msg: 'Successfully gets user list',data:getUniqueUser})
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message })
    }
} 

export const getMessages = async (req, res) => {
    try {
        const { activeId, to, page = 1, limit = 10 } = req.query;
        const from = res.locals.user._id;

        if (!from || !to) {
            return res.status(400).send({ error: true, msg: "Missing sender or receiver" });
        }
        if (activeId) {
            await Message.updateMany(
                { from: new mongoose.Types.ObjectId(to), to: new mongoose.Types.ObjectId(from), seen: false },
                { $set: { seen: true } }
            );
        }
        const filter = {
            $or: [
                { from: new mongoose.Types.ObjectId(from), to: new mongoose.Types.ObjectId(to) },
                { from: new mongoose.Types.ObjectId(to), to: new mongoose.Types.ObjectId(from) },
            ],
        };

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 },
            select: "from to message image file seen delivered createdAt", 
        };

        const data = await Message.paginate(filter, options);

        return res.status(200).send({
            error: false,
            msg: "Messages fetched successfully",
            data,
        });
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message });
    }
};

export const getChatList = async (req, res) => {
    try {
        const { query } = req;
        const userId = new mongoose.Types.ObjectId(res.locals.user._id);

        const filters = {
            $or: [{ from: userId }, { to: userId }],
        };

        const searchFilter = query?.search
            ? { "chatUserDetails.name": { $regex: query.search, $options: "i" } } // Case-insensitive search
            : {};

        const chatList = await Message.aggregate([
            { $match: filters },
            {
                $group: {
                    _id: {
                        chatUser: {
                            $cond: [{ $eq: ["$from", userId] }, "$to", "$from"],
                        },
                    },
                    lastMessage: { $last: "$$ROOT" }, // Get the latest message
                    unseenCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$to", userId] }, { $eq: ["$seen", false] }] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users", // Collection name for User model
                    localField: "_id.chatUser",
                    foreignField: "_id",
                    as: "chatUserDetails",
                },
            },
            { $unwind: "$chatUserDetails" },
            {
                $match: {
                    "chatUserDetails._id": { $ne: userId }, // Exclude the current user
                    ...searchFilter, // Apply the search filter if provided
                },
            },
            { $sort: { "lastMessage.createdAt": -1 } },
            {
                $project: {
                    _id: 0,
                    chatUser: "$chatUserDetails",
                    lastMessage: {
                        message: "$lastMessage.message",
                        createdAt: "$lastMessage.createdAt",
                    },
                    unseenCount: 1,
                },
            },
        ])
            .skip((+query.page - 1 || 0) * (+query.limit || 10))
            .limit(+query.limit || 10);

        res.status(200).send({
            error: false,
            msg: "Chat list fetched successfully",
            data: chatList,
        });
    } catch (error) {
        console.error("Error in getChatList:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const deleteMessage = async (req, res) => {
    try {
        const { _id } = req.query;
        let find = await Message.findById(_id);
        if(find){
            if(find.image){
                await s3DeleteFiles([find.image])
            }else if(find.file){
                await s3DeleteFiles([find.file])
            }
        }
        const message = await Message.findByIdAndDelete(_id);
        if (!message) {
            return res.status(404).send({ error: true, msg: "Message not found" });
        }
        res.status(200).send({ error: false, msg: "Message deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message });
    }
};