import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connection = ()=>{
    mongoose.connect(process.env.DB_CONN_STRING)
    .then(()=>{console.log("DB connection Successful")})
    .catch((err)=>console.log("ERROR", err))
}

export default connection;
