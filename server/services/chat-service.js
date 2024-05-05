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

  async getChatList(id) {
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

module.exports = new ChatService();
