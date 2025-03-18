import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import mongoose from 'mongoose'
const secret = process.env.SECRET

export const decodeToken = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1]
        res.locals.user = jwt.verify(token, secret)
        next()
        return
    } catch (err) {
        next()
    }
}


export const isUser = (req, res, next) => {
    let { user } = res.locals
    if (!!user && !!user?.uid && user.role === 'user') {
        next()
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}


export const isAnyUser = (req, res, next) => {
    let { user } = res.locals
    if (!!user && !!user?.uid && (user.role === 'user' || user.role === 'admin' || user.role === 'trainer' || user.role === 'employee')) {
        next()
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}


export const isAdmin = (req, res, next) => {
    let { user } = res.locals
    if (!!user && !!user?.uid && user.role === 'admin') {
        next()
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}

export const isTrainer = (req, res, next) => {
    let { user } = res.locals
    if (!!user && !!user?.uid && user.role === 'trainer') {
        next()
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}

export const isAdminOrEmployee = (req, res, next) => {
    const user = res.locals.user;
    
    if (user && user.role && (user.role === 'admin' || user.role === 'employee')) {
        next();
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized',
        });
    }
};


export const isAdminOrTrainerOrEmployee = (req, res, next) => {
    let { user } = res.locals
    if (!!user && !!user?.uid && (user.role === 'admin' || user.role === 'trainer' || user.role === 'employee')) {
        next()
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}

export const employeePermission = (permission: String) => async (req, res, next) => {
    try {
        if (res.locals.user.role === 'admin') {
            return next()
        }
        let { user } = res.locals
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
                    roles: "$roles",
                }
            }
        ])
        const userPermission = data[0]?.roles[0]

        if (userPermission?.permissions.includes(permission)) {
            return next()
        }
        return res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    } catch (err) {
        return res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}


export const havePermission = (permission, roles) => {
    for (let role of roles || []) {
        if (role.permissions.includes(permission)) {
            return true
        }
    }
    return false
}


