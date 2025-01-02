import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"



const connetDB = async () => {
    try {
        const conIns = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected successfully, DB HOST: ${conIns.connection.host}`);
        // console.log(conIns);
    } catch (error) {
        console.log("MongoDB connection failed: ", error);
        process.exit(1);
    }
}

export default connetDB;