import express from "express"
import { protect } from "../Controller/authController.js";
import { getUsersForSidebar,sendMessage,getMessage, addUser} from "../Controller/messageController.js";

const router = express.Router()

router.post("/addUser",protect,addUser)
router.get("/users",protect, getUsersForSidebar)
router.post("/send/:id",protect,sendMessage)
router.get("/:id",protect,getMessage)

export default router;