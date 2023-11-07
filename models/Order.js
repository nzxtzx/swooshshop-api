import mongoose from "mongoose";

const { Schema } = mongoose;

const orderScheme = new mongoose.Schema({
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
});

const Order = mongoose.model("Order", orderScheme);

export default Order;
