import dotenv from 'dotenv';
import MailSettings from '../models/mailCredential.model';
const nodemailer = require("nodemailer");
dotenv.config();

export const sendUserEmailGeneral = async (data) => {
    const settings = await MailSettings.findOne({});
    let transporter, from_email;

    // @ts-ignore
    if (settings?.default === 'sendgrid') {
        transporter = nodemailer.createTransport({
            host: settings?.sendgrid?.host,
            port: settings?.sendgrid?.port,
            secure: false,
            auth: {
                user: settings?.sendgrid?.sender_email,
                pass: settings?.sendgrid?.password,
            },
        });

        // @ts-ignore
    } else if (settings?.default === 'gmail') {
        transporter = nodemailer.createTransport({
            secure: false,
            // @ts-ignore
            service: settings?.gmail?.service_provider,
            auth: {
                // @ts-ignore
                user: settings?.gmail?.auth_email,
                // @ts-ignore
                pass: settings?.gmail?.password,
            },
        });
        // @ts-ignore
        from_email = settings?.email?.gmail?.auth_email
    }

    // config for end user
    const info = await transporter.sendMail({
        from: from_email,                // sender address
        to: data.email,                             // list of receivers
        subject: data.subject,              // Subject line
        html: data.message,   // html body
    })

    return info;
};