const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔥 ${socket.id} user just connected!`);

    socket.on("createProdBidRoom", (prod_id) => {
      console.log("createRoom request", prod_id);
      socket.join(prod_id);
    });

    socket.on("bid", (data) => {
      console.log("new bid created");
      io.in(data.productId).emit("updatedBid", data.price);
    });

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`🔥: ${socket.id} user disconnected`);
    });

    socket.on("time-msg", (time) => {
      console.log(time);
    });
  });
};

module.exports = socketHandler;
