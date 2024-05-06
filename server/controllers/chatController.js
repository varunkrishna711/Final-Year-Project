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
      const userId = req.params.id;
      const { lat, lgt } = req.query;
      const isAdmin = req.query.isAdmin === "true";
      const historyChatList = await ChatService.getChatList(userId);
      const locationChatList = await getChatListFromLocation(isAdmin, lat, lgt);
      const chatList = ToChatList(historyChatList, locationChatList, isAdmin);
      return res.json(chatList);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await ChatService.delete(req.params.id1, req.params.id2);
      return res.json(result);
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

const getChatListFromLocation = async (isAdmin, lat, lgt) => {
  try {
    let nearByUsers;
    if (isAdmin) nearByUsers = await UserService.getVendorsNearby(lat, lgt);
    else nearByUsers = await UserService.getProducersNearby(lat, lgt);
    const chatList = NearByUsersToChatList(nearByUsers, isAdmin);
    return chatList;
  } catch (error) {
    console.log(error);
  }
};

const ToChatList = (historyChatList, locationChatList, isAdmin) => {
  let historyIds = new Set([
    ...historyChatList.sent.map((s) => s.to._id.toString()),
    ...historyChatList.received.map((r) => r.from.toString()),
  ]);

  let chatlist = { location: [], history: [] };

  locationChatList.forEach((item) => {
    if (!historyIds.has(item.userId.toString())) chatlist.location.push(item);
  });

  historyChatList.received.forEach((item) => {
    if (historyIds.has(item.from.toString())) {
      chatlist.history.push(
        ChatListMapper(item.fromUser, item.countUnread, isAdmin, item.createdAt)
      );
      historyIds.delete(item.from.toString());
    }
  });

  historyChatList.sent.forEach((item) => {
    if (historyIds.has(item.to._id.toString())) {
      chatlist.history.push(
        ChatListMapper(item.to, 0, isAdmin, item.createdAt)
      );
      historyIds.delete(item.to._id.toString());
    }
  });

  return chatlist;
};

const ChatListMapper = (user, countUnread, isAdmin, createdAt) => ({
  userId: user._id,
  avatar:
    user.image ??
    `https://api.dicebear.com/5.x/avataaars/svg?seed=${user.firstname}`,
  alt: user.firstname,
  title: user.firstname + " " + user.lastname,
  subtitle: isAdmin
    ? "Sell products, accept bids & more!"
    : "Buy products, send requests & more!",
  date: new Date(createdAt),
  unread: countUnread,
});

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
    date: null,
    unread: 0,
  }));

module.exports = new ChatController();
