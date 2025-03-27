import express from "express";
import authRoutes from "./Routes/authRoutes.js"
import messageRoutes from "./Routes/messageRoutes.js"
import connection from "./Lib/db.js";
import cors from "cors"
import CustomError from "./utils/customError.js";
import globalErrorHandler from "./Controller/errorController.js";
import cookieParser from "cookie-parser"
import {app, server, io} from "./Lib/socket.js"


import dotenv from 'dotenv';
dotenv.config()





app.use(express.json({ limit: '10mb' })); // Adjust limit as per your needs
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser()); // allow to parse the cookie

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))



app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


app.use("*",(req,res,next)=>{
    const err = new CustomError(`The url you wrote ${req.originalUrl} is not right`, 404)
    next(err)
})

app.use(cors())
 

app.use(globalErrorHandler);


const port = process.env.PORT

server.listen(port,()=>{
    console.log("Server is running on port",port)
    connection()
})