import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required: [true,"email field is required"],
            unique: true
        },
        fullName:{
            type: String,
            required: [true,"full name is required"]
        },
        password:{
            type:String,
            minlength:6,
            required: [true,"password is required"],
            select:false
        },
        profilePic:{
            type: String,
            default:""
        }
    },
    {timestamps: true}  // it shows created at and changed at
)



userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
  
    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


userSchema.methods.comparePasswordInDB = async (password,passwordDB)=>{
    return await bcrypt.compare(password,passwordDB)
}



const User = mongoose.model("User", userSchema)

export default User;