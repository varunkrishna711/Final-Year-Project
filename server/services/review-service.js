// const {Review, Product, User} = require('../db/models/models');
// const { Op } = require("sequelize");

// class ReviewService {
//   async create(userId, productId, name, rate, review) {
//     const createdReview = await Review.create(
//       {userId, productId, name, rate, review}
//     );

//     const rateSum = await Review.sum('rate', {where: {productId}})
//     const reviewCount = await Review.count({where: {productId}})
//     const newRating = Math.round(rateSum / reviewCount)

//     await Product.update(
//       {rating: newRating},
//       {where: {id: productId}}
//     )
//     const reviewWithUser = await Review.findOne({
//       where: {id: createdReview.id},
//       include: [{model: User}]
//     })
//     return reviewWithUser
//   }

//   async getProductReviews(productId) {
//     const reviews = await Review.findAll({
//       where: {productId},
//       include: [{model: User}]
//     })
//     return reviews
//   }

//   async getAll(limit) {
//     const reviews = await Review.findAll({
//       order: [['createdAt', 'DESC']],
//       include: [{model: User}],
//       limit: limit
//     })
//     return reviews
//   }

// }

// module.exports = new ReviewService();

const { Review, Product, User } = require("../db/models/models");
const mongoose = require("mongoose");

class ReviewService {
  async create(userId, productId, name, rate, review) {
    const createdReview = await Review.create({
      userId,
      productId,
      name,
      rate,
      review,
    });

    const [rateSum, reviewCount] = await Promise.all([
      Review.aggregate([
        { $match: { productId: mongoose.Types.ObjectId(productId) } },
        { $group: { _id: null, sum: { $sum: "$rate" }, count: { $sum: 1 } } },
      ]),
      Review.countDocuments({ productId }),
    ]);

    const newRating = Math.round(rateSum.sum / reviewCount.count);

    await Product.findByIdAndUpdate(productId, { rating: newRating });

    const reviewWithUser = await Review.findById(createdReview._id).populate(
      "user"
    );
    return reviewWithUser;
  }

  async getProductReviews(productId) {
    const reviews = await Review.find({ productId }).populate("user");
    return reviews;
  }

  async getAll(limit) {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user");
    return reviews;
  }
}

module.exports = new ReviewService();
