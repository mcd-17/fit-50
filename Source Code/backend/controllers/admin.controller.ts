import bcrypt from 'bcryptjs'
import crypto from "crypto";
import User from '../models/user.model';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Settings from '../models/settings.model';
import Language from '../models/language.model';
import Currency from '../models/currency.model';
import { Theme } from '../models/theme.model';


// create admin/super-admin
export const createAdminAndEnv = async (req, res, next) => {
    try {
        const { adminInfo, valueString, DATABASE_URL } = req.body;
        const { name, email, phone, password, confirmPassword } = adminInfo;


        const envValues = valueString + "\n" + `SECRET=${crypto.randomBytes(12).toString('hex') + Date.now()}` + "\n" + `JWT_EXPIRE_IN="24h"` + "\n" + `JWT_EXPIRE_IN_REMEMBER_ME="168h"`

        if (adminInfo?.password !== adminInfo?.confirmPassword) {
            return res.status(400).json({
                message: "Password invalid",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const ID = crypto.randomBytes(4).toString('hex')

        const u = `${DATABASE_URL.split('=')[0]}`
        const r = `${DATABASE_URL.split(`${u}=`)[1]}`

        // Database connection
        const db = `${r}`;
        // await mongoose.connect(db);
        await mongoose.connect(db).then(() => {
            console.log('MongoDB Connected Successfully.')
        }).catch((err) => {
            console.log('Database connection failed.', err)
        })

        const newUser = await User.create({
            name,
            email,
            phone,
            role: 'admin',
            password: hashedPassword,
            uid: ID,
        });

        const setting = await Settings.create({
            title: "My Site",
        })

        const language = await Language.create({
            name: "English",
            code: "en",
            active: true,
            flag: "us",
            default: true
        })

        const currency = await Currency.create({
            name: "US Dollar",
            code: "USD",
            symbol: "$",
            rate: 1,
            default: true,
            placement: "before"
        })
        const theme = await Theme.create({
            name: "home1",
            isDefault: true
        })
        const theme2 = await Theme.create({
            name: "home2",
            isDefault: false
        })
        const theme3 = await Theme.create({
            name: "home3",
            isDefault: false
        })
        const theme4 = await Theme.create({
            name: "home4",
            isDefault: false
        })
        await fs.writeFile(path.join(__dirname, '../.env'), envValues, { flag: "wx" });
        return res.status(200).json({
            status: true,
            env: true
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })

    }
}