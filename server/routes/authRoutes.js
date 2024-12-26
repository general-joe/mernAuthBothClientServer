//Here we need to create express router
//importing express package here
import express from "express"
//We have imported all the functions from authController.js
import { deleteUser, logIn, logOut, register, sendVerifyOtp, updateUser, verifyEmail } from "../controllers/authController.js"
import userAuth from "../middleware/userAuth.js"

//We have created new router here
 export const authRouter = express.Router()

//We have created three end points using the express router
authRouter.post("/register", register)
authRouter.post("/login", logIn)
authRouter.post("/logout", logOut)
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp)
authRouter.post("/verify-account", userAuth, verifyEmail)
authRouter.patch("/update", updateUser)
authRouter.delete("/:userId", deleteUser)