import mongoose from "mongoose";

const skiilSchema = mongoose.Schema({
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
    
},{timestamps:true})

export const Skill = mongoose.Model("Skill", skiilSchema);