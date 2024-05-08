const chatSocketHandler = (io) => {
  io.of("/chat-socket").on("connection", (socket) => {
    console.log(`🔥 ${socket.id} user just connected!`);

    socket.on("createProdChatRoom", (id) => {
      console.log("Chat room request", id);
      socket.join(id);
    });
  });
};

module.exports = chatSocketHandler;
