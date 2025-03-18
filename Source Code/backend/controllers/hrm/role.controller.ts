import permissions from "../../utils/permission";
import { havePermission } from "../../middlewares/auth.middleware";
import Role from "../../models/hrm/role.model";
import User from "../../models/user.model";

export const getPermissions = async (req, res) => {
    res.status(200).send({
        error: false,
        msg: 'Successfully gets permissions',
        data: permissions
    })
}
export const getRoles = async (req, res) => {
    try {
        const { query } = req
        let filter = {}

        if (!!query.search) {
            filter['name'] = { $regex: query.search, $options: 'i' };
        }
        let getRoles = await Role.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        })

        return res.status(200).send({
            error: false,
            data: getRoles
        })

    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}
export const getRole = async (req, res) => {
    try {
        let { query } = req
        let find = await Role.findOne({ _id: query._id });
        if (!find) {
            return res.status(400).send({
                error: true,
                msg: 'Role not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets role',
            data: find
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const postRole = async (req, res, next) => {
    try {
        const { body } = req;
        if (body?._id) {
            await Role.updateOne({ _id: body?._id }, { $set: body });
            return res.status(200).send({
                error: false,
                msg: 'Updated successful',
            })
        }

        delete body._id
        const roleCreate = await Role.create({ ...body })
        return res.status(200).send({
            error: false,
            msg: 'New role added successfully',
            data: roleCreate
        })

    } catch (e) {
        if (e?.code === 11000) {
            return res.status(406).send({
                error: true,
                msg: 'Role already exists',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const { _id } = req.query
        await Role.deleteOne({ _id: _id })
        return res.status(200).json({
            error: false,
            msg: 'Role deleted successfully'
        })
    } catch (e) {
        return res.status(500).json({
            error: true,
            msg: 'Server failed'
        })
    }
}
export const postPermissions = async (req, res) => {
    try {
        const { body } = req
        const { user } = res.locals
        let userCheck = await User.findById(user._id, 'permission role').populate('permission', ['permissions']);
        let admin = userCheck?.role === 'admin';
        if (!admin) {
            for (let p of body.permissions) {
                if (!havePermission(p, user?.permission)) {
                    return res.status(401).send({
                        error: true,
                        msg: 'Unauthorized permissions found'
                    })
                }
            }
        }
        await Role.findByIdAndUpdate(body.role, { permissions: body.permissions })
        res.status(200).send({
            error: false,
            msg: 'Successfully updated permissions',
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

