import Notification from "../models/notification.model"

export const getAllNotifications = async (req, res, next) => {
    try {
        const filter = {}
        const notifications = await Notification.paginate(filter, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
        });
        return res.status(200).json({
            error: false,
            data: notifications
        })
    } catch (e) {
        return res.status(500).json({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const markNotificationAsRead = async (req, res, next) => {
    try {
        const { _id } = req.body
        let notification = await Notification.findOne({ _id: _id })
        if(notification.isRead){
            return res.status(400).json({
                error: true,
                msg: 'Notification already marked as read'
            })
        }
        await Notification.updateOne({ _id: _id }, { isRead: true })
        return res.status(200).json({
            error: false,
            msg: 'Notification marked as read successfully'
        })
    } catch (e) {
        return res.status(500).json({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const markAllNotificationAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({}, { isRead: true })
        return res.status(200).json({
            error: false,
            msg: 'All notifications marked as read successfully'
        })
    } catch (e) {
        return res.status(500).json({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const deleteNotification = async (req, res, next) => {
    try {
        const { _id } = req.query
        await Notification.deleteOne({ _id: _id })
        return res.status(200).json({
            error: false,
            msg: 'Notification deleted successfully'
        })
    } catch (e) {
        return res.status(500).json({
            error: true,
            msg: 'Server failed'
        })
    }
}