const Router = require("express");

const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");
const promoRouter = require("./promoRouter");
const searchRouter = require("./searchRouter");
const reviewRouter = require("./reviewRouter");
const vendorRequestRoute = require("./vendorRequestRoute");
const chatRouter = require("./chatRouter");

const router = new Router();

router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/promo", promoRouter);
router.use("/review", reviewRouter);
router.use("/search", searchRouter);
router.use("/product-request", vendorRequestRoute);
router.use("/chat", chatRouter);

module.exports = router;
