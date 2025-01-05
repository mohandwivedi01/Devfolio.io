import { Skill } from "../models/skills.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";



const addSkills = asyncHandler(async(req, res) => {
    const {skillName, level, iconLink} = req.body;
    const {userId} = req.params;

    if(!skillName){
        throw new ApiError(400, "skill name is missing.");
    }

    const user = await User.findByid()

})

const getSkills = asyncHandler(async(req, res) => {

})

const updateSkills = asyncHandler(async(req, res) => {

})

const deleteSkills = asyncHandler(async(req, res) => {

})