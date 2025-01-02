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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export {app}