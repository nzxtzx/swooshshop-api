import SwiperModel from "../models/Swiper.js"

export const getSwiper = async (req, res) => {
    try {
      const swipers = await SwiperModel.find();
      res.json(swipers);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось получить товары",
      });
    }
};