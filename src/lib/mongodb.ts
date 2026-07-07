import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI");
}

let isConnected = false;
export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
  
  
  
  await mongoose.connect(MONGODB_URI);

  console.log("AFTER CONNECT");

  isConnected = true;
  

console.log("STATE:", mongoose.connection.readyState);



  console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    throw error;
  }
};