import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    addSkills,
    getSkills,
    updateSkills,
    deleteSkills
} from "../controllers/skill.controller.js"

const router = Router();

router.route("/add-skills").post(verifyJWT, addSkills);
router.route("/get-skills/:userId").get(verifyJWT, getSkills);
router.route("/update-skills/:skillId").patch(verifyJWT, updateSkills);
router.route("/delete-skills/:skillId").delete(verifyJWT, deleteSkills);

export default router;