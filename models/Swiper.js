import mongoose from "mongoose";

const swiperSchema = new mongoose.Schema(
  {
    image: {
      type: [String],
    },
    text: {
      type: String,
    },
    price: {
      type: Number,
    },
    name: {
      type: String,
    },
  }
);

const Swiper = mongoose.model("Swiper", swiperSchema);

export default Swiper;