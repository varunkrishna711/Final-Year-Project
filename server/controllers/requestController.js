const { User } = require("../db/models/models");
const ApiError = require("../error/ApiError");
const RequestService = require("../services/request-service");

class RequestController {
  async create(req, res, next) {
    try {
      const createdRequest = await RequestService.create(req.body);
      return res.json(createdRequest);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  // async getAll(req, res, next) {
  //   let { limit } = req.params;

  //   if (!limit) {
  //     return next(ApiError.internal("Limit Id cannot be null"));
  //   }

  //   try {
  //     const reviews = await ReviewService.getAll(limit);
  //     return res.json(reviews);
  //   } catch (error) {
  //     return next(error);
  //   }
  // }
}

module.exports = new RequestController();
