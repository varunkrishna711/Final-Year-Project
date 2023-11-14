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
const PORT = process.env.PORT || 8800;

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

// const start = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//   } catch (e) {
//     console.error(e);
//   }
// };

// start();

app.get("/", async (req, res) => {
  res.send({ msg: "running" });
});

app.listen(PORT || 8800, () => {
  console.log("Backend server started on port " + process.env.PORT);
});
