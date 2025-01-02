import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    title: {
        type: String
    },
    bio: {
        type: String,
    },
    profilePic: {
        type: String
    },
    socialLinks: {
        typeof: Schema.Types.ObjectId,
        ref: "SocialLink"
    }
}, {timestamps: true})


export const User = mongoose.model('User', userSchema);