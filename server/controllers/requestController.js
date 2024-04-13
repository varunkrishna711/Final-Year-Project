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

  async get(req, res, next) {
    try {
      const requestHistory = await RequestService.get(req.params.vendorId);
      return res.json(requestHistory);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

module.exports = new RequestController();
