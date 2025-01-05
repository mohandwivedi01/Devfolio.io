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
    technologyUsed: [
        String
    ],
    projectActiveLink: {
        type: String
    },
    repoLink: {
        type: String
    },
    image: {
        type: String
    },
    role: {
        type: String
    },
    like: {
        type: Number,
        default:0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const Project = mongoose.Model("Project", projectSchema);