const { VendorRequirement, User } = require("../db/models/models");
const calculateDistance = require("../helpers/calculateDistance");
const chatService = require("./chat-service");
const userService = require("./user-service");

class RequestService {
  async create(payload) {
    const res = await VendorRequirement.create(payload);
    const nearByProducers = await userService.getProducersNearby(
      payload.vendorLocation[0],
      payload.vendorLocation[1]
    );
    const messageData = {
      from: payload.vendor,
      type: "REQUEST",
      message: {
        request: {
          _id: res._id,
          itemRequired: payload.itemRequired,
          toBeDeliveredOn: payload.toBeDeliveredOn,
          quantityRequired: payload.quantityRequired,
        },
      },
    };

    var messagePayload = nearByProducers.map((n) => ({
      ...messageData,
      to: n._id,
    }));

    await chatService.create(messagePayload);
    return res;
  }

  async get(id) {
    return await VendorRequirement.find({ vendor: id });
  }

  async getRequest(id) {
    return await VendorRequirement.findOne({ _id: id }).populate("vendor");
  }

  async updateRequest(id, acceptedProducerId, acceptedProducerName) {
    try {
      // Find the request by its ID
      const response = await VendorRequirement.findOneAndUpdate(
        { _id: id },
        { isFullfilled: true, acceptedProducerId, acceptedProducerName }
      );

      // Check if the request was found
      // if (!request) {
      //   throw new Error("Request not found");
      // }

      // Set isFullfilled to true
      // request.isFullfilled = true;
      // request.acceptedProducerId = req.body.acceptedProducerId;
      // request.acceptedProducerName = req.body.acceptedProducerName;

      // Save the updated request
      // await request.save();

      // Return the updated request
      return response;
    } catch (error) {
      // Handle errors (e.g., request not found, database errors)
      console.error("Error updating the request:", error);
      throw error; // Rethrow the error to handle it further up the call stack
    }
  }

  async getAll(producerId) {
    const producer = await User.findOne({ _id: producerId });
    if (!producer || !producer.location) {
      throw new Error("Producer location not found");
    }

    const requests = await VendorRequirement.find().populate("vendor");
    // Filter requests where vendorLocation exists and is within 10 kilometers of the producer's location
    const filteredRequests = requests.filter((request) => {
      return (
        request.vendorLocation &&
        calculateDistance(
          producer.location[0],
          producer.location[1],
          request.vendorLocation[0],
          request.vendorLocation[1]
        ) <= 10
      );
    });

    return filteredRequests;
  }
}

module.exports = new RequestService();
