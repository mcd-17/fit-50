import { model, Schema } from "mongoose";
import { paginate } from "../utils/mongoose";

let bmiSchema = new Schema({
    bmi: {
        type: Number,
        required: true
    },
    bmi_type: {
      type: String,
      required: true  
    },
    bmr: {
        type: Number,
        required: true
    },
    daily_calories: {
        type: Number,
        required: true
    },
    waterIntake: {
        type: Number,
        required: true
    },
    recommended_calories: {  
        protein: {
            type: Number,
            required: true
        },
        carbs: {
            type: Number,
            required: true
        },
        fats: {
            type: Number,
            required: true
        }
    },
}, { _id: false }); 

let schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    exercises: {  
        type: String,
        required: true
    },
    bmi: {
        type: bmiSchema,
        required: true
    },
}, { timestamps: true });

schema.plugin(paginate);

const BmiReport = model('bmi_report', schema);
export default BmiReport;
