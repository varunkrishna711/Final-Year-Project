const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔥 ${socket.id} user just connected!`);

    //#region Bid Socket handler
    socket.on("createProdBidRoom", (prod_id) => {
      console.log("createRoom request", prod_id);
      socket.join(prod_id);
    });

    socket.on("bid", (data) => {
      console.log("new bid created");
      io.in(data.productId).emit("updatedBid", data.price);
      io.in(data.productId).emit("updatedBidAdmin", data);
    });

    socket.on("startBid", (id) => {
      io.in(id).emit("startBid");
    });

    socket.on("stopBid", (id) => {
      io.in(id).emit("stopBid");
    });

    socket.on("time-msg", (time) => {
      console.log(time);
    });
    //#endregion

    //#region Chat Socket handler
    socket.on("createChatRoom", (id) => {
      console.log("createChatRoom request", id);
      socket.join(id);
    });

    socket.on("message", ({ data, roomId }) => {
      console.log("new message");
      io.in(roomId).emit("newMessage", data);
    });

    socket.on("unread", (id) => {
      console.log("unread");
      io.in(id).emit("setRead");
    });

    //#endregion

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`🔥: ${socket.id} user disconnected`);
    });
  });
};

module.exports = socketHandler;
