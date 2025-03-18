import BmiReport from "../models/bmi-report.model";

export const getBMIReport = async (req: any, res: any) => {
    try {
        let user_idFromQuery = req.query._id;
        if(user_idFromQuery){
            const report = await BmiReport.paginate({ user: user_idFromQuery }, { page: req.query.page || 1, limit: req.query.limit || 10, sort: { createdAt: -1 } });
            return res.status(200).send({
                error: false,
                msg: "Successfully gets Fitness Report",
                data: report
            })
        }
        const user = res.locals.user._id;
        const report = await BmiReport.paginate({ user: user }, { page: req.query.page || 1, limit: req.query.limit || 10, sort: { createdAt: -1 } });
        return res.status(200).send({
            error: false,
            msg: "Successfully gets Fitness Report",
            data: report
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
export const getAdminBMIReport = async (req: any, res: any) => {
    try {
        const report = await BmiReport.findOne({ _id: req.params._id });
        return res.status(200).send({
            error: false,
            msg: "Successfully gets Fitness Report",
            data: report
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const saveBMIReport = async (req: any, res: any) => {
    try {
        const _id = req.query._id;
        if(_id){
            const findReport = await BmiReport.findOne({ _id: _id });
            if(!findReport){
                return res.status(400).send({
                    error: true,
                    msg: "Report not found"
                })
            }
            const report = await BmiReport.findOneAndUpdate({ _id: _id }, req.body, { new: true });
            return res.status(200).send({
                error: false,
                msg: "Successfully updated Fitness Report",
                data: report
            })
        }else{
            const report = new BmiReport({user: res.locals.user._id, ...req.body});
            await report.save();
            return res.status(200).send({
                error: false,
                msg: "Successfully saved Fitness Report",
                data: report
            })
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const deleteBMIReport = async (req: any, res: any) => {
    try {
        const user = res.locals.user._id;
        let _id = req.query._id;
        if(!_id){
            return res.status(400).send({
                error: true,
                msg: "Report id is required"
            })
        }
        const report = await BmiReport.findOne({ _id: _id });
        if(!report){
            return res.status(400).send({
                error: true,
                msg: "Report not found"
            })
        }
        if(report.user.toString() !== user){
            return res.status(400).send({
                error: true,
                msg: "You are not authorized to delete this report"
            })
        }
        await BmiReport.deleteOne({ _id: _id });
        return res.status(200).send({
            error: false,
            msg: "Successfully deleted Fitness Report"
        })
        
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}