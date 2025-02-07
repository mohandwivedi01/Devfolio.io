import mongoose, { Schema } from "mongoose";

const skiilSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    level: {
        type: Number,
        min: [1, 'Level must be at least 1'],
        max: [5, 'Level cannot exceed 5'],
        default: 1
    },
    icon: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
},{timestamps:true})

export const Skill = mongoose.model("Skill", skiilSchema);