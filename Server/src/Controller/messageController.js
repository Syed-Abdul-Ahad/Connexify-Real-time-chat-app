import cloudinary from "../Lib/cloudinary.js";
import { getRecieverSocketId, io } from "../Lib/socket.js";
import Message from "../Model/messageModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "./../utils/customError.js"
import User from "./../Model/userModel.js"
import Contact from "../Model/contactModel.js";



// export const addUser = asyncErrorHandler(async (req, res, next) => {
//     const {email}  = req.body;
    
//     // Find the user being added
//     const userToAdd = await User.findOne({ email });
//     if (!userToAdd) {
//         const err =  new CustomError("User not found", 404);
//         return next(err)
//     }

//     const loggedInUserId = req.user._id;
    
//     // Prevent duplicate contacts
//     const existingContact = await Contact.findOne({ 
//         $or: [
//             { userId: loggedInUserId, contactId: userToAdd._id },
//             { userId: userToAdd._id, contactId: loggedInUserId }
//         ]
//     });
    
//     if (existingContact) {
//         const err =  new CustomError("Contact already exist", 400);
//         return next(err)
//     }

//     await Contact.create({ userId: loggedInUserId, contactId: userToAdd._id });

//     res.status(201).json({
//         status: "success",
//         message: "Contact added for both users",
//     });
// });




export const addUser = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user._id; // Authenticated user (who is adding the contact)

        // Find user by email
        const contactUser = await User.findOne({ email });
        if (!contactUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const contactId = contactUser._id;

        // ✅ Ensure user is not trying to add themselves
        if (userId.toString() === contactId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot add yourself as a contact" });
        }

        // ✅ Check if this contact already exists for the user
        const existingContact = await Contact.findOne({ userId, contactId });

        if (existingContact) {
            return res.status(400).json({ success: false, message: "This contact already exists" });
        }

        // ✅ Insert new contact
        const newContact = await Contact.create({ userId, contactId });

        return res.status(201).json({ success: true, message: "User added successfully", contact: newContact });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getUsersForSidebar = asyncErrorHandler( async(req,res,next)=>{

    const loggedInUserId = req.user._id;

    const filteredUsers = await Contact.find({
        $or: [
          { userId: loggedInUserId },  
          { contactId: loggedInUserId }
        ]
      })
        .populate("userId", "fullName email profilePic")
        .populate("contactId", "fullName email profilePic")
        .lean();
      
      // Remove the logged-in user from results
      const usersForSidebar = filteredUsers.map(user => {
        return user.userId._id.toString() === loggedInUserId.toString()
          ? user.contactId  // If loggedInUser is `userId`, show `contactId`
          : user.userId;    // If loggedInUser is `contactId`, show `userId`
      });
      
      res.status(200).json({
        status: "success",
        data: { users: usersForSidebar },
      });

})


export const getMessage = asyncErrorHandler(async(req,res,next)=>{
    const userToChatId = req.params.id
    const myId = req.user._id

    const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId: userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    }) // find those messages in which i am the sender or the person whose chat is open is the sender

    res.status(200).json({
        status:"success",
        data:{
            messages
        }
    })
})



export const sendMessage = asyncErrorHandler(async(req,res,next)=>{

    const {text,image} = req.body;
    const {id:receiverId} = req.params;  // the id from the url parameter when we click on someone's chat
    const senderId = req.user._id;   // the user who is using (loggedin)

    let imageUrl;

    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({senderId,receiverId,text,image:imageUrl})

    await newMessage.save();

    const receiverSocketId = getRecieverSocketId(receiverId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json({
        status:"success",
        data:{
            newMessage
        }
    })
})


