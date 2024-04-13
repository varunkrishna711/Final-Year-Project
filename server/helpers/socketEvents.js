const socketEvents = (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createRoom", createRoomEvenHandler);
  socket.on("message", messageEventHandler);
  socket.on("accept", acceptEventHandler);
  socket.on("disconnect", disconnectEventHandler);
};

const createRoomEvenHandler = (roomName) => {
  console.log("createRoom request", roomName);
  socket.join(roomName);
  const newMessage = {
    text: "Hey",
  };
};

const messageEventHandler = async (data) => {
  console.log("message", data);
  const { room_id, newMessage } = data;
  socket.to(room_id).emit("newMessage", newMessage);
  try {
    // Find the chat room corresponding to the room_id
    let chat = await Chat.findById(room_id);

    // If the chat room doesn't exist, you may handle this case based on your application logic.
    if (!chat) {
      console.log("Chat room not found");
      return;
    }

    // Append the new message to the messages array
    chat.messages.push(newMessage);

    // Save the updated chat room
    await chat.save();

    console.log("Message saved in chat room:", newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

const acceptEventHandler = async (data) => {
  console.log("accept", data);
  const { room_id, BidData } = data; //pass workerId and userId also from frontend through BidData
  // socket.to(room_id).emit("accepted", BidData)
  try {
    console.log("New Bid Created", BidData);

    let bid = await Bid.findOne({
      userId: BidData.userId,
      workerId: BidData.workerId,
      approval: 0,
    });
    console.log("bid", bid);
    //if cancelled set approval -1
    //if request created approval 1
    // If a bid doesn't exist, create a new one
    if (!bid) {
      bid = new Bid(BidData);
      await bid.save();
      console.log("bid", bid);
      socket.to(room_id).emit("accepted", bid);
    }
    socketIO.to(room_id).emit("accepted", bid);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

const disconnectEventHandler = () => {
  socket.disconnect();
  console.log("🔥: A user disconnected");
};
module.exports = socketEvents;
