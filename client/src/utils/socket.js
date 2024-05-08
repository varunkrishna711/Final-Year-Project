// import { io } from "socket.io-client";

// const bidSocket = io(`${process.env.REACT_APP_API_URL}/bid-socket`, {
//   transports: ["websocket"],
// });
// console.log(bidSocket);

// const chatSocket = io(`${process.env.REACT_APP_API_URL}/chat-socket`, {
//   transports: ["websocket"],
// });
// console.log(chatSocket);

// export { chatSocket, bidSocket };

import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_API_URL}`, {
  transports: ["websocket"],
});
console.log(socket);
export default socket;
