import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();

//CORS: Ensures secure access for specific domains.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

//import routes
import userRouter from "./routes/user.route.js"
import skillsRouter from "./routes/skill.route.js"
import experienceRouter from "./routes/experience.route.js"


app.use("/api/v1/users", userRouter);
app.use("api/v1/skills", skillsRouter);
app.use("api/v1/experience", experienceRouter);

// http://localhost:8000/api/v1/users/register

export {app}