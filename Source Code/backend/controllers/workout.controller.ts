import Workout from "../models/workout.model";
import Group from "../models/group.models";


export const postWorkout = async (req, res) => {
    try {
        const { body } = req;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        if (!body) {
            return res.status(400).send({
                error: true,
                msg: "Invalid request"
            });
        }

        // Check if a group is specified
        if (body.group) {
            // Fetch the group and its members
            const group = await Group.findById(body.group);

            if (!group) {
                return res.status(400).send({
                    error: true,
                    msg: "Specified group not found"
                });
            }

            if (!group.members || group.members.length === 0) {
                return res.status(400).send({
                    error: true,
                    msg: "There are no members in this group"
                });
            }

            // If there are members, assign them to the nutrition plan
            body.members = group.members;
        }

        // Create new nutrition
        const nutrition = await Workout.create({
            userId: user,
            ...body
        });

        return res.status(200).send({
            error: false,
            msg: "Workout created successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}


export const getWorkoutList = async (req, res) => {
    try {
        const { query } = req;
        const user = res.locals.user._id;
        const filter = { userId: user };

        const workouts = await Workout.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
            select: "-userId",
            populate: [
                {
                    path: 'workouts',
                    select: 'name'
                },
                {
                    path: 'group',
                    select: 'name'
                },
                {
                    path: 'members',
                    select: '-__v -password -email -phone -role -createdAt -updatedAt -skills'
                }
            ]
        });

        return res.status(200).send({
            error: false,
            msg: "Successfully gets workout list",
            data: workouts
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

export const getWorkoutDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user._id;

        const workout = await Workout.findOne({ _id: _id, userId: user })
            .populate('workouts', 'name')
            .populate('group', 'name')
            .populate('members', '-__v -password -email -phone -role -createdAt -updatedAt -skills');

        if (!workout) {
            return res.status(404).send({
                error: true,
                msg: "Workout not found"
            });
        }

        return res.status(200).send({
            error: false,
            msg: "Successfully fetched workout details",
            data: workout
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

// update workout
export const updateWorkout = async (req, res) => {
    try {
        const { body } = req;

        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        if (!body._id) {
            return res.status(400).send({
                error: true,
                msg: "Invalid request"
            });
        }

        const workout = await Workout.findById(body._id);

        if (!workout) {
            return res.status(404).send({
                error: true,
                msg: "Workout not found"
            });
        }

        if (workout.userId.toString() !== user.toString()) {
            return res.status(400).send({
                error: true,
                msg: "You are not authorized to edit this workout"
            });
        }

        // Check if a group is specified
        if (body.group) {
            // Fetch the group and its members
            const group = await Group.findById(body.group);

            if (!group) {
                return res.status(400).send({
                    error: true,
                    msg: "Specified group not found"
                });
            }

            if (!group.members || group.members.length === 0) {
                return res.status(400).send({
                    error: true,
                    msg: "There are no members in this group"
                });
            }

            // If there are members, assign them to the workout
            body.members = group.members;
        }

        // Remove the _id field from the body to avoid duplicate key error
        const { _id, ...updateData } = body;

        // Update workout
        await Workout.findByIdAndUpdate(_id, { $set: updateData });

        return res.status(200).send({
            error: false,
            msg: "Workout updated successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};


//delete workout
export const deleteWorkout = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        const workout = await Workout.findById(_id);

        if (!workout) {
            return res.status(404).send({
                error: true,
                msg: "Workout not found"
            });
        }

        if (workout.userId.toString() !== user.toString()) {
            return res.status(400).send({
                error: true,
                msg: "You are not authorized to delete this workout"
            });
        }

        await Workout.findByIdAndDelete(_id);

        return res.status(200).send({
            error: false,
            msg: "Workout deleted successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}



// get user nutrition list
export const getUserWorkoutList = async (req, res) => {
    try {
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        // Find groups the user is part of
        const userGroups = await Group.find({ members: user }).select('_id');

        // Create a filter that checks if the user is either a direct member or part of a group
        const filter = {
            $or: [
                { members: user },
                { group: { $in: userGroups.map(group => group._id) } }
            ]
        };

        // Fetch paginated results
        const workout = await Workout.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            select: "-userId -members",
            populate: [
                {
                    path: 'group',
                    select: 'name'
                },
                {
                    path: 'workouts',
                    select: 'name'
                }
            ]
        });

        return res.status(200).send({
            error: false,
            msg: "Successfully retrieved nutrition list",
            data: workout
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}
