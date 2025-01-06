import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    blogLink: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamp:true})

export const Blog = mongoose.model("Blog", blogSchema);