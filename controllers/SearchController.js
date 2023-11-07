import ProductModel from "../models/Product.js";

export const getSearch = async (req, res) => {
  const searchProducts = req.query.product || "";
  console.log(searchProducts)
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 6;
    const skip = (pageNumber - 1) * pageSize;

    const products = await ProductModel.find({ $text: { $search: searchProducts } });
    const limitedProducts = await ProductModel.find({ $text: { $search: searchProducts } }).skip(skip).limit(pageSize);

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / pageSize);

    console.log(limitedProducts)

    res.json({products, limitedProducts, totalProducts: products.length, totalPages});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve searching products.",
    });
  }
};
