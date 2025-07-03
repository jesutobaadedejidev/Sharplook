import mongoose from "mongoose";

// schema is a construct that helps us add data in the database

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: Array, required: true },
  date: { type: Number, required: true },
});

//when the product model is available then that product model would be used and assigned in this product model variable but if not available, a new model would be created using this schema
const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
