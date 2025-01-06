import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   
    addSkills,
    getAllSkills,
    getSkillById,
    updateSkills,
    deleteSkills
} from "../controllers/skill.controller.js"

const router = Router();

router.route("/add-skills").post(verifyJWT, addSkills);
router.route("/get-skills/:userId").get(verifyJWT, getAllSkills);
router.route("/get-skill-by-id/:skillId").get(verifyJWT, getSkillById);
router.route("/update-skill/:skillId").patch(verifyJWT, updateSkills);
router.route("/delete-skill/:skillId").delete(verifyJWT, deleteSkills);

export default router;