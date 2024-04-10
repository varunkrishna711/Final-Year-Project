const Router = require("express");
const requestController = require("../controllers/requestController");

const router = new Router();

router.post("/", requestController.create);

module.exports = router;
