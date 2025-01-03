import {mongoose, Schema} from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    profilePic: {
        type: String
    },
    resume: {
        type: String
    },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String },
        other: { type: String }, // Additional links
  },
}, {timestamps: true})


export const User = mongoose.model('User', userSchema);