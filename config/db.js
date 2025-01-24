import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected successfully", conn.connection.host);
  } catch (error) {
    console.log("Error connecting DB", error);
    process.exit(1);
  }
};

export default connectDb;
