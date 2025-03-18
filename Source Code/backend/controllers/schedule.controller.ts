import Schedule from "../models/schedule.model";


export const postSchedule = async (req, res) => {
    try {
        let { body } = req;

        if (body?._id) {
            let data = await Schedule.findById(body._id);
            if (!data) {
                return res.status(400).send({
                    error: true,
                    msg: 'Class not found',
                });
            }


            const duplicate = await Schedule.findOne({
                day: body.day,
                time_slots: body.time_slots,
                _id: { $ne: body._id },
            });

            if (duplicate) {
                return res.status(400).send({
                    error: true,
                    msg: 'Time slot already booked for the selected day',
                });
            }

            await Schedule.findByIdAndUpdate({ _id: body._id }, body);
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Schedule',
            });
        } else {
            delete body._id;
            console.log(body);
            if(!body.trainer){
                return res.status(400).send({
                    error: true,
                    msg: 'Trainer is required',
                })
            }
            const languageKeys = Object.keys(body.event);
            const query = languageKeys.map((lang) => {
                return { [`event.${lang}`]: body.event[lang] };
            });

            const exist = await Schedule.findOne({
                day: body.day,
                time_slots: body.time_slots,
                $or: query,
            });

            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: 'Schedule with this event or time slot already exists',
                });
            }

            await Schedule.create(body);
            return res.status(200).send({
                error: false,
                msg: 'Successfully added Schedule',
            });
        }
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
};


export const getAllSchedules = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        if(!!query.search) {
            filter[`day`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }
        let data = await Schedule.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
            populate: {
                path: 'trainer',
                select: 'name email',
            },
        });

        return res.status(200).send({
            error: false,
            data,
            msg: 'Successfully fetched all schedules'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }

}

export const getSchedule = async (req, res) => {
    try {
        let { query } = req;
        let data = await Schedule.find(query).populate('trainer', 'name email image about experience');

        let transformedData = {};

        for (let schedule of data) {
            if (!transformedData[schedule.time_slots]) {
                transformedData[schedule.time_slots] = {
                    time: schedule.time_slots,
                    Monday: null,
                    Tuesday: null,
                    Wednesday: null,
                    Thursday: null,
                    Friday: null,
                    Saturday: null,
                    Sunday: null,
                };
            }

            if (query.event && schedule.event !== query.event) {
                continue;
            }

            transformedData[schedule.time_slots][schedule.day] = {
                event: schedule.event,
                trainer: {
                    _id: schedule.trainer._id,
                    name: schedule.trainer.name,
                    email: schedule.trainer.email,
                    image: schedule.trainer.image,
                    about: schedule.trainer.about,
                    experience: schedule.trainer.experience,
                }
            };
        }

        transformedData = Object.values(transformedData);

        return res.status(200).send({
            error: false,
            data: transformedData
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

export const getAvailableTimeSlots = async (req, res) => {
    try {
        const { day } = req.query;

        let availableTimeSlots = [
            '9:00 am',
            '10:00 am',
            '11:00 am',
            '12:00 pm',
            '1:00 pm',
            '2:00 pm',
            '3:00 pm',
            '4:00 pm',
            '5:00 pm',
            '6:00 pm',
            '7:00 pm',
            '8:00 pm',
        ]

        let bookedTimeSlots = await Schedule.find({ day });

        availableTimeSlots = availableTimeSlots.filter((slot) => {
            return !bookedTimeSlots.some((bookedSlot) => bookedSlot.time_slots === slot);
        });

        return res.status(200).send({
            error: false,
            msg: 'Successfully fetched available time slots',
            data: availableTimeSlots
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

//gets all events
export const getEvents = async (req, res) => {
    try {
        let tags = await Schedule.find();
        res.status(200).send({ error: false, data: tags })
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message })
    }
}

export const deleteSchedule = async (req, res) => {
    try {
        let { _id } = req.query;
        if (!_id) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid request'
            })
        }
        await Schedule.findByIdAndDelete(_id)
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted Schedule'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get trainers schedule list
export const getTrainersScheduleList = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const filter = { trainer: user };

        const schedules = await Schedule.paginate(filter, {
            page: +req.query.page || 1,
            limit: +req.query.limit || 10,
            sort: { createdAt: -1 },
            select: "-trainer",
        });

        return res.status(200).send({
            error: false,
            msg: "Successfully gets trainers schedule list",
            data: schedules
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}