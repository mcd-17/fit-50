import {model, Schema} from "mongoose";

const schema = new Schema({
    title: String,
    description: String,
    logo: String,
    email: String,
    phone: String,
    address: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    ai_key: String,
    footer_text: String,
})

const Settings = model('settings', schema);
export default Settings;