import { User } from "../models/user.model.js";
import {Experience} from "../models/experience.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError } from "../utils/ApiError.js"
import {ApiResponse } from "../utils/ApiResponse.js"


const addExperienceDetails = asyncHandler(async(req, res) => {
    const {company, position, started, end, description, companyLogo, companyLink} = req.body;
    
    if(!company || !position) {
        throw new ApiError(400, "company name and position is missing.");
    }


    const experienceDetails = await Experience.create({
        company,
        position,
        started,
        end,
        description,
        companyLogo,
        companyLink: companyLink.trim(),
        user: req.user?.id
    })

    if (!experienceDetails) {
        throw new ApiError(500, "something went wrong while adding experience details.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, experienceDetails,"experienceDetails added successfully.")
    );

})

const getExperienceDetails = asyncHandler(async(req, res) => {
    const {userId} = req.params;

    if (!userId) {
        throw new ApiError(400, "userId is missing.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "user not found.");
    }

    const userExperienceDetils = await Experience.find({user: userId})

    if (!userExperienceDetils) {
        throw new ApiError(500, "something went wrong while fetching user.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, userExperienceDetils, "user experienceDetils fetched successfully.")
    )
})

const getExperienceDetailsById = asyncHandler(async(req, res) => {
    const {experienceId} = req.params;

    if (!experienceId) {
        throw new ApiError(400, "experienceId is missing.");
    }

    const experience = await Experience.findById(experienceId);

    if (!experience) {
        throw new ApiError(404, "experience details not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, experience, "user experience Detils fetched successfully.")
    )
})

const updateExperienceDetails = asyncHandler(async(req, res) => {
    const {company, position, started, end, description, companyLogo, companyLink} = req.body;
    const {experienceDetailsId} = req.params;

    if(!experienceDetailsId){
        throw new ApiError(400, "experienceDetailsId is missing.");
    }
    
    if(!company || !position) {
        throw new ApiError(400, "company name and position is missing.");
    }

    // if(!Number.isInteger(duration)){
    //     throw new ApiError(400, "duration must be a number.");
    // }

    const experienceDetails = await Experience.findById(experienceDetailsId);

    if (!experienceDetails) {
        throw new ApiError(404, "experienceDetails not found.");
    }

    if (req.user?._id.toString() !== experienceDetails.user.toString()) {
        throw new ApiError(401, "you are not authorized to updated details.");
    }

    const updatedExperienceDetails = await Experience.findByIdAndUpdate(
        experienceDetailsId,
        {
            $set: {
                company,
                position,
                started,
                end,
                description,
                companyLogo,
                companyLink: companyLink?.trim(),
            }
        },
        {new:true}
    )

    if (!updatedExperienceDetails) {
        throw new ApiError(500, "something went wrong while updating experience details.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedExperienceDetails, "user experience details updated successfully.")
    )
})

const deleteExperienceDetails = asyncHandler(async(req, res) => {
    const {experienceDetailsId} = req.params;
    
    if (!experienceDetailsId) {
        throw new ApiError(400, "experienceDetaid id is missing.");
    }

    const userExperienceDetails = await Experience.findById(experienceDetailsId);

    if (!userExperienceDetails) {
        throw new ApiError(404, "experience details not found.");
    }

    if (req.user?._id.toString() !== userExperienceDetails.user.toString()) {
        throw new ApiError(401, "you are not authorized to delete this.");
    }

    const response = await Experience.findByIdAndDelete(experienceDetailsId);

    if(!response){
        throw new ApiError(500, "something went wrong while delete experience details");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "experience details deleted successfully.")
    );
})

export {
    addExperienceDetails,
    getExperienceDetails,
    getExperienceDetailsById,
    updateExperienceDetails,
    deleteExperienceDetails
}