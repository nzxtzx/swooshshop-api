import ProductModel from "../models/Product.js";

export const getAll = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve discounted products.",
    });
  }
};

export const getProductsHome = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 3;

    const skip = (page - 1) * pageSize;

    const products = await ProductModel.find();
    const limitedProducts = await ProductModel.find().skip(skip).limit(pageSize);

    res.json({products, limitedProducts, totalProducts: products.length});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve discounted products.",
    });
  }
};

export const getDiscounted = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 3;

    const skip = (page - 1) * pageSize;

    const query = { "product.sale": { $exists: true } };

    const discountedProducts = await ProductModel.find(query);
    const discountedLimitedProducts = await ProductModel.find(query).skip(skip).limit(pageSize);

    res.json({ discountedProducts, discountedLimitedProducts, totalProducts: discountedProducts.length});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve discounted products.",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.log(err);
    req.status(500).json({
      message: "Failed to retrieve discounted products.",
    });
  }
};

export const getFiltered = async (req, res) => {
  let sortDirection = -1;
  let pageSize = parseInt(req.query.pageSize) || 6;
  let pageNumber = parseInt(req.query.pageNumber) || 1;
  const skip = (pageNumber - 1) * pageSize;

  try {
    const query = {};

    if (req.query.sort && req.query.sort.toLowerCase() === 'asc') {
      sortDirection = 1; 
    }

    if (req.query.gender) {
      query["product.gender"] = req.query.gender;
    }
    if (req.query.priceMin && req.query.priceMax) {
      query["product.price"] = {
        $gte: parseInt(req.query.priceMin),
        $lte: parseInt(req.query.priceMax),
      };
    }
    if (req.query.sale) {
      query["product.sale"] = parseInt(req.query.sale);
    }
    if (req.query.discount === 'true') {
      // Add a condition to filter products with the 'sale' field
      query["product.sale"] = { $exists: true };
    }
    if (req.query.size) {
      query["product.sizes"] = { $elemMatch: { size: req.query.size, isAvailable: true } };
    }

    if (req.query.color) {
      const colorsToFilter = req.query.color.split(",");

      const colorFilters = colorsToFilter.map((color) => ({
        [`product.colors.${color}`]: { $exists: true },
      }));

      query.$or = colorFilters;
    };

    const allFilteredProducts = await ProductModel.find(query).sort({
      "product.price": sortDirection,
    });
    const limitedFilteredProducts = await ProductModel.find(query)
      .sort({ "product.price": sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalProducts = allFilteredProducts.length;
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.json({
      allFilteredProducts,
      limitedFilteredProducts,
      pageSize,
      pageNumber,
      totalProducts: allFilteredProducts,
      limitedProducts: limitedFilteredProducts,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve filtered products.",
    });
  }
};