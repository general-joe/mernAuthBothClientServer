import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { isValidObjectId } from "mongoose";

//function to create user and it async arrow function
export const register = async (req, res) => {
  //To create a user we need to get the data from the request body and the datas are name, email, password and we distructure them from the req.body
  const { name, email, password } = req.body;
  //we are checking if all field are filled
  if (!name || !email || !password) {
    //We are returnin a status code of 400 and a message that all fields are required
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields." });
  }
  //We are using the try catch block to catch any error that may occur
  try {
    //We are checking if the email is already in use
    const existingUser = await userModel.findOne({ email });
    //If the email is already in use we are returnin a status code of 400 and a message that the email is already in use
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exist." });
    }
    //WE are using the bcrypt to hash the password
    //When we take large like 15 and above it will increase high security but it will take more time to encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //We are creating a new user after hasing the password
    const user = new userModel({ name, email, password: hashedPassword });
    //We are saving the user to the database
    await user.save();

    //This line of codes generates a token that authenticates the user in future requests.
    // Generate Access Token (15 minutes)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Clear any existing refreshToken cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.cookie("token", token, {
      //Prevents client-side scripts from accessing the cookie (enhances security)
      httpOnly: true,
      //Ensures the cookie is only sent over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      //Protects against cross-site request forgery (CSRF)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      //Sets the cookie to expire after 7days
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    //Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to De-General",
      text: `Hello ${user.name}, welcome to De-General's website. You have successfully created an account with an email id:${user.email}`,
    };

    //Send the email
    await transporter
      .sendMail(mailOptions)
      .then(() => console.log("Email sent successfully!"))
      .catch((err) => console.error("Failed to send email:", err.message));

    //We are sending response true success to the client

    return res.status(200).json({ success: true });
  } catch (error) {
    //We are returnin a status code of 500 and a message that an error occurred
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Creating login arrow function
export const logIn = async (req, res) => {
  //We are taking the email and password from request dot body
  const { email, password } = req.body;
  //We are checking the availability of email and password
  if (!email || !password) {
    //If not available, we send this response to the client or frontend
    return res
      .status(400)
      .json({ success: true, message: "Email and Password are required" });
  }
  try {
    //We are checking the availability of the user's email
    const user = await userModel.findOne({ email });
    if (!user) {
      //if not available then we send this response to the client or frontend
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }
    //We are comparing the password entered by the user and the one in the database to check whether they are the same
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      //If they are not the same, then we send this response to the client or frontend or the user
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    //This line of codes generates a token that authenticates the user in future requests.
    // Generate Access Token (15 minutes)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      //Prevents client-side scripts from accessing the cookie (enhances security)
      httpOnly: true,
      //Ensures the cookie is only sent over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      //Protects against cross-site request forgery (CSRF)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      //Sets the cookie to expire after  7days
      maxAge: 7 * 24 * 60 * 60 * 1000, //  7days
    });

    //If they are the same, then the system login the user

    return res.status(200).json({ success: true });
  } catch (error) {
    //If error occurs, we catch it here
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Here we are creation logout arrow function

export const logOut = async (req, res) => {
  try {
    //We need to clear cookie in order to logout
    res.clearCookie("token", {
      //Prevents client-side scripts from accessing the cookie (enhances security)
      httpOnly: true,
      //Ensures the cookie is only sent over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      //Protects against cross-site request forgery (CSRF)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(402).json({ success: true, message: "Logged Out" });
  } catch (error) {
    //If error occurs, then we catch the error here
    return res.status(500).json({ success: false, message: error.message });
  }
};

//we are creating controller function to send verify otp here

export const sendVerifyOtp = async (req, res) => {
  //send the verification otp to user's email
  try {
    // we are getting the user's id from the request body
    const { userId } = req.body;
    // Get userId from req.user
    // const { id: userId } = req.user;
    //we need to find the user in our database
    //we get the user from the database by using the user id and store it in a variable called user
    const user = await userModel.findById(userId);
    //if the user is not found, then we return 404 status code
    // if (!user) {
    //   return res.status(404).json({ success: false, message: error.message });
    // }
    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Your account is already verified" });
    }
    //It will generate six digit numbers and convert it into a string store in a varible called otp
    // we are sending the verification otp to user's email

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    //we are saving the six digit otp in the user's document in the database and at the verifyOtp's field
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    //we are saving the user's document in the database
    // console.log(user);
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp} and it will expire in 24 hours. Verify your account using this OTP`,
    };
    //sending the email
    await transporter
      .sendMail(mailOption)
      .then(() => console.log("Email sent successfully!"))
      .catch((err) => console.error("Failed to send email:", err.message));
    res
      .status(200)
      .json({ success: true, message: "Verification OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  //we need the user id and the otp from the request body
  const { userId, otp } = req.body;

  //we need to check if the userId is not available and otp is not available
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }
  //if they are available then the code will execute the next line of code
  try {
    //Here we need to find the user by using the userId
    const user = await userModel.findById(userId);
    //if the user is not found then we return 404 status code
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    //if user is available then we verify the otp
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    //supposed if otp is valid
    if (user.verifyOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }
    user.isAccountVerified = true;
    //reset the below fields to their default or previous state
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    //we are saving the user's document in the database
    await user.save();
    return res

      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user function
export const updateUser = async (req, res) => {
  const { userId } = req.params; // User ID from request parameters
  const { name, email, password } = req.body; // Fields to be updated

  // Ensure at least one field is provided for the update
  if (!name && !email && !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update.",
    });
  }

  try {
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`,
      });
    }

    // Update the fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user function
 

export const deleteUser = async (req, res) => {
  const { userId } = req.params; // User ID from request parameters

  // Validate userId format
  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID format.",
    });
  }

  try {
    // Check if the user exists
    const user = await userModel.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`,
      });
    }

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};