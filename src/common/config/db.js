import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MONGODB connected successful at ${conn.connection.host}`);
  } catch (error) {
    console.log("failed to connect to MONGODB", err);
    process.exit(1);
  }
};

export default connectDB;
