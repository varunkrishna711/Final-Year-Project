const { default: mongoose } = require("mongoose");
const { Chat, User } = require("../db/models/models");

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

    const messagesWithDirection = messages.map((message) => {
      if (message.from === from && message.to === to) {
        return { ...message, isSend: true };
      } else {
        return { ...message, isSend: false };
      }
    });

    return messagesWithDirection;
  }
}

module.exports = new ChatService();
