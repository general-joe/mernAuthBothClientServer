import mongoose from "mongoose";
// ✅ Import mongoose so we can talk to MongoDB
// 🇬🇭 Like bringing the attendance register to class to record student data

const connectDB = async () => {
  // ✅ Create an async function called connectDB
  // async = “this job might take time, so wait for it before moving on”
  // 🇬🇭 Like a prefect going to the headmaster’s office to open the records room

  try {
    // ✅ Start a try block to attempt something that might fail
    // 🇬🇭 Like trying to open the office door; if it fails, handle the problem

    const uri = process.env.MONGODB_URI;
    // ✅ Get the MongoDB server address from environment variables (.env file)
    // 🇬🇭 Like checking a locked drawer for the key to the office, instead of shouting the key location

    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
      // ✅ If there is no URI (key), throw an error and stop the function
      // 🇬🇭 Like shouting: "Madam! The key is missing!" and stopping school until fixed
    }

    await mongoose.connect(uri, {
      dbName: "mernAuthBackendApi",
    });
    // ✅ Connect to the MongoDB database
    // await = “wait until the connection is successful before continuing”
    // dbName = specify which database to use
    // 🇬🇭 Like the prefect waits until the office door opens and enters the student records room

    console.log("✅ MongoDB connected");
    // ✅ Print success message when the connection works
    // 🇬🇭 Announce in assembly: "Office is open, school can start!"

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
      // ✅ Watch for any database errors and log them
      // 🇬🇭 If the office light goes off suddenly, someone reports: "Sir, there is a problem in the office!"
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
      // ✅ Watch for disconnections from MongoDB
      // 🇬🇭 If the headmaster locks the office and leaves, announce: "Attention! The office is closed."
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // ✅ If anything in try fails, print the error message
    // 🇬🇭 If the office cannot be opened, tell everyone: "No classes today! Go home."

    process.exit(1);
    // ✅ Stop the app completely because it cannot work without the database
    // 🇬🇭 The school cannot continue without the records office open
  }
};

export default connectDB;
// ✅ Export the function so other files can use it
// 🇬🇭 Tell other teachers: “If you want to open the office, just call this prefect.”
