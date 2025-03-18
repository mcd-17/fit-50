import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/user.model";
import { generateUid, numberGen } from "../utils/helpers";
import Otp from "../models/otp.model";
import { s3DeleteFiles, s3UploadFile, s3UploadFiles } from "../utils/s3bucket";
import mongoose from "mongoose";
import UserSubscription from '../models/userSubscription.model';
import { sendUserEmailGeneral } from '../utils/userEmailSend';
import Message from '../models/message/message.model';


const secret = process.env.SECRET


export const findUser = async (req, res) => {
    try {
        let body = req.body
        let find = await User.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
        })
        return res.status(200).send({
            error: false,
            msg: !find ? 'Account not found' : 'Account found',
            data: {
                account: !!find,
                role: find?.role,
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const sendOtp = async (req, res) => {
    try {
        let body = req.body
        let otp = numberGen()
        let find = await User.findOne({ email: body.email });
        if (body.action === 'registration' && find) {
            return res.status(400).send({
                error: true,
                msg: 'Account already registered'
            });
        }
        if (body.action !== 'registration' && !find) {
            return res.status(400).send({
                error: true,
                msg: 'Account not found'
            })
        }
        if (!!body.phone) {
            let find = await Otp.findOne({ phone: body.phone, action: body.action })
            if (!!find) {
                return res.status(400).send({
                    error: true,
                    msg: 'Verification code already send. Try again later'
                })
            }
            await Otp.create({
                phone: body.phone,
                action: body.action,
                otp: otp
            })
        }
        if (!!body.email) {
            let find = await Otp.findOne({ email: body.email, action: body.action })
            if (!!find) {
                return res.status(400).send({
                    error: true,
                    msg: 'Verification code already send. Try again later'
                })
            }
            await Otp.create({
                email: body.email,
                action: body.action,
                otp: otp
            })

            await sendUserEmailGeneral(
                {
                    email: body.email,
                    subject: 'Verification Code',
                    message: `Your verification code is ${otp}`
                }
            )
        }
        return res.status(200).send({
            error: false,
            msg: 'OTP sent successfully',
        })
    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}
export const resetPassword = async (req, res) => {
    try {
        let { body } = req
        let user;
        try {
            let decode = jwt.verify(body.token, secret)
            if (decode["action"] !== 'forgot_password') {
                return res.status(400).send({
                    error: true,
                    msg: "Invalid Token"
                })
            }
            user = await User.findById(decode["_id"])
        } catch (e) {
            return res.status(400).send({
                error: true,
                msg: "Token expired"
            })
        }
        user.password = bcrypt.hashSync(body.password, 8)
        await user.save()
        return res.status(200).send({
            error: false,
            msg: "Successfully reset password"
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


export const userRegistration = async (req, res) => {
    try {
        let body = req.body
        let query = {}
        if (!!body?.phone && !!body?.email) {
            query = {
                $or: [
                    { phone: body.phone },
                    { email: body.email }
                ]
            }
        } else {
            query = {
                [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
            }
        }
        let otp = await Otp.findOne({
            ...query,
            action: 'registration',
        }, 'otp')
        if (!otp || otp["otp"] !== body.otp) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid verification code'
            })
        }

        let find = await User.findOne(query)
        if (!!find) {
            return res.status(400).send({
                error: true,
                msg: 'User already registered'
            })
        }
        let uid = await generateUid('U-', User)
        let user = await User.create({
            uid: uid,
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 8),
            role: body.role,
        })
        let token = jwt.sign({ _id: user?._id, uid: user?.uid, role: user?.role }, secret, { expiresIn: 86400 })
        if(!!user){
            let findAdmin = await User.findOne({ role: 'admin' })
            if (findAdmin) {
                await Message.create({
                    from: findAdmin._id,
                    to: user._id,
                    message: 'Hi, Welcome to our platform. If you have any queries, please feel free to contact us.',
                    type: 'user'
                })
            }
        }
        return res.status(200).send({
            error: false,
            msg: 'User registered successfully',
            data: {
                token: token,
                role: user?.role,
            }
        })
    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


export const userLogin = async (req, res) => {
    try {
        let body = req.body
        let user: any = await User.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
        })
        if (!user || !bcrypt.compareSync(body.password, user?.password)) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid credentials'
            })
        }
        let token = jwt.sign({ _id: user?._id, uid: user?.uid, role: user?.role }, secret, { expiresIn: 86400 })
        return res.status(200).send({
            error: false,
            msg: 'Login successful',
            data: {
                token: token,
                role: user?.role,
            }
        })
    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const getUser = async (req, res) => {
    try {
        let { user } = res.locals;
        let data = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(user._id) } },
            {
                $lookup: {
                    from: 'roles',
                    let: { "permission": "$permission" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$permission"] }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                permissions: 1
                            }
                        }
                    ],
                    as: 'roles'
                }
            },
            {
                $project: {
                    uid: 1,
                    name: 1,
                    phone: 1,
                    email: 1,
                    role: 1,
                    roles: "$roles",
                    dob: 1,
                    gender: 1,
                    address: 1,
                    image: 1,
                    about: 1,
                    facebook: 1,
                    twitter: 1,
                    instagram: 1,
                    linkedin: 1,
                    experience: 1,
                    short_bio: 1,
                    occupation: 1,
                    skills: 1,
                }
            }
        ]);

        if (!data.length) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            });
        }

        let activeSubscription = await UserSubscription.findOne(
            { user: data[0]?._id, active: true },
            {
                subscription: 1,
                currency: 1,
                subscription_type: 1,
                price: 1,
                active: 1,
                payment: 1,
                start_date: 1,
                end_date: 1,
            }
        ).populate('subscription', 'name');

        const currentDate = new Date();
        if (activeSubscription) {
            if (new Date(activeSubscription.end_date) < currentDate || new Date(activeSubscription.end_date) < new Date(activeSubscription.start_date)) {
                await UserSubscription.updateOne({ _id: activeSubscription._id }, { active: false });
                activeSubscription.active = false;
            }
            data[0].activeSubscription = activeSubscription;
        }

        return res.status(200).send({
            error: false,
            msg: 'User details fetched successfully',
            data: data[0]
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
};


export const verifyOtp = async (req, res) => {
    try {
        let { body } = req
        let otp = await Otp.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
            action: body.action,
        }, 'otp')
        if (!otp || otp["otp"] !== body.otp) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid verification code'
            })
        }
        let find = await User.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
        })
        if (!find) {
            return res.status(400).send({
                error: true,
                msg: 'Account not found'
            })
        }
        let token = jwt.sign({ _id: find?._id, action: body.action }, secret, { expiresIn: 600 })
        return res.status(200).send({
            error: false,
            msg: 'Successfully verified',
            data: {
                token: token,
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


export const updateUser = async (req, res) => {
    try {
        const { body, files } = req;
        const user = await User.findById(res.locals.user._id);
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found',
            });
        }

        const update = {};

        if (body.name) update["name"] = body.name;
        if (files?.image) {
            if (user.image) await s3DeleteFiles([user.image]);
            update["image"] = await s3UploadFile(files.image, `user/${user.uid}/profile`);
        }
        if (body.address) update["address"] = body.address;
        if (body.gender) update["gender"] = body.gender;
        if (body.phone) update["phone"] = body.phone;
        if (body.dob) update["dob"] = body.dob;
        if (body.about) update["about"] = body.about;
        if (body.occupation) update["occupation"] = body.occupation;
        if (body.facebook) update["facebook"] = body.facebook;
        if (body.twitter) update["twitter"] = body.twitter;
        if (body.linkedin) update["linkedin"] = body.linkedin;
        if (body.instagram) update["instagram"] = body.instagram;
        if (body.short_bio) update["short_bio"] = body.short_bio;

        if (body.experience) update["experience"] = body.experience;
        if (body.skills) {
            try {
                update["skills"] = typeof body.skills === "string" ? JSON.parse(body.skills) : body.skills;
            } catch (e) {
                return res.status(400).send({
                    error: true,
                    msg: 'Invalid format for skills',
                });
            }
        }
        await User.findByIdAndUpdate(user._id, update);
        return res.status(200).send({
            error: false,
            msg: 'Successfully updated profile',
        });
    } catch (e) {
        console.error("Error updating profile:", e);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error',
        });
    }
};


export const postPassword = async (req, res) => {
    try {
        const { body } = req
        if(body.new_password.length < 6) {
            return res.status(400).send({
                error: true,
                msg: 'Password must be at least 6 characters'
            })
        }
        let user = await User.findById(res.locals.user._id)
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }
        if (!bcrypt.compareSync(body.old_password, user.password)) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid old password'
            })
        }
        user.password = bcrypt.hashSync(body.new_password, 8)
        await user.save()
        return res.status(200).send({
            error: false,
            msg: 'Successfully updated password',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


export const getUserDetails = async (req, res) => {
    try {
        const { query } = req
        let data = await User.findOne({
            _id: query._id
        })
            // .populate('country', 'name code')
            .select('uid name role phone email image address country documents')
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'User details fetched successfully',
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


// add trainer
export const addTrainer = async (req, res) => {
    try {
        let body = req.body
        let find = await User.findOne({ email: body.email })
        if (!!find) {
            return res.status(400).send({
                error: true,
                msg: 'Trainer already exists with this email'
            })
        }

        let uid = await generateUid('T-', User)
        let user = await User.create({
            uid: uid,
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 8),
            role: 'trainer',
        })
        if(user){
            let findAdmin = await User.findOne({ role: 'admin' })
            if (findAdmin) {
                let message = await Message.create({
                    from: findAdmin._id,
                    to: user._id,
                    message: 'Welcome to our platform. You have been added as a trainer by admin. If you have any queries, please feel free to message. Thank you!',
                    type: 'trainer'
                })
            }
        }
        return res.status(200).send({
            error: false,
            msg: 'Trainer added successfully',
            data: user
        })
    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


// get all trainers
export const getAdminAllTrainers = async (req, res) => {
    try {
        const { query } = req;
        const filter = { role: 'trainer' };

        if (!!query.search) {
            filter['name'] = { $regex: query.search, $options: 'i' };
        }
        let data = await User.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v -password -about -address -facebook -instagram -twitter -linkedin',
        });
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Features',
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const getAllTrainers = async (req, res) => {
    try {
        let data = await User.paginate({ role: 'trainer', $and: [{ image: { $exists: true } }, { image: { $ne: null } }, { image: { $ne: '' } }] }, {
            page: req.query.page || 1,
            limit: req.query.limit || 3,
            sort: { createdAt: -1 },
            select: ('-__v -password -about -address -skills -short_bio -experience -gender -phone -createdAt -updatedAt'),

        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets trainer list',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const getTrainerDetails = async (req, res) => {
    try {
        const { query } = req
        let data1 = await User.findOne({
            _id: query._id
        })

        let data = await User.findOne({
            _id: query._id
        })
            // .populate('country', 'name code')
            .select('uid name role phone email image address country documents about occupation facebook twitter linkedin instagram skills experience short_bio')
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Trainer not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Trainer details fetched successfully',
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const addUser = async (req, res) => {
    try {
        let body = req.body
        let findByEmail = await User.findOne({ email: body.email })
        let findByPhone = await User.findOne({ phone: body.phone })
        if (!!findByEmail) {
            return res.status(400).send({
                error: true,
                msg: 'User with this email already exists'
            })
        }
        if (!!findByPhone) {
            return res.status(400).send({
                error: true,
                msg: 'User with this phone number already exists'
            })
        }

        let uid = await generateUid('U-', User)
        let user = await User.create({
            uid: uid,
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 8),
            role: 'user',
        })
        if(!!user){
            let findAdmin = await User.findOne({ role: 'admin' })
            if (findAdmin) {
                await Message.create({
                    from: findAdmin._id,
                    to: user._id,
                    message: 'You have been added as a Member by admin. If you have any queries, please feel free to message us.',
                    type: 'user'
                })
            }
        }
        return res.status(200).send({
            error: false,
            msg: 'User added successfully',
            data: user
        })
    }catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}
export const removeUser = async (req, res) => {
    try {
        let { query } = req;
        const user = await User.findByIdAndDelete(query._id, { role: 'user' });
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'user not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'User has been deleted successfully',
        })
    }catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
// delete user
export const deleteUser = async (req, res) => {
    try {
        let { query } = req;
        const user = await User.findByIdAndDelete(query._id, { role: 'trainer' });

        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'user not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'User has been deleted successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// get user list 
export const getUserList = async (req, res) => {
    try {
        const { query } = req;
        let filter = {};

        // Name search filter
        if (!!query.search) {
            filter['$or'] = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } }
            ];
        }
        

        // Role filter
        if (!!query.role) {
            filter['role'] = query.role;
        }

        // First get all users matching the basic filters
        let userData = await User.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: ('-__v -password -about -address -skills -short_bio -experience'),
        });

        const userIds = userData.docs.map(user => user._id);

        // Prepare subscription query
        let subscriptionQuery = {
            user: { $in: userIds },
        };

        // Add active status and end date check for valid subscriptions
        if (query.subscription === 'active') {
            subscriptionQuery['active'] = true;
            subscriptionQuery['end_date'] = { $gt: new Date() };
        }

        // Get subscriptions based on filter
        const subscriptions = await UserSubscription.find(subscriptionQuery).select('user');

        // Create Set of user IDs with matching subscriptions
        const subscriptionUserIds = new Set(
            subscriptions.map(sub => sub.user.toString())
        );

        // Filter users based on subscription status if needed
        let filteredDocs = userData.docs;
        if (query.subscription) {
            filteredDocs = userData.docs.filter(user => {
                const hasActiveSubscription = subscriptionUserIds.has(user._id.toString());
                return query.subscription === 'active' ? hasActiveSubscription : !hasActiveSubscription;
            });

            // Update total count for pagination
            userData.totalDocs = filteredDocs.length;
        }

        // Add subscription status to each remaining user
        const enhancedDocs = filteredDocs.map(user => {
            const userObject = user.toObject();
            userObject.hasSubscription = subscriptionUserIds.has(user._id.toString());
            return userObject;
        });

        // Update the docs with filtered and enhanced version
        userData.docs = enhancedDocs;

        return res.status(200).send({
            error: false,
            msg: 'Successfully gets user list',
            data: userData
        });

    } catch (e) {
        console.error('Error in getUserList:', e);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const employeeCreate = async (req, res) => {
    try {
        let body = req.body

        let query = {}
        if (!!body?.phone && !!body?.email) {
            query = {
                $or: [
                    { phone: body.phone },
                    { email: body.email }
                ]
            }
        } else {
            query = {
                [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
            }
        }
        let find = await User.findOne(query)
        if (!!find) {
            return res.status(400).send({
                error: true,
                msg: 'Employee already registered'
            })
        }
        let uid = await generateUid('U-', User)
        let user = await User.create({
            uid: uid,
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 8),
            role: "employee",
            permission: body.permission,
        })
        if(!!user){
            let findAdmin = await User.findOne({ role: 'admin' })
            if (findAdmin) {
                await Message.create({
                    from: findAdmin._id,
                    to: user._id,
                    message: 'You have been added as a Member by admin. If you have any queries, please feel free to message us.',
                    type: 'user'
                })
            }
        }
        return res.status(200).send({
            error: false,
            msg: 'Employee registered successfully',
            data: {
                uid: user.uid,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const employeeUpdate = async (req, res) => {
    try {
        let body = req.body
        let user = await User.findOne({ _id: body._id })
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'Employee not found'
            })
        }
        user.name = body.name
        user.phone = body.phone
        user.email = body.email
        user.permission = body.permission
        await user.save()
        return res.status(200).send({
            error: false,
            msg: 'Employee updated successfully'
        })
        
    }catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const employeeList = async (req, res) => {
    try {
        const { query } = req;
        let filter: any = {};
        if (!!query.search) {
            filter = {
                $or: [
                    { "name": { $regex: new RegExp(query.search.toLowerCase(), "i") } },
                    { "email": { $regex: new RegExp(query.search.toLowerCase(), "i") } },
                    { "phone": { $regex: new RegExp(query.search.toLowerCase(), "i") } },
                    { "uid": { $regex: new RegExp(query.search.toLowerCase(), "i") } },
                ]
            }
        }
        const employees = await User.aggregatePaginate([
            {
                $match: {
                    role: 'employee'
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'permission',
                    foreignField: '_id',
                    as: 'permission'
                }
            },
            { $unwind: { path: "$permission", preserveNullAndEmptyArrays: true } },
            { $match: filter },
            {
                $project: {
                    password: 0
                }
            }
        ]
            , {
                page: query.page || 1,
                limit: query.size || 10,
                sort: { createdAt: -1 },
            })

        return res.status(200).json({
            error: false,
            data: employees
        })

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            error: true,
            data: e.message
        })
    }
}

export const employeePasswordChange = async (req, res) => {
    try {
        let body = req.body
        let user = await User.findOne({ _id:body._id })
        if(body.new_password !== body.confirm_password){
            return res.status(400).send({
                error: true,
                msg: 'Password does not match'
            })
        }
        if(body.new_password.length < 6){
            return res.status(400).send({
                error: true,
                msg: 'Password must be at least 6 characters long'
            })
        }
        if(body.confirm_password.length < 6){
            return res.status(400).send({
                error: true,
                msg: 'Password must be at least 6 characters long'
            })
        }
        if (!!user) {
            user.password = bcrypt.hashSync(body.confirm_password, 8);
            await user.save()
            return res.status(200).send({
                error: false,
                msg: 'Password changed successfully'
            })
        } else {
            return res.status(400).send({
                error: true,
                msg: 'Invalid user'
            })
        }
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        let query = req.query
        if(!query._id){
            return res.status(400).send({
                error: true,
                msg: 'Employee not found or already deleted'
            })
        }
        let user = await User.findOne({ _id: query._id })
        if (!!user) {
            await User.deleteOne({ _id: query._id })
            return res.status(200).send({
                error: false,
                msg: 'Employee deleted successfully'
            })
        } else {
            return res.status(400).send({
                error: true,
                msg: 'Invalid user'
            })
        }
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}