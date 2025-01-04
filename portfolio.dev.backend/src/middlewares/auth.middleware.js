// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// const verifyJWT = asyncHandler(async (req, _, next) => {
//     /**
//      * extrat the token from request header or from cookies
//      * decode the token and verify it
//      * quary the user from data for user info
//      * add the user details to the req.
//      * call next middleware 
//      */

//     const token = req.cookies?.accessToken || ReadableStreamBYOBRequest.header("Authorization")?.replace("Bearer ", "")

    
//     if(!token){
//         throw new ApiError(401, "Unauthorized request")
//     }

//     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
//     const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    
//     if(!user){
//         throw new ApiError(401, "Invelid Access token")
//     }

//     req.user = user;
//     next();
// })

// export { verifyJWT };



import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        /*
        Cookies: req.cookies?.accessToken if the token is stored in cookies.
        Authorization Header: req.header("Authorization")?.replace("Bearer ", "") if the token is sent as a Bearer token in the Authorization header.
        */
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log("******token",token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        
        /**
         * Verifies the token using the secret key process.env.ACCESS_TOKEN_SECRET.
         * decodedToken: Contains the payload of the token (e.g., user ID and other claims).
         */
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        /**
         * decodedToken?._id: Extracts the user ID from the token payload.
         * User.findById(decodedToken?._id): Queries the database to find the user by their ID.
         * .select("-password -refreshToken"): Excludes sensitive fields (like password and refreshToken) from the result.
         */
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log("user: ",user)
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})