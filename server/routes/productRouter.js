const Router = require("express");
const productController = require("../controllers/productController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

const router = new Router();

router.post("/", checkRoleMiddleware, productController.create);
router.put("/", checkRoleMiddleware, productController.update);
router.put(
  "/start_bidding",
  checkRoleMiddleware,
  productController.startBidding
);
router.put("/stop_bidding", checkRoleMiddleware, productController.stopBidding);
router.put("/bid", productController.bid);
router.get("/all", productController.getAll);
router.get("/all-admin", checkRoleMiddleware, productController.getAllAdmin);
router.get("/product/:id", productController.getOne);
router.get("/totalcount", productController.getTotalCount);
router.delete("/:id", checkRoleMiddleware, productController.delete);

module.exports = router;
