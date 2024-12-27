//we import express package
import express from "express";
// we import the cors package
import cors from "cors";
//we import dotenv
import "dotenv/config";
//we import cookieParser
import cookieParser from "cookie-parser";
//import connectDB funtion from config directory
import connectDB  from "./config/mongodb.js";
//We are importing authRouter here
import authRouter  from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";
//let's create a new express app
const app = express();
//we create port variable from the .env file
const PORT = process.env.PORT || 4000;
//we are using database function here or evoking or calling the connectDB function here
connectDB();
//middlewares
 
app.use(express.json());
app.use(cookieParser());
//we use cors middleware to allow cross origin requests
app.use(cors({ credentials: true }));


//This is get endpoint is here and API endpoint
app.get("/", (req, res) => res.send("API working"));
//we are using authRouter here as root path and middleware
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

//The app is listen to request on the port 4000 here
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
