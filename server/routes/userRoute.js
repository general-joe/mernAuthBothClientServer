import express from "express"
import userAuth from "../middleware/userAuth.js";
import { deleteUser, getUserData, updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData)
userRouter.patch("/update", updateUser);
userRouter.delete("/:userId", deleteUser);




export default userRouter;