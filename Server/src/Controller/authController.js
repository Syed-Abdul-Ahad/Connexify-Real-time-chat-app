import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import User from "./../Model/userModel.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import cloudinary from "../Lib/cloudinary.js";



const generateToken = (userId,res)=>{
    const token = jwt.sign({id:userId},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    });
    
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
}




export const signup = asyncErrorHandler( async (req,res,next)=>{

    const {fullName,email,password,profilePic} = req.body

        const user = await User.findOne({email})
        if(user){
            const error = new CustomError("This email already exists")
            return next(error);
        }
        
        const newUser = await User.create({fullName,email,password,profilePic})

        if(newUser){
            const token = generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                status:"success",
                token,
                user:newUser
            })
        }
})


export const login = asyncErrorHandler( async (req,res,next)=>{
    
    const {email, password} = req.body;

    if(!email || !password){
        const error = new CustomError("Email and password field is required",400)
        return next(error);
    }

    const user = await User.findOne({email:email}).select("+password");
    
    if(!user){
        const error =  new CustomError("Incorrect email or password",400)
        return next(error)
    }

    const isMatch = await user.comparePasswordInDB(password, user.password);

    if(!user || !isMatch){
        const error =  new CustomError("Incorrect email or password",400)
        return next(error)
    }


    const token = generateToken(user._id,res)

    res.status(200).json({
        status:"success",
        token,
        user
    })

})



export const logout = asyncErrorHandler((req,res,next)=>{
    res.cookie("jwt","",{
        maxAge:0
    })

    res.status(200).json({message:"logged out successfully"})
})


export const protect = asyncErrorHandler(async (req,res,next)=>{

    // const testToken = req.headers.authorization;   to get it through header
    const token = req.cookies.jwt

    if(!token){
        const error = new CustomError("You are not loggedIn",401)
            return next(error)
    }


    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if(!decodedToken){
        const error = new CustomError("Unauthorized",401)
            return next(error)
    }


    const user = await User.findById(decodedToken.id).select("-password")

    if(!user){
        const err = new CustomError('The user with the given token doest exist',401)
        return next(err);
    }

    req.user = user;
    next()
})



export const updateProfile = asyncErrorHandler(async(req,res,next)=>{

    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
        const error = new CustomError("ProfilePic is required",400)
        return next(error)
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); //this gives you a response object in which secure_url is used
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new:true})

    res.status(200).json({
        status:"success",
        user:updatedUser
    })
})




export const checkAuth = asyncErrorHandler((req,res,next)=>{
    res.status(200).json({
        user:req.user
    })
})
