import mongoose, { mongo, Schema } from "mongoose";

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
    },
    position: {
        type: String
    },
    started: {
        type: String
    },
    end: {
        type: String
    },
    description: {
        type: String
    },
    companyLogo: {
        type: String
    },
    companyLink: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps:true})

export const Experience = mongoose.Model("Experience", experienceSchema);