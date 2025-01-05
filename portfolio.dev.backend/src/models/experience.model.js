import mongoose, { mongo } from "mongoose";

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

},{timestamps:true})

export const Experience = mongoose.Model("Experience", experienceSchema);