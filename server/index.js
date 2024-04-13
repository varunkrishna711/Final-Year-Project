require("dotenv").config();
const express = require("express");
const sequelize = require("./db/db");
const models = require("./db/models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const path = require("path");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");
const { default: mongoose } = require("mongoose");
const socketEvents = require("./helpers/socketEvents");
const PORT = process.env.PORT || 8800;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setInterval(() => {
  io.sockets.emit("time-msg", { time: new Date().toISOString() });
}, 1000);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

app.get("/", async (req, res) => {
  res.send({ msg: "running" });
});

const server = app.listen(PORT || 8800, () => {
  console.log("Backend server started on port " + process.env.PORT);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log(`🔥 ${socket.id} user just connected!`);

  socket.on("createProdBidRoom", (prod_id) => {
    console.log("createRoom request", prod_id);
    socket.join(prod_id);
  });

  socket.on("bid", (room_id) => {
    console.log("new bid created");
    socket.to(room_id).emit("updatedBid", { message: "New Bid" });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`🔥: ${socket.id} user disconnected`);
  });

  socket.on("time-msg", (time) => {
    console.log(time);
  });
});
