import mongoose from "mongoose";

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

},{timestamp:true})

export const Blog = mongoose.Model("Blog", blogSchema);