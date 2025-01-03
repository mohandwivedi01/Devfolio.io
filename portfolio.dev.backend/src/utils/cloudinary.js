import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import { resolve } from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file successfully uploaded
        console.log("file is uploaded on cloudinary ", response);

        //to ensure file is deleted from loacal storage after upload on cloudinary
        await fs.promises.unlink(localFilePath);

        return response;
    } catch (error) {
        //Synchronous unlink(2). Returns undefined 
        //remove the local saved temporary file as the upload failed
        fs.unlinkSync(localFilePath);
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type:'image'
        });
        return result;
    } catch (error) {
        console.log("Error while deleting image from cloudinary: ",error)
        throw new Error("failed to delete image from cloudinary");
    }
}

export {uploadOnCloudinary};