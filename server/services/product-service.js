const ApiError = require("../error/ApiError");
const {
  Product,
  Category,
  ProductCategory,
  Review,
  User,
} = require("../db/models/models");
const mongoose = require("mongoose");
const userService = require("./user-service");
const chatService = require("./chat-service");

class ProductService {
  async create(
    categoriesId,
    name,
    price,
    rating,
    sizes,
    userId,
    description,
    shortDescription,
    images,
    instock
  ) {
    const product = await Product.create({
      name,
      price,
      rating,
      sizes,
      userId,
      description,
      shortDescription,
      images,
      instock,
      categoriesId,
    });

    for (const categoryId of categoriesId) {
      // console.log(categoryId);

      const productCategory = new ProductCategory({
        categoryId,
        productId: product._id,
      });
      await productCategory.save();
    }

    const prod = await User.findOne({ _id: userId }, { location: 1 })
      .lean()
      .exec();
    const nearByVendors = await userService.getVendorsNearby(
      prod.location[0],
      prod.location[1]
    );
    const messageData = {
      from: userId,
      type: "BROADCAST",
      message: {
        broadcast: {
          product: product._id,
        },
      },
    };

    var messagePayload = nearByVendors.map((n) => ({
      ...messageData,
      to: n._id,
    }));

    await chatService.create(messagePayload);

    return product;
  }

  async update(
    id,
    categoriesId,
    name,
    price,
    rating,
    sizes,
    // effects,
    // relieve,
    // ingridients,
    description,
    shortDescription,
    images,
    instock
  ) {
    const product = await Product.findById(id);

    if (!product) {
      throw ApiError.internal("Product not found");
    }

    await product.updateOne({
      name,
      price,
      rating,
      sizes,
      // effects,
      // relieve,
      // ingridients,
      description,
      shortDescription,
      images,
      instock,
    });

    await ProductCategory.deleteMany({ productId: id });

    for (const categoryId of categoriesId) {
      const productCategory = new ProductCategory({
        categoryId,
        productId: product._id,
      });
      await productCategory.save();
    }

    return product;
  }

  async getAll(
    categoryId,
    limit,
    offset,
    minPrice,
    maxPrice,
    rate,
    sortBy,
    inStock
  ) {
    const query = {};

    if (categoryId) {
      const productCategoryArray = await ProductCategory.find({
        categoryId,
      });
      const productsIdArray = productCategoryArray.map(
        (item) => item.productId
      );

      query._id = { $in: productsIdArray };
    }

    if (minPrice && maxPrice) {
      query.price = { $gt: minPrice, $lt: maxPrice };
    }

    if (rate && rate.length > 0) {
      query.rating = { $in: rate };
    }

    if (inStock !== "all") {
      query.instock = inStock;
    }

    const sortOptions = {
      default: { createdAt: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1 },
      pricelow: { price: 1 },
      pricehigh: { price: -1 },
    };

    const products = await Product.find(query)
      .sort(sortOptions[sortBy] || sortOptions.default)
      .limit(limit)
      .skip(offset);
    return { count: products.length, rows: products };
  }

  async getAllByProducerId(id) {
    return await Product.find({ userId: id });
  }

  async getAllAdmin(
    categoryId,
    name,
    limit,
    offset,
    minPrice,
    maxPrice,
    inStock
  ) {
    const query = {};

    if (categoryId) {
      const productCategoryArray = await ProductCategory.find({
        categoryId,
      });

      const productsIdArray = productCategoryArray.map(
        (item) => item.productId
      );
      query._id = { $in: productsIdArray };
    }

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (minPrice && maxPrice) {
      query.price = { $gt: minPrice, $lt: maxPrice };
    }

    if (inStock !== "all") {
      query.instock = inStock;
    }

    const products = await Product.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(offset);

    return { count: products.length, rows: products };
  }

  async getOne(id) {
    const product = await Product.findById(id);

    // var test = await Product.aggregate([
    //   { $match: { _id: new mongoose.Types.ObjectId(id) } },
    //   { $unwind: "$bids" },
    //   { $sort: { "bids.price": -1 } },
    //   { $group: { _id: "$_id", bids: { $push: "$bids" } } },
    // ]);

    if (!product) {
      throw ApiError.badRequest("Product does not exist");
    }

    return product;
    // return test[0];
  }

  async search(text) {
    const products = await Product.find({
      name: { $regex: new RegExp(text, "i") },
    }).limit(3);

    return products;
  }

  async startBidding(id) {
    const product = await Product.findOneAndUpdate(
      { _id: id },
      {
        isBidding: true,
        bids: [],
        bidStart: Date.now(),
      }
    );
    return product;
  }

  async stopBidding(id) {
    const product = await Product.findOneAndUpdate(
      { _id: id },
      {
        isBidding: false,
        bidEnd: Date.now(),
      }
    );
    return product;
  }
}

module.exports = new ProductService();
