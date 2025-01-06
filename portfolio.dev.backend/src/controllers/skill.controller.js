import { Skill } from "../models/skills.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const addSkills = asyncHandler(async(req, res) => {
    const {skillName, level, iconLink} = req.body;

    if(!skillName){
        throw new ApiError(400, "skill name is missing.");
    }
    console.log("level: ", level)
    if (!Number.isInteger(level) || level < 1 || level > 5) {
        console.log("level: ", level)
        throw new ApiError(400, "level is must be a number between 1 to 5.")
    }

    const skill = await Skill.create({
        name: skillName,
        level,
        iconLink: iconLink.trim(),
        user: req.user?._id
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

const getAllSkills = asyncHandler(async(req, res) => {
    const {userId} = req.params;

    if (!userId) {
        throw new ApiError(400, "userId is missing.");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "user is not found.");
    }

    const skills = await Skill.find({user: userId})

    if (!skills) {
        throw new ApiError(500, "something went wrong while fetching skills.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skills, "skills fetched successfully.")
    )
});

const getSkillById = asyncHandler(async(req, res)=>{
    const {skillId} = req.params;

    if (!skillId) {
        throw new ApiError(400, "skill id is missing.");
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
        throw new ApiError(404, "skill is not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skill, "skill fetched successfully.")
    )
});

const updateSkills = asyncHandler(async(req, res) => {
    const {skillId} = req.params;
    const {skillName, level, iconLink} = req.body

    const skill = await Skill.findById(skillId);
    if (!skill) {
        throw new ApiError(404, "skill not found");
    }
    if (level < 1 || level > 5) {
        throw new ApiError(400, "level is must be a number between 1 to 5.")
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
                icon: iconLink
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

    const skill = await Skill.findById(skillId);

    if (!skill) {
        throw new ApiError(404, "skill is not found.");
    }

    if (skill.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "you are not authorized to delete this skill");
    }

    const response = await Skill.findByIdAndDelete(skillId);

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
    getAllSkills,
    getSkillById,
    updateSkills,
    deleteSkills
}