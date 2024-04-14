const { VendorRequirement, User } = require("../db/models/models");

// Utility function to calculate the distance between two points given in [longitude, latitude]
function calculateDistance(coords1, coords2) {
  const R = 6371e3; // Earth's radius in meters
  const [lon1, lat1] = coords1.map((coord) => (coord * Math.PI) / 180);
  const [lon2, lat2] = coords2.map((coord) => (coord * Math.PI) / 180);
  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

class RequestService {
  async create(payload) {
    return await VendorRequirement.create(payload);
  }

  async get(id) {
    return await VendorRequirement.find({ vendorId: id });
  }

  async getRequest(id) {
    return await VendorRequirement.findOne({ _id: id });
  }

  async updateRequest(id) {
    try {
      // Find the request by its ID
      const request = await VendorRequirement.findOne({ _id: id });

      // Check if the request was found
      if (!request) {
        throw new Error("Request not found");
      }

      // Set isFullfilled to true
      request.isFullfilled = true;

      // Save the updated request
      await request.save();

      // Return the updated request
      return request;
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

    const requests = await VendorRequirement.find({});
    // Filter requests where vendorLocation exists and is within 10 kilometers of the producer's location
    const filteredRequests = requests.filter((request) => {
      return (
        request.vendorLocation &&
        calculateDistance(producer.location, request.vendorLocation) <= 100000
      );
    });

    return filteredRequests;
  }
}

module.exports = new RequestService();
