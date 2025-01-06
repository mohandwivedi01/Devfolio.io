import mongoose, { Schema }  from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    technologiesUsed: [
        String
    ],
    projectLink: {
        type: String
    },
    repoLink: {
        type: String
    },
    images: [ ],
    role: {
        type: String
    },
    likes: {
        type: Number,
        default:0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const Project = mongoose.model("Project", projectSchema);