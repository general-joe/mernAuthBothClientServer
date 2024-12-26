//Here we are going to create user's model and to create user's model, we need to import mongoose package here because tha is what we are going to use to create user's model
//importing mongoose package
import mongoose from "mongoose";

//This function is going to create user's schema,
//schema is like blueprint of our collection in database
//Here we are going to define what fields we are going to have in our collection using mongoose schema constructor
export const userSchema = new mongoose.Schema({
  //Here we are defining fields of our collection or defining our user data structure
  name: { type: String, required: true },
  // Here at the email field we have added additional property called unique so two users can't have same email
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //All the following fields will added automatically because they are default fields in mongoose
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

//Using userSchema we are going to create user's model for our database

//Here we using the mongoose .model function to create user's model and we are passing userSchema as argument to this function and store it in the variable called userModel
//It will create new model called user using userSchema where we can store the userSchema's data
//This line of code  mongoose.model("user", userSchema) will be creating user and user again whenever we run the above code
//So in order to prevent that we are going to add this line of code mongoose.models.user || to check if user model already exists in our database the it will be use, if the user model is not available then it will continue to create user modal

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
