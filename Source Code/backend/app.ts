import dotenv from 'dotenv'
dotenv.config({ path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env' })

import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { Server } from "http";

import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api'
import { decodeToken } from "./middlewares/auth.middleware";
import fs from 'fs';
import morgan from 'morgan'
import logger from './utils/logger'
import { socket } from './utils/socket'


mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('MongoDB Connected Successfully.')
}).catch((err) => {
    console.log('Database connection failed.')
})


const PORT = process.env.PORT || 3999;
const app = express();

const server = new Server(app);


app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors())


const isEnvExist = fs.existsSync('./.env');

if (isEnvExist === false) {
    const { createAdminAndEnv } = require("./controllers/admin.controller");

    app.get('/', (req, res, next) => {
        return res.status(200).json({
            status: true,
            env: false
        })
    })

    app.post('/setting', createAdminAndEnv)

    // server listening
    app.listen(PORT, () => console.log(`Server is listening on port : ${PORT}`))

} else {
    mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log('MongoDB Connected Successfully.')
    }).catch((err) => {
        console.log('Database connection failed.')
    })

    const server = new Server(app);

    const { notify, io } = socket(server)

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
    }));

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); //* will allow from all cross domain
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        )
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.locals.notify = notify
        res.locals.io = io
        next()
    });

    const morganFormat = ":method :url :status :response-time ms";

    // morgan routes view
    if (process.env.NODE_ENV === "development") {
        app.use(
            morgan(morganFormat, {
                stream: {
                    write: (message) => {
                        const logObject = {
                            method: message.split(" ")[0],
                            url: message.split(" ")[1],
                            status: message.split(" ")[2],
                            responseTime: message.split(" ")[3],
                        };
                        logger.info(JSON.stringify(logObject));
                    },
                },
            })
        );
        console.log("Morgan connected..");
    }
    app.use(decodeToken)
    app.use('/api', apiRoutes)
    app.get('*', (req, res) => {
        res.send('Welcome to Gymstick!');
    })
    const cron = require('node-cron');
    const {cornEmail} = require("./utils/marketing/emailCron");

    //run every 5 minutes
    cron.schedule('*/5 * * * *', () => {
        cornEmail();
    });

    server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    })
}