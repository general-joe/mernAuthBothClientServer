
import mongoose from "mongoose";
 

//another way of connecting mongodb database

 const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri)
      throw new Error("MONGODB_URI is missing in environment variables");

    await mongoose.connect(`${uri}/mernAuthBackendApi`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");

    mongoose.connection.on("error", (err) =>
      console.error("MongoDB error:", err)
    );
    mongoose.connection.on("disconnected", () =>
      console.warn("MongoDB disconnected")
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
