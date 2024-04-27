import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (typeof uri !== "string") {
      throw new Error("MONGO_URI is not a string");
    }
    const connectionInstance = await mongoose.connect(`${uri}/${DB_NAME}`);

    console.log("Host connected.");
    console.log("Connection Instance: ", connectionInstance.connection.host);
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};
export default connectDB;
