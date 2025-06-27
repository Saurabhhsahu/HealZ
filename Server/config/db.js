import mongoose from "mongoose";

// Set up event listeners once when the module loads
mongoose.connection.on('connected', () => {
  console.log("Database connected");
});

mongoose.connection.on('error', (err) => {
  console.log("Database connection error:", err);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log("Error in connecting to database:", err);
  }
};

export default connectDB;