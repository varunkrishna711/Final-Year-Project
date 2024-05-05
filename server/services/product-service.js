// const ApiError = require('../error/ApiError');
// const {Product, Category, ProductCategory, Review} = require('../db/models/models');
// const { Op } = require("sequelize");

// class ProductService {
//   async create(
//     categoriesId,
//     name,
//     price,
//     rating,
//     sizes,
//     effects,
//     relieve,
//     ingridients,
//     description,
//     shortDescription,
//     images,
//     instock ) {
//     const product = await Product.create({
//       name, price, rating, sizes, effects, relieve, ingridients, description, shortDescription, images, instock
//     })

//     categoriesId.forEach(categoryId => {
//       product.addCategory(categoryId)
//     })

//     return product
//   }

//   async update(
//     id,
//     categoriesId,
//     name,
//     price,
//     rating,
//     sizes,
//     effects,
//     relieve,
//     ingridients,
//     description,
//     shortDescription,
//     images,
//     instock ) {

//     const product = await Product.findByPk(id);

//     if (!product) {
//       throw ApiError.internal('Product not found')
//     }

//     await product.update(
//       {
//         name, price, rating, sizes, effects, relieve, ingridients, description, shortDescription, images, instock
//       },
//       { where: {id} }
//     );

//     return product.setCategories(categoriesId);
//   }

//   async getAll(categoryId, limit, offset, minPrice, maxPrice, rate, sortBy, inStock) {
//     let products;

//     if (categoryId) {
//       const productCategoryArray = await ProductCategory.findAll({where: {categoryId}})
//       let productsIdArray;

//       switch (sortBy) {
//         case 'default':
//           productsIdArray = [];
//           productCategoryArray.map(item => productsIdArray.push(item.productId))

//           if (inStock === 'all') {
//             products = await Product.findAndCountAll(
//               {
//                 order: [['createdAt', 'DESC']],
//                 include: [
//                   {model: Category, as: 'categories'},
//                   {model: Review, as: 'reviews'}
//                 ],
//                 distinct: true,
//                 where: {
//                   [Op.and]: [
//                     {id: productsIdArray},
//                     {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                     {rating: {[Op.or]: rate}},
//                   ]
//                 }, limit, offset
//               })
//           } else {
//             products = await Product.findAndCountAll(
//               {
//                 order: [['createdAt', 'DESC']],
//                 include: [
//                   {model: Category, as: 'categories'},
//                   {model: Review, as: 'reviews'}
//                 ],
//                 distinct: true,
//                 where: {
//                   [Op.and]: [
//                     {id: productsIdArray},
//                     {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                     {rating: {[Op.or]: rate}},
//                     {instock: inStock}
//                   ]
//                 }, limit, offset
//               })
//           }

//           break;

//         case 'newest':
//           productsIdArray = [];
//           productCategoryArray.map(item => productsIdArray.push(item.productId))
//           products = await Product.findAndCountAll(
//             {
//               order: [['createdAt', 'DESC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {id: productsIdArray},
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;

//         case 'rating':
//           productsIdArray = [];
//           productCategoryArray.map(item => productsIdArray.push(item.productId))
//           products = await Product.findAndCountAll(
//             {
//               order: [['rating', 'DESC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {id: productsIdArray},
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;

//         case 'pricelow':
//           productsIdArray = [];
//           productCategoryArray.map(item => productsIdArray.push(item.productId))
//           products = await Product.findAndCountAll(
//             {
//               order: [['price', 'ASC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {id: productsIdArray},
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;

//         case 'pricehigh':
//           productsIdArray = [];
//           productCategoryArray.map(item => productsIdArray.push(item.productId))
//           products = await Product.findAndCountAll(
//             {
//               order: [['price', 'DESC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {id: productsIdArray},
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;
//       }
//       // if (products.count === 0) {
//       //   throw ApiError.badRequest('Something went wrong')
//       // }
//       return products
//     }

//     if (!categoryId) {
//       switch (sortBy) {
//         case 'default':
//           if (inStock === 'all') {
//             products = await Product.findAndCountAll(
//               {
//                 order: [['createdAt', 'DESC']],
//                 include: [
//                   {model: Category, as: 'categories'},
//                   {model: Review, as: 'reviews'}
//                 ],
//                 distinct: true,
//                 where: {
//                   [Op.and]: [
//                     {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                     {rating: {[Op.or]: rate}},
//                   ]
//                 }, limit, offset
//               })
//           } else {
//             products = await Product.findAndCountAll(
//               {
//                 order: [['createdAt', 'DESC']],
//                 include: [
//                   {model: Category, as: 'categories'},
//                   {model: Review, as: 'reviews'}
//                 ],
//                 distinct: true,
//                 where: {
//                   [Op.and]: [
//                     {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                     {rating: {[Op.or]: rate}},
//                     {instock: inStock}
//                   ]
//                 }, limit, offset
//               })
//           }

//           break;

//         case 'newest':
//           products = await Product.findAndCountAll(
//             {
//               order: [['createdAt', 'DESC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;

//         case 'rating':
//           products = await Product.findAndCountAll(
//             {
//               order: [['rating', 'DESC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;

//         case 'pricelow':
//           products = await Product.findAndCountAll(
//             {
//               order: [['price', 'ASC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;

//         case 'pricehigh':
//           products = await Product.findAndCountAll(
//             {
//               order: [['price', 'DESC']],
//               include: [
//                 {model: Category, as: 'categories'},
//                 {model: Review, as: 'reviews'}
//               ],
//               distinct: true,
//               where: {
//                 [Op.and]: [
//                   {price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}},
//                   {rating: {[Op.or]: rate}}
//                 ]
//               }, limit, offset
//           })

//           break;
//       }
//       // if (products.count === 0) {
//       //   throw ApiError.badRequest('Something went wrong')
//       // }
//       return products
//     }
//   }

//   async getAllAdmin(categoryId, name, limit, offset, minPrice, maxPrice, inStock) {

//     let parametersArray = [];

//     if (categoryId) {
//       const productCategoryArray = await ProductCategory.findAll({where: {categoryId}})
//       let productsIdArray = [];
//       productCategoryArray.map(item => productsIdArray.push(item.productId))
//       parametersArray.push({id: productsIdArray})
//     }

//     if (name) {
//       parametersArray.push({name: {[Op.like]: `%${name}%`}})
//     }

//     if (maxPrice & minPrice) {
//       parametersArray.push({price: {[Op.lt]: maxPrice, [Op.gt]: minPrice}})
//     }

//     if (inStock !== 'all') {
//       parametersArray.push({instock: inStock})
//     }

//     const products = await Product.findAndCountAll(
//       {
//         order: [['id', 'DESC']],
//         include: [
//           {model: Category, as: 'categories'},
//         ],
//         distinct: true,
//         where: {
//           [Op.and]: parametersArray
//         }, limit, offset
//       }
//     );
//     return products
//   }

//   async getOne(id) {
//     const product = await Product.findOne({
//       where: {id},
//       include: [{
//         model: Category,
//         as: 'categories'
//       }]
//     })

//     if (!product) {
//       throw ApiError.badRequest('Product is not exists')
//     }

//     return product
//   }

//   async search(text) {
//     const products = await Product.findAll({
//       where: {
//         name: {[Op.like]: `%${text}%`}
//       },
//       limit: 3
//     })
//     return products
//   }
// }

// module.exports = new ProductService();

const ApiError = require("../error/ApiError");
const {
  Product,
  Category,
  ProductCategory,
  Review,
  User,
} = require("../db/models/models");
const mongoose = require("mongoose");

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
