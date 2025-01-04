import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const verifyJWT = asyncHandler(async (req, _, next) => {
    /**
     * extrat the token from request header or from cookies
     * decode the token and verify it
     * quary the user from data for user info
     * add the user details to the req.
     * call next middleware 
     */

    

    const token = req.cookies?.accessToken || ReadableStreamBYOBRequest.header("Authorization")?.replace("Bearer ", "")

    
    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    
    if(!user){
        throw new ApiError(401, "Invelid Access token")
    }

    req.user = user;
    next();
})

export { verifyJWT };