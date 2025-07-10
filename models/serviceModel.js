import mongoose from "mongoose";

// schema is a construct that helps us add data in the database

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: Array, required: true },
  date: { type: Number, required: true },
});

//when the product model is available then that product model would be used and assigned in this product model variable but if not available, a new model would be created using this schema
const serviceModel =
  mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;
