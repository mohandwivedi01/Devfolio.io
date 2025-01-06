import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema({
    email: {
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

export const Contact = mongoose.model("Contact", contactSchema);