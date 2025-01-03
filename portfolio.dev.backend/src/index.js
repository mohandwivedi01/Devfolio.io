import dotenv from "dotenv"
import connetDB from "./db/dbConection.js"
import { app } from "./app.js"

dotenv.config({
    path: "./env"
})

 
connetDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is listening on port: ${process.env.PORT || 8000}`);
    })
}).catch((err) => {
    console.log("MongoDB connection failed: ", err);
});