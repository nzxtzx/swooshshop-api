import mongoose from "mongoose";
import ReviewModel from "./Review.js";

const { Schema } = mongoose;

const productScheme = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
  },
  oldPrice: {
    type: Number,
  },
  gender: {
    type: String,
  },
  status: {
    type: String,
  },
  popularity: {
    type: String,
  },
  sale: {
    type: String,
  },
  colors: {
    type: [String],
  },
  additionallDescription: {
    type: String,
  },
  description: {
    type: String,
  },
  features: {
    type: [String],
  },
  sizes: {
    type: [Number],
  },
  reviews: [ReviewModel.schema],
});

const Product = mongoose.model("Product", productScheme);

export default Product;
