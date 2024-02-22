import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_CNN as string
    );
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;