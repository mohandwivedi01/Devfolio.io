import { Skill } from "../models/skills.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const addSkills = asyncHandler(async(req, res) => {
    const {skillName, level, iconLink} = req.body;
    const {userId} = req.params;

    if(!skillName){
        throw new ApiError(400, "skill name is missing.");
    }

    if (!Number.isInteger(level) || level <= 1 || level >= 5) {
        throw new ApiError(401, "level is must be a number between 1 to 5.")
    }

    const user = await User.findByid({userId})

    if (!user) {
        throw new ApiError(404, "user is not found.");
    }

    const skill = await Skill.create({
        name: skillName,
        level,
        iconLink: iconLink.trim()
    });

    if (!skill) {
        throw new ApiError(500, "something went wrong while saving skills into db.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skill, "skill saved successfully.")
    );

})

const getSkills = asyncHandler(async(req, res) => {
    const {userId} = req.params;

    if (userId) {
        throw new ApiError(400, "userId is missing.");
    }

    const user = await User.findByid({userId});

    if(!user){
        throw new ApiError(404, "user is not found.");
    }

    const skills = await skill.find({user: userId})

    if (!skills) {
        throw new ApiError(500, "something went wrong while fetching skills.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skills, "skills fetched successfully.")
    )
});

const updateSkills = asyncHandler(async(req, res) => {
    const {skillId} = req.params;
    const {skillName, level, iconLink} = req.body

    const skill = await Skill.findByid({skillId});
    if (!skill) {
        throw new ApiError(404, "skill not found");
    }

    if (skill.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "you are not authorized to update the skill.");
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        {
            $set: {
                name: skillName,
                level,
                iconLink
            }
        },
        {new:true}
    )

    if (!updatedSkill) {
        throw new ApiError(500, "something went wrong while updating skills");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedSkill, "skills updated successfully.")
    );
    
})

const deleteSkills = asyncHandler(async(req, res) => {
    const {skillId} = req.params;

    if (!skillId) {
        throw new ApiError(400, "skill is missing.");
    }

    const skill = await Skill.findByid({skillId});

    if (!skill) {
        throw new ApiError(404, "skill is not found.");
    }

    if (skill.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "you are not authorized to delete this skill");
    }

    const response = await Skill.findByIdAndDelete({skillId});

    if (!response) {
        throw new ApiError(500, "something went wrong while deleting the skill.");
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, "skill deleted successfully")
    );
})

export {
    addSkills,
    getSkills,
    updateSkills,
    deleteSkills
}