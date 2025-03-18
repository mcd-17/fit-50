import Group from "../models/group.models";
import Nutrition from "../models/nutrition.model";

export const postNutrition = async (req, res) => {
    try {
        const { body } = req;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found",
            });
        }

        // Validate if group or members are specified
        if (!body.group && (!body.members || body.members.length === 0)) {
            return res.status(400).send({
                error: true,
                msg: "Either a group or members must be specified",
            });
        }

        // Validate nutrition schedule
        if (!body.nutrition_schedule || !body.nutrition_schedule.length) {
            return res.status(400).send({
                error: true,
                msg: "Nutrition schedule is required",
            });
        }

        // Validate each nutrition schedule entry
        for (const schedule of body.nutrition_schedule) {
            if (!schedule.day || !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(schedule.day)) {
                return res.status(400).send({
                    error: true,
                    msg: `Invalid day: ${schedule.day}. Must be one of [monday, tuesday, wednesday, thursday, friday, saturday, sunday].`,
                });
            }

            if (!schedule.meals || !schedule.meals.length) {
                return res.status(400).send({
                    error: true,
                    msg: `Meals are required for the day: ${schedule.day}.`,
                });
            }

            for (const meal of schedule.meals) {
                if (!meal.type || !['Breakfast', 'Mid Morning Snacks', 'Lunch', 'Afternoon Snacks', 'Dinner'].includes(meal.type)) {
                    return res.status(400).send({
                        error: true,
                        msg: `Invalid meal type for ${schedule.day}. Must be one of [Breakfast, Mid Morning Snacks, Lunch, Afternoon Snacks, Dinner].`,
                    });
                }
                if (!meal.description) {
                    return res.status(400).send({
                        error: true,
                        msg: `Description is required for ${meal.type} on ${schedule.day}.`,
                    });
                }
            }
        }

        // If a group is specified, fetch its members
        if (body.group) {
            const group = await Group.findById(body.group);

            if (!group) {
                return res.status(400).send({
                    error: true,
                    msg: "Specified group not found",
                });
            }

            if (!group.members || group.members.length === 0) {
                return res.status(400).send({
                    error: true,
                    msg: "There are no members in this group",
                });
            }

            body.members = group.members;
        }
        const nutrition = await Nutrition.create({
            userId: user,
            ...body,
        });

        return res.status(201).send({
            error: false,
            msg: "Nutrition schedule created successfully",
            data: nutrition,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error",
        });
    }
};



// edit nutrition
export const editNutrition = async (req, res) => {
    try {
        const { body } = req;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        if (!body || !body._id) {
            return res.status(400).send({
                error: true,
                msg: "Invalid request"
            });
        }

        // Find the existing nutrition record
        const nutrition = await Nutrition.findById(body._id);

        if (!nutrition) {
            return res.status(400).send({
                error: true,
                msg: "Nutrition not found"
            });
        }

        // Verify user ownership
        if (nutrition.userId.toString() !== user.toString()) {
            return res.status(403).send({
                error: true,
                msg: "You are not authorized to edit this nutrition"
            });
        }

        // Handle group assignment
        if (body.group) {
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

            // Assign group members to the nutrition plan
            body.members = group.members;
        }

        // Validate `nutrition_schedule`
        if (body.nutrition_schedule && Array.isArray(body.nutrition_schedule)) {
            const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const validMealTypes = ['Breakfast', 'Mid Morning Snacks', 'Lunch', 'Afternoon Snacks', 'Dinner'];

            for (const schedule of body.nutrition_schedule) {
                if (!validDays.includes(schedule.day)) {
                    return res.status(400).send({
                        error: true,
                        msg: `Invalid day: ${schedule.day}`
                    });
                }

                if (!Array.isArray(schedule.meals)) {
                    return res.status(400).send({
                        error: true,
                        msg: `Meals for ${schedule.day} must be an array`
                    });
                }

                for (const meal of schedule.meals) {
                    if (!validMealTypes.includes(meal.type)) {
                        return res.status(400).send({
                            error: true,
                            msg: `Invalid meal type: ${meal.type} for ${schedule.day}`
                        });
                    }

                    if (!meal.description || typeof meal.description !== 'string') {
                        return res.status(400).send({
                            error: true,
                            msg: `Meal description for ${meal.type} on ${schedule.day} is required`
                        });
                    }
                }
            }
        }

        // Update the nutrition record
        await Nutrition.findByIdAndUpdate(body._id, body, { new: true });

        return res.status(200).send({
            error: false,
            msg: "Nutrition updated successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};


// get nutrition list
export const getNutritionList = async (req, res) => {
    try {
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        const filter = { userId: user };

        const nutritions = await Nutrition.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            select: "-userId",
            populate: [
                {
                    path: 'group',
                    select: '-__v -facilities -members -assign_trainers'
                },
                {
                    path: 'members',
                    select: '-__v -password -email -phone -role -createdAt -updatedAt -skills'
                }
            ]
        });

        return res.status(200).send({
            error: false,
            msg: "Successfully gets nutrition list",
            data: nutritions
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
export const getUserNutritionList = async (req, res) => {
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
        const n = await Nutrition.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            select: "-userId -members",
            populate: [
                {
                    path: 'group',
                    select: 'name'
                }
            ]
        });

        return res.status(200).send({
            error: false,
            msg: "Successfully retrieved nutrition list",
            data: n
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

export const deleteNutrition = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        const nutrition = await Nutrition.findById(_id);

        if (!nutrition) {
            return res.status(400).send({
                error: true,
                msg: "Nutrition not found"
            });
        }

        if (nutrition.userId.toString() !== user.toString()) {
            return res.status(400).send({
                error: true,
                msg: "You are not authorized to delete this nutrition"
            });
        }

        await Nutrition.findByIdAndDelete(_id);

        return res.status(200).send({
            error: false,
            msg: "Nutrition deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}


export const getNutritionDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "User not found"
            });
        }

        const nutrition = await Nutrition.findById(_id).populate('group', 'name');

        if (!nutrition) {
            return res.status(400).send({
                error: true,
                msg: "Nutrition not found"
            });
        }

        return res.status(200).send({
            error: false,
            msg: "Nutrition retrieved successfully",
            data: nutrition
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}