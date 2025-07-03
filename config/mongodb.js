import mongoose from "mongoose";

const connectDB = async () => {
  // whenever we execute this function then the mongodb database will be connected to this project
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  //connect mongoose package from the mongodb atlas serrver
  await mongoose.connect(`${process.env.MONGODB_URI}/saas`);
};

export default connectDB;
