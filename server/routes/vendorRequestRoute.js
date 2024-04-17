const Router = require("express");
const requestController = require("../controllers/requestController");

const router = new Router();

router.post("/", requestController.create);
router.get("/:producerId", requestController.getAll);
router.get("/vendor-id/:vendorId", requestController.get);
router.get("/request-id/:id", requestController.getRequest);
router.put("/request-id/:id", requestController.updateRequest);

module.exports = router;
