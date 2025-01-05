import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema({
    emial: {
        type: String,
        trim: true,
        lowercase: true
    },
    message: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
},{timestamps:true})

export const Contact = mongoose.Model("Contact", contactSchema);