const { VendorRequirement } = require("../db/models/models");
const mongoose = require("mongoose");

class RequestService {
  async create(payload) {
    return await VendorRequirement.create(payload);
  }

  async get(id) {
    return await VendorRequirement.find({ vendorId: id });
  }
}

module.exports = new RequestService();
