import express from "express";
import cors from "cors"


const app = express();

//CORS: Ensures secure access for specific domains.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

export {app}