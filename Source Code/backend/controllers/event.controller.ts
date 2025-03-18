import mongoose from "mongoose";
import Event from "../models/event.model";
import { s3DeleteFiles } from "../utils/s3bucket";


// create event
export const postEvent = async (req, res) => {
    try {
        let { body } = req;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).json({
                msg: 'User not found',
                error: true
            });
        }

        if (body._id) {
            await Event.findOneAndUpdate({ _id: body._id }, body);
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Event'
            });
        } else {
            const languageKeys = Object.keys(body.name);

            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });

            const exist = await Event.findOne({
                $or: query
            });

            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: `Event already exists`
                });
            }

            const newEvent = new Event(
                {
                    name: body.name,
                    description: body.description,
                    image: body.image,
                    start_date: body.start_date,
                    end_date: body.end_date,
                    location: body.location,
                    is_active: body.is_active,
                }
            );

            await newEvent.save();
            return res.status(200).send({
                error: false,
                msg: 'Event has been created successfully',
            });
        }

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}


// get all events
export const getAdminEvents = async (req, res) => {
    try {
        const { query } = req;
        const filter = {}
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Event.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        })

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets events',
            data
        })

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// get event by id
export const getEventDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user ? res.locals.user._id : null;

        if (!_id) {
            return res.status(400).send({
                error: true,
                msg: 'Event id is required'
            });
        }

        const pipeline: any[] = [
            { $match: { _id: new mongoose.Types.ObjectId(_id) } },
            {
                $addFields: {
                    total_interested_users: { $size: "$interested_users" }
                }
            },
            {
                $project: {
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0
                }
            }
        ];

        if (user) {
            pipeline.push({
                $addFields: {
                    is_interest: { $in: [new mongoose.Types.ObjectId(user), "$interested_users"] }
                }
            });
        }

        const eventDetails = await Event.aggregate(pipeline);

        if (!eventDetails.length) {
            return res.status(404).send({
                error: true,
                msg: 'Event not found'
            });
        }

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets event',
            data: eventDetails[0]
        });

    } catch (error) {
        console.error('Error in getEventDetails:', error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// get all events for user
export const getEventList = async (req, res) => {
    try {
        const { query } = req;
        const filter = { is_active: true }
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Event.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        })

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets events',
            data
        })

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// delete event
export const deleteEvent = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).send({
                error: true,
                msg: 'Event id is required'
            });
        }

        const event = await Event.findOne({ _id: _id });

        if (!event) {
            return res.status(404).send({
                error: true,
                msg: 'Event not found'
            });
        }

        await Event.deleteOne({ _id: _id });

        return res.status(200).send({
            error: false,
            msg: 'Event has been deleted successfully'
        })

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// interested event
export const postInterestedEvent = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const { _id } = req.body;

        // Fetch the event by its ID
        const event = await Event.findById(_id);

        if (!event) {
            return res.status(404).send({
                error: true,
                msg: 'Event not found'
            });
        }

        const userIndex = event.interested_users.indexOf(user);

        if (userIndex > -1) {
            event.interested_users.splice(userIndex, 1);
            event.total_interested_users -= 1;
            await event.save();

            return res.status(200).send({
                error: false,
                msg: 'Successfully removed interest from the event',
            });
        } else {
            // User is not interested, so add them
            event.interested_users.push(user);
            event.total_interested_users += 1;
            await event.save();

            return res.status(200).send({
                error: false,
                msg: 'Successfully expressed interest in the event',
            });
        }

    } catch (error) {
        console.error('Error in postInterestedEvent:', error);
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};