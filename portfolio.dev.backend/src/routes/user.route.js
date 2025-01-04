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
    updateDetails

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
// router.route("update-details").patch(verifyJWT, updateDetails)
// router.route("get-user-details").get(verifyJWT, getUserDetails)



export default router;

