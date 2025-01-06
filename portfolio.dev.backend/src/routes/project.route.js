import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

import {
    addProjectDetails,
    getProjectDetails,
    getProjectDetailsByid,
    updateProjectDetails,
    deleteProject,
    addProjectImage,
    deleteProjectImage   
} from "../controllers/project.controller.js"

router.route('/add-project-details').post(verifyJWT, addProjectDetails);
router.route('/get-all-projects/:userId').get(verifyJWT, getProjectDetails);
router.route('/get-project/:projectId').get(verifyJWT, getProjectDetailsByid);
router.route('/update-project/:projectId').patch(verifyJWT, updateProjectDetails);
router.route('/delete-project/:projectId').delete(verifyJWT, deleteProject);
router.route('/add-project-images/:projectId').patch(verifyJWT, addProjectImage);
router.route('/delete-project-image/:projectId').patch(verifyJWT, deleteProjectImage);

export default {router};