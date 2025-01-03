import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse}  from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const healthCheck = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "app is running...")
    )
})

const createUser = asyncHandler(async (req, res) => {
    /**
     * get user details from client
     * validate the user details(not empty)
     *  
     */

    console.log("chal rha h");
    
    const {name, email, phone, title, bio, socialLinks} = req.body;
    if(!name || !title || !phone || !email){
        throw new ApiError(400, "name emial, phone, title can not be empty");
    }

    let profilePic = "";

    if(req.files?.profilePic?.length > 0){
        console.log("req.files.profilePic.path: ",req.files.profilePic[0].path);
        const imageLocalPath = req.files?.profilePic[0]?.path;

        if(!imageLocalPath){
            throw new ApiError(400, "profile pic is not available");
        }

        //upload the image to cloudinary
        profilePic = await uploadOnCloudinary(imageLocalPath);
        if(!profilePic){
            console.error("Cloudinary upload failed.");
            throw new ApiError(500, "Something went wrong while uploading profile picture..");
        }
    }

    const socialLink = await JSON.parse(socialLinks);
    // Prepare social links
    const socialLinksData = {
        github: socialLink?.github || "",
        linkedin: socialLink?.linkedin || "",
        twitter: socialLink?.twitter || "",
        other: socialLink?.other || "",
    };
    // Create the user in the database
    const user = await User.create({
        name,
        email,
        phone,
        title,
        bio,
        profilePic: profilePic?.url || "",
        socialLinks: socialLinksData
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, user, "user created successfully."
            )
        )
    
});

const getUserDetails = asyncHandler(async(req, res) => {
    const {username} = req.params;
})

export {
    createUser, healthCheck
}