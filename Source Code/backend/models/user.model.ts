import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";

const schema = new Schema({
    uid: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        index: true,
        lowercase: true,
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'trainer', 'admin', 'employee'],
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'department',
    },
    permission: {
        type: Schema.Types.ObjectId,
        ref: 'role'
    },
    image: String,
    address: String,
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    dob: Date,
    about: String,
    short_bio: String,
    occupation: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    experience: String,
    skills: [{
        name: {
            type: String,
        },
        level: {
            type:Number
        }
    }]
}, { timestamps: true })    

schema.plugin(paginate)
schema.plugin(aggregatePaginate)

const User = model('user', schema);
export default User;