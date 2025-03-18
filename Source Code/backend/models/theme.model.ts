import { Schema,model } from "mongoose";

const themeSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ['home1', 'home2','home3','home4'],
    },
    isDefault: {
        type: Boolean,
        required: false,
    },
}, { timestamps: true });

export const Theme = model('theme', themeSchema);