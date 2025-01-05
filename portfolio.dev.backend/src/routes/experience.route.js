import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

import {
    addExperienceDetails,
    getExperienceDetails,
    updateExperienceDetails,
    deleteExperienceDetails
} from "../controllers/experience.controller.js"

const router = Router();

router.route("/add-experience-details").post(verifyJWT, addExperienceDetails);
router.route("/get-experience-details/:userId").get(verifyJWT, getExperienceDetails);
router.route("/update-experience-details/:experienceDetailsId").patch(verifyJWT, updateExperienceDetails);
router.route("/delete-experience/:experienceDetailsId").delete(verifyJWT, deleteExperienceDetails);

export default router;