import {Project} from "../models/project.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {User} from "../controllers/user.controller.js"


const addProjectDetails = asyncHandler(async(req, res) => {
    const {title, description, technologiesUsed, projectLink, repoLink, role} = req.body;

    if (!title || !description) {
        throw new ApiError(400, "title or description is missing.");
    }

    const projectDetails = Project.create({
        title,
        description,
        technologiesUsed,
        projectLink: projectLink?.trim(),
        repoLink: repoLink?.trim(),
        role,
        user: req.user?._id
    })

    if(!projectDetails){
        throw new ApiError(500, "something went wrong while uploading project details.");
    }

    return req
    .status
    .json(
        new ApiResponse(200, projectDetails, "project details added successfully.")
    )
})

const getProjectDetails = asyncHandler(async(req, res) => {
    const {userId} = req.param;
    
    if (!userId) {
        throw new ApiError(400, "userId is missing.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "user not found.");
    }
    
    const projectdetails = await Project.find({user: userId});

    if (!projectdetails) {
        throw new ApiError(404, "projects not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, projectdetails, "project details fetched successfully.")
    )
})

const getProjectDetailsByid = asyncHandler(async(req, res) => {
    const {projectId} = req.params;

    if (!projectId) {
        throw new ApiError(400, "project id is missing");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "project not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, project, "project details fecthed successfully.")
    )
})

const updateProjectDetails = asyncHandler(async(req, res) => {
    const {title, description, technologiesUsed, projectLink, repoLink, role} = req.body;
    const {projectId} = req.params;

    if(!projectId){
        throw new ApiError(400, "project id missing.");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "project is not found.");
    }

    if(req.user?._id.toString() !== project.user.toString()){
        throw new ApiError(401, "you are not authorized to edit these details.");
    }

    const updatedProjectDetails = await Project.findByIdAndUpdate(
        projectId,
        {
            $set:{
                title,
                description,
                technologiesUsed,
                projectLink: projectLink?.trim(),
                repoLink: repoLink?.trim(),
                role
            }
        },
        {new:true}
    )

    if (!updatedProjectDetails) {
        throw new ApiError(500, "something went wrong while update project details.");
    }

    return res
    .status(200)
    .json(200, updatedProjectDetails, "project details updated successfully.");
})

const deleteProject = asyncHandler(async(req, res) => {
    const {projectId} = req.params;

    if (!projectId) {
        throw new ApiError(400, "project id is missing")
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "project is not found.");
    }

    if(req.user?._id.toString() !== project.user.toString()){
        throw new ApiError(401, "you are not authorized to delete this project.");
    }

    const response = await Project.findByIdAndDelete(projectId);

    if (!response) {
        throw new ApiError(500, "something went wrong while deleting project.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, response, "project deleted successfully.")
    );
})

const addProjectImage = asyncHandler(async(req, res) => {
    const {projectId} = req.params;

    if (!projectId) {
        throw new ApiError(400, "project id is missing.");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "project not found.");
    }

    if(req.user?._id.toString() !== project.user.toString()){
        throw new ApiError(401, "you are not authorized to add image to this project.");
    }

    let images = [];

    if (req.files && req.files.images) {
        for(let i=0; i<req.files.length; i++){
            const imageLocalPath = req.files[i].images[0]?.path;
            if(!imageLocalPath){
                throw new ApiError(400, "image file is missing.");
            }
            const image = await uploadOnCloudinary(imageLocalPath);

            if (!image) {
                throw new ApiError(500, "something went wrong while uploading image.");
            }
            images.push(image?.url);
        }
    }

    const updatedProjectImages = await Project.findByIdAndUpdate(
        projectId,
        {
            $push:{
                images
            }
        },
        {new:true}
    )

    if (!updatedProjectImages) {
        throw new ApiError(500, "something went wrong while updating project images.");
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedProjectImages, "project images added successfully.")
    )
})

const deleteProjectImage = asyncHandler(async(req, res) => {
    const {projectId} = req.params;
    const {imageUrl} = req.body;

    if (!projectId || !imageUrl) {
        throw new ApiError(400, "project id or image url is missing.");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "project not found.");
    }

    if(req.user?._id.toString() !== project.user.toString()){
        throw new ApiError(401, "you are not authorized to delete image from this project.");
    }

    const updatedImages = await Project.findByIdAndUpdate(
        projectId,
        {
            $pull:{
                images: imageUrl
            }
        },
        {new:true}
    )

    if (!updatedImages) {
        throw new ApiError(500, "something went wrong while deleting image.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedImages, "image deleted successfully.")
    )
})

const addLikes = asyncHandler(async(req, res) => {
    const {projectId} = req.params;

    if (!projectId) {
        throw new ApiError(400, "project id is missing.");
    }

    const project = await Project.findById(projectId); 

    if (!project) {
        throw new ApiError(404, "project not found.");
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $inc:{
                likes: 1
            }
        },
        {new:true}
    )

    if (!updatedProject) {
        throw new ApiError(500, "something went wrong while updating likes.");
    }   

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedProject, "project liked successfully.")
    )
})

const removeLikes = asyncHandler(async(req, res) => {
    const {projectId} = req.params;

    if (!projectId) {
        throw new ApiError(400, "project id is missing.");
    }

    const project = await Project.findById(projectId); 

    if (!project) {
        throw new ApiError(404, "project not found.");
    }

   const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $inc:{
                likes: -1
            }
        },
        {new:true}
   )

    if (!updatedProject) {
        throw new ApiError(500, "something went wrong while updating likes.");
    }   

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedProject, "project liked successfully.")
    )
})

// 
export {
    addProjectDetails,
    getProjectDetails,
    getProjectDetailsByid,
    updateProjectDetails,
    deleteProject,
    addProjectImage,
    deleteProjectImage,
    addLikes,
    removeLikes 
}
