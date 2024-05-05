const { default: mongoose } = require("mongoose");
const {
  Chat,
  User,
  Product,
  VendorRequirement,
} = require("../db/models/models");

class ChatService {
  async create(payload) {
    return await Chat.create(payload);
  }

  async getAdminChatList(id) {
    const recieved = await Chat.find({ from: id }, { to: 1 })
      .sort({
        createdAt: 1,
      })
      .populate({
        path: "to",
        select: "-password",
      })
      .lean()
      .exec();
    return recieved;
  }

  async getChatList(userId) {
    const sent = await Chat.find(
      { from: userId },
      { to: 1, _id: 0, createdAt: 1 }
    )
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "to",
        select: "-password",
      })
      .lean()
      .exec();

    const toObjects = distinctToObjects(sent);

    // const received = await Chat.find({ to: userId }, { from: 1, _id: 0 })
    //   .sort({
    //     createdAt: 1,
    //   })
    //   .populate({
    //     path: "from",
    //     select: "-password",
    //   })
    //   .lean()
    //   .exec();

    const rec = await Chat.aggregate([
      { $match: { to: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "fromUser",
        },
      },
      { $unwind: "$fromUser" },
      {
        $group: {
          _id: "$fromUser._id",
          countUnread: {
            $sum: { $cond: [{ $eq: ["$isUnread", true] }, 1, 0] },
          },
          fromUser: { $first: "$fromUser" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          from: "$_id",
          countUnread: 1,
          _id: 0,
          fromUser: 1,
          createdAt: 1,
        },
      },
    ]);

    return { sent: toObjects, received: rec };
  }

  async markAsRead(id) {
    return await Chat.findOneAndUpdate({ _id: id }, { isUnread: false });
  }

  async getChats({ from, to }) {
    const messages = await Chat.find({
      $or: [
        { $and: [{ from }, { to }] },
        { $and: [{ from: to }, { to: from }] },
      ],
    })
      .populate({
        path: "from",
        select: "-password",
      })
      .populate({
        path: "to",
        select: "-password",
      })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    var populatedMessage = await Promise.all([
      ...bidMessages(messages),
      ...requestMessages(messages),
      ...textMessages(messages),
    ]);

    populatedMessage = populatedMessage.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const messagesWithDirection = populatedMessage.map((message) => {
      if (message.from === from && message.to === to) {
        return { ...message, isSend: true };
      } else {
        return { ...message, isSend: false };
      }
    });

    return messagesWithDirection;
  }
}

const bidMessages = (messages) =>
  messages
    .filter((m) => m.type === "BID")
    .map(async (message) => {
      message.message.bid.product = await Product.findOne(
        {
          _id: message.message.bid.product,
        },
        { _id: 1, images: 1, name: 1, price: 1, rating: 1, userId: 1 }
      )
        .lean()
        .exec();
      return message;
    });

const requestMessages = (messages) =>
  messages.filter((m) => m.type === "REQUEST");

const textMessages = (messages) => messages.filter((m) => m.type === "TEXT");

const distinctToObjects = (sent) => {
  const uniqueToObjects = sent.reduce((acc, { to, createdAt }) => {
    if (to && to._id && !acc[to._id.toString()]) {
      acc[to._id.toString()] = { to, createdAt };
    }
    return acc;
  }, {});

  return Object.values(uniqueToObjects);
};

module.exports = new ChatService();
