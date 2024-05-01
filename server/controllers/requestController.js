const { User } = require("../db/models/models");
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

  async getAll(req, res, next) {
    try {
      const producerId = req.params.producerId;
      const requestHistory = await RequestService.getAll(producerId);
      return res.json(requestHistory);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getRequest(req, res, next) {
    try {
      const requestId = req.params.id;
      const request = await RequestService.getRequest(requestId);
      return res.json(request);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async updateRequest(req, res, next) {
    try {
      const requestId = req.params.id;
      const updatedRequest = await RequestService.updateRequest(requestId);

      return res.json(updatedRequest);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

module.exports = new RequestController();
