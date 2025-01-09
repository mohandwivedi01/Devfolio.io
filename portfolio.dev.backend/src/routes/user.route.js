import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    createUser, 
    healthCheck,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserDetails,
    updateDetails,
    changePassword,
    updateResume

} from "../controllers/user.controller.js";


const router =  Router();

router.route("/health-check").get(healthCheck);

router.route("/register").post(upload.fields([
    {
        name: "profilePic",
        maxCount: 1
    },
    {
        name: "resume",
        maxCount: 1
    }
]
), createUser );

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)
router.route("/update-details").patch(verifyJWT, updateDetails)
router.route("/get-details/:email").get(verifyJWT, getUserDetails)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/update-details").post(verifyJWT, changePassword)

router.route("/update-resume").patch(verifyJWT, upload.fields([{
    name: "resume",
    maxCount: 1
}]), updateResume)


export default router;

