import mongoose, { Schema } from "mongoose";
 
const socialLinksSchema = new mongoose.Schema({
    socialPlatformName: {
        type: String,
        required: true,
        trim: true
    },
    socialPlatformLink: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

export const SocialLinks = mongoose.Model("SocialLinks", socialLinksSchema);