// import express from "express"
// import dotenv from "dotenv"
// dotenv.config()
// import connectDb from "./config/db.js"
// import authRouter from "./routes/auth.routes.js"
// import cors from "cors"
// import cookieParser from "cookie-parser"
// import userRouter from "./routes/user.routes.js"
// import geminiResponse from "./gemini.js"


// const app=express()
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))
// const port=process.env.PORT || 5000
// app.use(express.json())
// app.use(cookieParser())
// app.use("/api/auth",authRouter)
// app.use("/api/user",userRouter)


// app.listen(port,()=>{
//     connectDb()
//     console.log("server started")
// })


import mongoose from "mongoose";
mongoose.set("bufferCommands", false);
import geminiResponse from "./gemini.js"


import express from "express"
import dotenv from "dotenv"
dotenv.config()

import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"


const app = express()

app.use(cors({
    origin:["http://localhost:5173",
     "https://virtualassitant.onrender.com"],
    credentials:true
}))

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.send("Backend working");
});

const startServer = async () => {
    try {
        await connectDb()
        console.log(" DB connected")

        app.listen(port, () => {
            console.log(" server started")
        })

    } catch (error) {
        console.log(" error:", error)
    }
}

startServer()