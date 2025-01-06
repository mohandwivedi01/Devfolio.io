import { Router } from "express";

import {
    addBlogDetails, 
    getBlogDetails, 
    getBlogDetailsById, 
    updateBlogDetails, 
    deleteBlogDetails,
    addLike,
    removeLike
} from "../controllers/blog.controller.js";

const router = Router();

router.route("/add-blog-details").post(addBlogDetails);
router.route("/get-blog-details/:userId").get(getBlogDetails);
router.route("/get-blog-details-by-id/:blogId").get(getBlogDetailsById);
router.route("/update-blog-details/:blogId").patch(updateBlogDetails);
router.route("/delete-blog-details/:blogId").delete(deleteBlogDetails);
router.route("/add-blog-like/:blogId").patch(addLike);
router.route("/remove-blog-like/:blogId").patch(removeLike);

export default router;