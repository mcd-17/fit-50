import Newsletter from "../../models/newsletter";
import MarketingGroup from "../../models/marketing/marketing-group.model";
import MarketingMail from "../../models/marketing/marketing-mail.model";
import User from "../../models/user.model";
import { sendMarketingEmail } from "../../utils/deliverMail";
import { populate } from "dotenv";

export const postDeliveryEmail = async (req, res) => {

    let to = [];
    if (req.body.to) {
        const group = await MarketingGroup.findById(req.body.to).populate('groups', 'email');
        // @ts-ignore
        if( group && group.groups.length < 1) return res.status(400).send({error: true, msg: "No Members in this group"})
        to = group.groups.map(x => x.email);
    }

    if (req.body.trainer) {
        const trainers = await User.find({role: 'trainer'}).select('email')
        if(trainers.length >0 ) trainers.forEach((trainer) => to.push(trainer.email));
    }
    if (req.body.subscriber) {
        const subscribers = await Newsletter.find()
        if(subscribers.length >0 ) subscribers.forEach((subscriber) => to.push(subscriber?.email));
    }
    if (req.body.user) {
        const users = await User.find({role: 'user'}).select('email')
        if(users.length>0 ) users.forEach((user) => to.push(user.email));
    }
    if (req.body.employee) {
        const employees = await User.find({role: 'employee'}).select('email')
        if(employees.length>0 ) employees.forEach((employee) => to.push(employee.email));
    }
    if (req.body.individual_mail)
        to.push(req.body.individual_mail);

    //if scheduled date is set
    if (req.body.scheduled_date) {
        await MarketingMail.create(
            {
                individual_mail: req.body.individual_mail,
                group: req.body.to,
                subscriber: req.body.subscriber,
                driver: req.body.driver,
                user: req.body.user,
                employee: req.body.employee,
                subject: req.body.subject,
                content: req.body.content,
                status: 'scheduled',
                scheduled_date: req.body.scheduled_date,
                to: to
            })
        return res.status(200).send({
            error: false,
            msg: "Email is scheduled",
        })
    } else {
        console.log(req.body)
        console.log(to)
        let mail = await MarketingMail.create(
            {
                individual_mail: req.body.individual_mail,
                group: req.body.to,
                subject: req.body.subject,
                content: req.body.content,
                subscriber: req.body.subscriber,
                trainer: req.body.trainer,
                user: req.body.user,
                employee: req.body.employee,
                status: 'pending',
                to: to
            })
        //send mail
        sendMarketingEmail({
            to: to, // Change to your recipient
            subject: req.body.subject,
            content: req.body.content,
        }).then((data) => {
            if (!!data) {
                mail.status = 'success'
                mail.from = data.from;
                mail.save()
            } else {
                mail.status = 'failed'
                mail.save()
            }
        })
        return res.status(200).send({
            error: false,
            msg: "Email Sent",
        })
    }

}

export const getAllMail = async (req, res) => {
    const query = req.query;
    let filter: any = {};
    try {
        if (query.search) {
            filter = {
                $or: [
                    {"content": {$regex: new RegExp(query.search.toLowerCase(), "i")}},
                    {"subject": {$regex: new RegExp(query.search.toLowerCase(), "i")}},
                ]
            }
        }
        if(query.status){
            filter.status = query.status
        }
        // @ts-ignore
        let allEmails = await MarketingMail.paginate(filter, 
            { 
                page: query.page || 1,
                limit: query.limit || 10, 
                sort: { createdAt: -1 },
                populate:{
                    path: 'group',
                }
            })

        return res.status(200).send({
            error: false,
            msg: "Email Sent",
            data: allEmails
        })
    } catch (e) {
        console.log(e)
    }
}

export const deleteEmail = async (req, res) => {
    try {
        await MarketingMail.findByIdAndDelete(req.query._id);
        return res.status(200).send({
            error: false,
            msg: "Delete Successful",
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            error: true,
            msg: "Server failed"
        })
    }
}