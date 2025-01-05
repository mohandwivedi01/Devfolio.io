import mongoose, { mongo, Schema } from "mongoose";

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    started: {
        type: String
    },
    end: {
        type: String
    },
    description: {
        type: String,
        
    },
    companyLogo: {
        type: String
    },
    companyLink: {
        type: String,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps:true})

export const Experience = mongoose.Model("Experience", experienceSchema);