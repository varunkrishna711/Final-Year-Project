const ApiError = require("../error/ApiError");
const { Category, Product, ProductCategory } = require("../db/models/models"); // Assuming these are now Mongoose models

class CategoryController {
  async create(req, res, next) {
    let { name, description } = req.body;

    if (!name) {
      return next(ApiError.internal("Name cannot be null"));
    }

    if (!description) {
      return next(ApiError.internal("Description cannot be null"));
    }

    try {
      const category = await Category.create({ name, description });
      return res.json(category);
    } catch (error) {
      return next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      let categories = await Category.find({}).sort({ id: "asc" }).exec();
      const productCategories = await ProductCategory.find({}).exec();
      categories = categories.map((c) => {
        productCategories.map((pc) => {
          pc.categoryId == c.id && c.products.push(pc.productId);
        });
        return c;
      });

      return res.json(categories);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getAllAdmin(req, res, next) {
    let { limit, page } = req.query;

    limit = limit || 10;
    page = page || 1;
    let skip = (page - 1) * limit;

    try {
      const categories = await Category.find({})
        .sort({ id: "desc" })
        .skip(skip)
        .limit(limit)
        .exec();

      const count = await Category.countDocuments();

      return res.json({ count, categories });
    } catch (error) {
      return next(error);
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;

    if (!id) {
      return next(ApiError.internal("Id cannot be null"));
    }

    try {
      const category = await Category.findById(id).exec();

      if (!category) {
        return next(ApiError.internal("Category doesn't exist"));
      }

      return res.json(category);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CategoryController();
