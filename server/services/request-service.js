const { VendorRequirement } = require("../db/models/models");
const mongoose = require("mongoose");

class RequestService {
  async create(payload) {
    return await VendorRequirement.create(payload);
  }

  //   async getAll(limit) {
  //     const requests = await VendorRequirement.find()
  //       .sort({ createdAt: -1 })
  //       .limit(limit);
  //     return requests;
  //   }
}

module.exports = new RequestService();
