//Here we need to create express router
//importing express package here
import express from "express";
//We have imported all the functions from authController.js
import {
  isAuthenticated,
  logIn,
  logOut,
  register,
  resetPassword,
  sendPasswordResetOTP,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

//We have created new router here
const authRouter = express.Router();

//We have created three end points using the express router
authRouter.post("/register", register);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.post("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendPasswordResetOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
