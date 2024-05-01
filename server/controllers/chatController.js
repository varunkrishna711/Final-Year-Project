const ApiError = require("../error/ApiError");
const ChatService = require("../services/chat-service");
const UserService = require("../services/user-service");

class ChatController {
  async postMessage(req, res, next) {
    try {
      const createdRequest = await ChatService.create({
        ...req.body,
        time: new Date(),
      });
      return res.json(createdRequest);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getChatList(req, res, next) {
    try {
      const chats = await ChatService.getChatList(req.params.id);
      const chatList = ToChatList(chats);
      return res.json(chatList);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getChatListFromLocation(req, res, next) {
    if (req.params.lat == "null" || req.params.lgt == "null") {
      return next(ApiError.badRequest("location cannot be null"));
    }

    try {
      let nearByUsers;
      if (req.query.isAdmin)
        nearByUsers = await UserService.getVendorsNearby(
          req.params.lat,
          req.params.lgt
        );
      else
        nearByUsers = await UserService.getProducersNearby(
          req.params.lat,
          req.params.lgt
        );
      const chatList = NearByUsersToChatList(nearByUsers, req.query.isAdmin);
      return res.json(chatList);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getChats(req, res, next) {
    if (req.params.from == "null") {
      return next(ApiError.badRequest("From id cannot be null"));
    }
    if (req.params.from == "null") {
      return next(ApiError.badRequest("To id cannot be null"));
    }

    try {
      const chats = await ChatService.getChats(req.params);
      return res.json(chats);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async markAsRead(req, res, next) {
    try {
      await ChatService.markAsRead(req.params.id);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

const ToChatList = (chats) => {};
const NearByUsersToChatList = (user, isAdmin) =>
  user.map((p) => ({
    userId: p._id,
    avatar:
      p.image ??
      `https://api.dicebear.com/5.x/avataaars/svg?seed=${p.firstname}`,
    alt: p.firstname,
    title: p.firstname + " " + p.lastname,
    subtitle: isAdmin
      ? "Sell products, accept bids & more!"
      : "Buy products, send requests & more!",
    date: new Date(),
    unread: 0,
  }));

module.exports = new ChatController();
