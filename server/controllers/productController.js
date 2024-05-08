const ApiError = require("../error/ApiError");
const ProductService = require("../services/product-service");
const { Product, ProductCategory } = require("../db/models/models");
const axios = require("axios");
const chatService = require("../services/chat-service");

class ProductController {
  async create(req, res, next) {
    let {
      categoriesId,
      name,
      price,
      rating,
      sizes,
      userId,
      description,
      shortDescription,
      instock,
    } = req.body;

    if (!categoriesId) {
      return next(ApiError.internal("Categories Id cannot be null"));
    }
    if (!name) {
      return next(ApiError.internal("Name cannot be null"));
    }
    if (!price) {
      return next(ApiError.internal("Price cannot be null"));
    }
    if (!rating) {
      return next(ApiError.internal("Rating cannot be null"));
    }
    if (!sizes) {
      return next(ApiError.internal("Sizes cannot be null"));
    }
    if (!userId) {
      return next(ApiError.internal("UserId cannot be null"));
    }
    if (!description) {
      return next(ApiError.internal("Description cannot be null"));
    }
    if (!shortDescription) {
      return next(ApiError.internal("Short description cannot be null"));
    }

    let imagesArray;
    if (req.files) {
      let { imageGallery } = req.files;
      imagesArray = imageGallery;
    } else {
      return next(ApiError.internal("Images cannot be null"));
    }

    if (!Array.isArray(imagesArray)) {
      imagesArray = [imagesArray];
    }

    let images = [];
    let allowedExtensions = ["jpg", "png", "jpeg"];

    for (let i = 0; i < imagesArray.length; i++) {
      let img = imagesArray[i];

      let fileNameParts = img.name.split(".");
      let fileExt = fileNameParts[fileNameParts.length - 1];

      if (!allowedExtensions.includes(fileExt)) {
        return next(ApiError.internal("Allowed extensions: JPG, JPEG, PNG"));
      }

      let imgBuffer = img.data;
      let imgBase64 = imgBuffer.toString("base64");

      let res = await axios.post(
        process.env.IMAGE_API_UPLOAD_URL,
        { image: imgBase64 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.IMAGE_HOSTING_API_KEY}`,
          },
        }
      );

      if (res.data.status !== 200) {
        return next(ApiError.internal(data.error.message));
      }

      let imageurl = res.data.data.link;
      images.push(imageurl);
    }

    sizes = sizes.split(",");
    // effects = effects.split(",");
    // relieve = relieve.split(",");
    // ingridients = ingridients.split(",");
    categoriesId = categoriesId.split(",");
    categoriesId = categoriesId.map((id) => parseInt(id));
    price = parseInt(price);
    instock = instock || true;

    try {
      const product = await ProductService.create(
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
      );
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    let {
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
      instock,
    } = req.body;

    if (!id) {
      return next(ApiError.internal("Id cannot be null"));
    }
    if (!categoriesId) {
      return next(ApiError.internal("Categories Id cannot be null"));
    }
    if (!name) {
      return next(ApiError.internal("Name cannot be null"));
    }
    if (!price) {
      return next(ApiError.internal("Price cannot be null"));
    }
    if (!rating) {
      return next(ApiError.internal("Rating cannot be null"));
    }
    if (!sizes) {
      return next(ApiError.internal("Sizes cannot be null"));
    }
    // if (!effects) {
    //   return next(ApiError.internal("Effects cannot be null"));
    // }
    // if (!relieve) {
    //   return next(ApiError.internal("Relieve cannot be null"));
    // }
    // if (!ingridients) {
    //   return next(ApiError.internal("Ingridients cannot be null"));
    // }
    if (!description) {
      return next(ApiError.internal("Description cannot be null"));
    }
    if (!shortDescription) {
      return next(ApiError.internal("Short description cannot be null"));
    }

    let imagesArray;
    if (req.files) {
      let { imageGallery } = req.files;
      imagesArray = imageGallery;
    } else {
      return next(ApiError.internal("Images cannot be null"));
    }

    if (!Array.isArray(imagesArray)) {
      imagesArray = [imagesArray];
    }

    let images = [];
    let allowedExtensions = ["jpg", "png", "jpeg"];

    for (let i = 0; i < imagesArray.length; i++) {
      let img = imagesArray[i];

      let fileNameParts = img.name.split(".");
      let fileExt = fileNameParts[fileNameParts.length - 1];

      if (!allowedExtensions.includes(fileExt)) {
        return next(ApiError.internal("Allowed extensions: JPG, JPEG, PNG"));
      }

      let imgBuffer = img.data;
      let imgBase64 = imgBuffer.toString("base64");

      let res = await axios.post(
        process.env.IMAGE_API_UPLOAD_URL,
        { image: imgBase64 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.IMAGE_HOSTING_API_KEY}`,
          },
        }
      );

      if (res.data.status !== 200) {
        return next(ApiError.internal(data.error.message));
      }

      let imageurl = res.data.data.link;
      images.push(imageurl);
    }

    sizes = sizes.split(",");
    // effects = effects.split(",");
    // relieve = relieve.split(",");
    // ingridients = ingridients.split(",");
    categoriesId = categoriesId.split(",");
    categoriesId = categoriesId.map((id) => parseInt(id));
    price = parseInt(price);
    instock = instock || true;

    try {
      const product = await ProductService.update(
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
      );
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    let { categoryId, page, limit, minPrice, maxPrice, rate, sortBy, inStock } =
      req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    minPrice = parseInt(minPrice) || 0;
    maxPrice = parseInt(maxPrice) || 1000;
    rate = rate || [1, 2, 3, 4, 5];
    sortBy = sortBy || "default";
    inStock = inStock !== null && inStock !== undefined ? inStock : "all";
    let offset = page * limit - limit;

    try {
      const products = await ProductService.getAll(
        categoryId,
        limit,
        offset,
        minPrice,
        maxPrice,
        rate,
        sortBy,
        inStock
      );
      return res.json(products);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  async getAllByProducerId(req, res, next) {
    let { producer_id } = req.params;
    try {
      const products = await ProductService.getAllByProducerId(producer_id);
      return res.json(products);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  async getAllAdmin(req, res, next) {
    let { categoryId, name, page, limit, minPrice, maxPrice, inStock } =
      req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    minPrice = parseInt(minPrice) || 0;
    maxPrice = parseInt(maxPrice) || 1000;
    inStock = inStock !== null && inStock !== undefined ? inStock : "all";
    let offset = page * limit - limit;

    try {
      const products = await ProductService.getAllAdmin(
        categoryId,
        name,
        limit,
        offset,
        minPrice,
        maxPrice,
        inStock
      );
      return res.json(products);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;

    if (!id) {
      return next(ApiError.internal("Id cannot be null"));
    }

    try {
      const product = await ProductService.getOne(id);
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }

  async startBidding(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(ApiError.internal("Id cannot be null"));
    }

    try {
      const product = await ProductService.startBidding(id);
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }

  async stopBidding(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(ApiError.internal("Id cannot be null"));
    }

    try {
      const product = await ProductService.stopBidding(id);
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }

  async search(req, res, next) {
    const { text } = req.params;

    if (!text) {
      return next(ApiError.internal("Search text cannot be null"));
    }

    try {
      const products = await ProductService.search(text);
      return res.json(products);
    } catch (error) {
      return next(error);
    }
  }

  async getTotalCount(req, res, next) {
    try {
      const products = await Product.countDocuments();
      return res.json(products);
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    if (!id) {
      return next(ApiError.internal("Product id cannot be null"));
    }

    try {
      const product = await Product.findByIdAndDelete(id);
      await ProductCategory.deleteMany({ productId: id });
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }
  async bid(req, res, next) {
    const {
      price,
      productId,
      selectedCount,
      userId,
      email,
      count,
      isAccepted,
    } = req.body;

    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        {
          $push: {
            bids: {
              price,
              selectedCount,
              vendorId: userId,
              email,
              count,
              isAccepted,
            },
          },
        }
      );
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }

  async acceptBid(req, res, next) {
    const bidId = req.params.id;
    try {
      const product = await Product.findOneAndUpdate(
        { "bids._id": bidId },
        { $set: { "bids.$.isAccepted": true } },
        { new: true } // Return the modified document
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const updatedBid = product.bids.find(
        (bid) => bid._id.toString() === bidId && bid.isAccepted === true
      );
      if (!updatedBid) {
        return res.status(404).json({ error: "Updated bid not found" });
      }
      const messageData = {
        from: product.userId,
        type: "BID",
        to: updatedBid.vendorId,
        message: {
          bid: {
            _id: updatedBid._id,
            product: product._id,
            count: updatedBid.count,
            price: updatedBid.price,
          },
        },
      };
      await chatService.create(messageData);
      return res.json(updatedBid);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new ProductController();
