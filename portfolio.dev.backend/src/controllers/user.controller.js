import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse}  from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const healthCheck = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "app is running...")
    )
})

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforSave: false})

        return{
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500, `somthing went wrong while generating access and refresh token: ${error}`)
    }
}

const createUser = asyncHandler(async (req, res) => {
    /**
     * get user details from client
     * validate the user details(not empty)
     *  
     */
    const {name, email, password, phone, title, bio, socialLinks} = req.body;
    if(!name || !title || !phone || !email || !password){
        throw new ApiError(400, "name emial, password, phone, title can not be empty");
    }

    const existedUser = await User.findOne({email});

    if(existedUser){
        throw new ApiError(400, "user already exists: ");
    }

    let profilePic = "";
    let resume = ""

    if(req.files && req.files.profilePic && req.files.resume && req.files?.profilePic?.length > 0){
        // console.log("req.files.profilePic.path: ",req.files.profilePic[0].path);

        const imageLocalPath = req.files?.profilePic[0]?.path;
        const resumeLocalPath = req.files?.resume[0]?.path;

        if(!imageLocalPath){
            throw new ApiError(400, "profile pic is not available");
        }

        //upload the image to cloudinary
        profilePic = await uploadOnCloudinary(imageLocalPath);

        resume = await uploadOnCloudinary(resumeLocalPath);

        if(!profilePic){
            console.error("Cloudinary upload failed.");
            throw new ApiError(500, "Something went wrong while uploading profile picture..");
        }
    }

    const socialLink = await typeof(socialLinks) === "string" ? JSON.parse(socialLinks) : socialLinks;
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
        password,
        phone,
        title,
        bio,
        profilePic: profilePic?.url || "",
        socialLinks: socialLinksData,
        resume: resume?.url || "",
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    console.log("created user: ", createUser)
    if(!createdUser) {
        throw new ApiError("somthing went wrong while creating user", 500)
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, user, "user created successfully."
            )
        )
    
});

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password){
        throw new ApiError(404, "email or password can not be null");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, `user with email: ${email} is not found`);
    }

    const isPasswordValid =  await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404, "password is not valid.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refershToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            },
        "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 //this will remove the field from the document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure : true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "user logged out successfully")
        )
        
})

const refreshAccessToken = asyncHandler(async(req, res) => {

    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log("incommingRefreshToken: ", incommingRefreshToken);
    
    if(!incommingRefreshToken){
        throw new ApiError(401, "unauthorized request");
    }
    
    try {
        console.log("inside try block ");
        
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        console.log("decoded token: ", decodedToken)
        
        const user = await User.findByIdAndUpdate(decodedToken?._id)

        if(!user){
            throw new ApiError(404, "User not found")
        }

        if(incommingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken || "",
                    },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getUserDetails = asyncHandler(async(req, res) => {
    const {username} = req.params;

})

const updateDetails = asyncHandler(async(req, res) => {

})

export {
    createUser, 
    healthCheck,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserDetails,
    updateDetails
}