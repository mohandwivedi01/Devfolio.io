import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    blogLink: {
        type: String
    },
    platform: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamp:true})

export const Blog = mongoose.Model("Blog", blogSchema);