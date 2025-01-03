import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { 
    createUser,
    healthCheck

} from "../controllers/user.controller.js";

console.log("createUser: ", createUser);

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



export default router;

