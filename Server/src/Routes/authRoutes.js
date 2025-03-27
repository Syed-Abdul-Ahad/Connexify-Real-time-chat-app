import express from "express"
import {signup,login,logout, updateProfile, protect, checkAuth} from "./../Controller/authController.js"


const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.put("/update-profile",protect,updateProfile)
router.get("/check",protect,checkAuth)


export default router;