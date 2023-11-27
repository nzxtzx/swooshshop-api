import ProductModel from "../models/Product.js";
import ReviewModel from "../models/Review.js";
import UserModel from "../models/User.js";

export const createReview = async (req, res) => {
  try {
    const editingProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { new: true }
    );

    console.log("product:", product)

    if (!editingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("id:",userId)

    const userId = req.params.userId;

    const user = await UserModel.findById(userId)

    const { rating, text } = req.body;

    const newReview = new ReviewModel({ user: userId, rating, text, fullName: user.fullName });

    console.log(userId, rating, text, user.fullName);

    editingProduct.reviews.push(newReview);

    const updatedProduct = await editingProduct.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while adding a product review" });
  }
};
