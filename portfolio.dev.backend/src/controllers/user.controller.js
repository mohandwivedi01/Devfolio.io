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
            throw new ApiError(502, "Something went wrong while uploading profile picture..");
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
        .status(200)
        .json(
            new ApiResponse(
                200, user, "user created successfully."
            )
        )
    
});

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password){
        throw new ApiError(400, "email or password can not be null");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, `user with email: ${email} is not found`);
    }

    const isPasswordValid =  await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "password is not valid.")
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
        // console.log("decoded token: ", decodedToken)
        
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
    const {email} = req.params;
    console.log("email: ",email);
    if (!email?.trim()) {
        throw new ApiError(400, "email is missing..");
    }
    
    const user = await User.findOne({email: email}).select("-password -refreshToken -createdAt -updatedAt");
    
    console.log("user: ",user);

    if (!user) {
        throw new ApiError(404, `user with ${email} email is not found`);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "user fetched successfully.")
    );
})

const updateDetails = asyncHandler(async(req, res) => {
    const {name, email, phone, title, bio} = req.body;
    if(!name || !title || !phone || !email || !password){
        throw new ApiError(400, "name emial, password, phone, title can not be empty");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                email,
                phone,
                title,
                bio
            }
        },
        {next:true} 
   ).select("-password")

   return res
   .status(200)
   .json(
    new ApiResponse(200, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        title: user.title,
        bio: user.bio
    }, "details updated successfully")
   )
})

const updateSocialLinks = asyncHandler(async(req, res) => {
    const {socialLinks} = req.body;
    const {userId} = req.params;
    if (socialLinks) {
        throw new ApiError(400, "links are missing..");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                socialLinks
            }
        },
        {next: true}
    ).select("-password")

    if(!user){
        throw new ApiError(500, "something went wrong while updating user.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            socialLinks: user.socialLinks
        }),
        "Social links updated successfully."
    );
})

const changePassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id)

    if (!newPassword || !oldPassword) {
        throw new ApiError(400, "password is missing.");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401, "invalid password.");
    }
    
    if (newPassword === oldPassword) {
        throw new ApiError(401, "new password can't same as old password.");
    }

    user.password = newPassword;
    user.save({validateBeforSave:false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, "password changed successfully.")
    );
     
    
})

const updateResume = asyncHandler(async(req, res) => {
    let resume = "";

    if(req.files && req.files.resume){
        const resumeLocalPath = req.files?.resume[0]?.path;

        if (!resumeLocalPath) {
            throw new ApiError(400, "resume file is not available.");
        }

        resume = await uploadOnCloudinary(resumeLocalPath);

        if (!resume.url) {
            throw new ApiError(500, "something went wrong while uploding resume on cloudinary.")
        }
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                resume: resume.url
            }
        },
        {next:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "resume updated successfully."))
})

//add logic to delete previous pic from cloudinary
const updateProfilePic = asyncHandler(async(req, res) => {
    let profilePic = "";

    if(req.files && req.files.profilePic){
        const profilePicLocalPath = req.files?.profilePic[0]?.path;

        if (!profilePicLocalPath) {
            throw new ApiError(400, "resume file is not available.");
        }

        profilePic = await uploadOnCloudinary(profilePicLocalPath);

        if (!profilePic.url) {
            throw new ApiError(500, "something went wrong while uploding profilePic on cloudinary.")
        }
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profilePic: profilePic.url
            }
        },
        {next:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "profilePic updated successfully."))
})

export {
    createUser, 
    healthCheck,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserDetails,
    changePassword,
    updateDetails,
    updateSocialLinks,
    updateResume,
    updateProfilePic,
}