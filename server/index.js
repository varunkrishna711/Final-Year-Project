require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const { default: mongoose } = require("mongoose");
const bidSocketHandler = require("./helpers/bidSocketHandler");
const chatSocketHandler = require("./helpers/chatSocketHandler");
const socketHandler = require("./helpers/socketHandler");
const PORT = process.env.PORT || 8800;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// const bidIO = require("socket.io")(server);
// const chatIO = require("socket.io")(server);

// bidSocketHandler(bidIO);
// chatSocketHandler(chatIO);
socketHandler(io);
