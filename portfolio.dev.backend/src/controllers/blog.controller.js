import {Blog} from '../models/blog.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addBlogDetails = asyncHandler(async (req, res) => {
    const {title, description, blogLink, platform} = req.body;
    
    if (!title || !blogLink || !platform) {
        return next(new ApiError(400, "Please provide all the details"))
    }

    const blogDetails = await Blog.create({
        title,
        description,
        blogLink: blogLink.toLowerCase().trim(),
        platform,
        user: req.user._id
    })

    if (!blogDetails) {
        return next(new ApiError(500, "Failed to add blog details"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, blogDetails, "Blog details added successfully"))
})

const getBlogDetails = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    
    if(userId){
        throw new ApiError(400, "userId is missing.");
    }

    const blogDetails = await Blog.find({user: userId});

    if (!blogDetails) {
        return next(new ApiError(500, "Failed to get blog details"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, blogDetails, "Blog details fetched successfully"))

})

const getBlogDetailsById = asyncHandler(async (req, res) => {
    const {blogId} = req.params;

    if (!blogId) {
        return next(new ApiError(400, "Please provide blogId"))
    }

    const blogDetail  = await Blog.findById(blogId)

    if (!blogDetail) {
        return next(new ApiError(404, "Blog details not found"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, blogDetail, "Blog details fetched successfully"))
})

const updateBlogDetails = asyncHandler(async (req, res) => {
    const {blogId} = req.params;
    const {title, description, blogLink, platform} = req.body;

    if (!blogId) {
        return next(new ApiError(400, "Please provide blogId"))
    }

    const blogDetails = await Blog.findById(blogId);

    if (!blogDetails) {
        return next(new ApiError(404, "Blog details not found"))
    }

    if (req.user._id.toString() !== blogDetails.user.toString()) {
        return next(new ApiError(401, "You are not authorized to update this blog details"))
    }

    const updateBlogDetails = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set:{
                title,
                description,
                blogLink: blogLink.toLowerCase().trim(),
                platform
            }
        },
        {new:true}
    )

    if (!updateBlogDetails) {
        return next(new ApiError(500, "Failed to update blog details"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updateBlogDetails, "Blog details updated successfully"))

})

const deleteBlogDetails = asyncHandler(async (req, res) => {
    const {blogId} = req.params;

    if (!blogId) {
        return next(new ApiError(400, "Please provide blogId"))
    }

    const blogDetails = await Blog.findById(blogId);

    if (!blogDetails) {
        return next(new ApiError(404, "Blog details not found"))
    }   

    if (req.user._id.toString() !== blogDetails.user.toString()) {
        return next(new ApiError(401, "You are not authorized to delete this blog details"))
    }   

    const deleteBlogDetails = await Blog.findByIdAndDelete(blogId); 

    if (!deleteBlogDetails) {
        return next(new ApiError(500, "Failed to delete blog details"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deleteBlogDetails, "Blog details deleted successfully"))
})

const addLike = asyncHandler(async (req, res) => {
    const {blogId} = req.params;

    if (!blogId) {
        return next(new ApiError(400, "Please provide blogId"))
    }

    const blogDetails = await Blog.findById(blogId);

    if (!blogDetails) {
        return next(new ApiError(404, "Blog details not found"))
    }

    const likeBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $inc:{
                likes:1
            }
        },
        {new:true}
    )

    if (!likeBlog) {
        return next(new ApiError(500, "Failed to like blog"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, likeBlog, "Blog liked successfully"))
})

const removeLike = asyncHandler(async (req, res) => {
    const {blogId} = req.params;

    if (!blogId) {
        return next(new ApiError(400, "Please provide blogId"))
    }

    const blogDetails = await Blog.findById(blogId);

    if (!blogDetails) {
        return next(new ApiError(404, "Blog details not found"))
    }

    const unlikeBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $inc:{
                likes:-1
            }
        },
        {new:true}
    )
    
    if (!unlikeBlog) {
        return next(new ApiError(500, "Failed to unlike blog"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, unlikeBlog, "Blog unliked successfully"))
})

export {
    addBlogDetails, 
    getBlogDetails, 
    getBlogDetailsById, 
    updateBlogDetails, 
    deleteBlogDetails,
    addLike,
    removeLike
}