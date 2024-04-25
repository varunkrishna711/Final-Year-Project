const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  image: { type: String },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  location: { type: [Number] },
});

const addressSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  country: { type: String, required: true },
  addressLineOne: { type: String, required: true },
  addressLineTwo: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});

const cartProductSchema = new mongoose.Schema({
  count: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  cartId: { type: mongoose.Schema.Types.ObjectId },
});

const cartSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartProduct",
    },
  ],
  subTotal: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const bidSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.ObjectId },
  email: { type: String },
  selectedSize: { type: String },
  count: { type: Number },
  price: { type: Number },
});

const productSchema = new mongoose.Schema({
  images: [String],
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 5 },
  sizes: [String],
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  instock: { type: Boolean, default: true },
  categoriesId: [{ type: Number }],
  userId: { type: mongoose.Schema.Types.ObjectId },
  isBidding: { type: Boolean },
  bidStart: { type: Date },
  bidEnd: { type: Date },
  bids: [bidSchema],
});

const categorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const ratingSchema = new mongoose.Schema({
  rate: { type: Number, required: true },
});

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    review: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  addressLineOne: { type: String, required: true },
  addressLineTwo: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String },
  notes: { type: String },
  shippingCost: { type: Number, default: 50, required: true },
  total: { type: Number, required: true },
});

const orderedProductSchema = new mongoose.Schema({
  count: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const promoCodeSchema = new mongoose.Schema({
  promocode: { type: String, required: true },
  percentDiscount: { type: Number, required: true },
  expirationDate: { type: Date },
});

const usedPromoSchema = new mongoose.Schema({
  // Add any fields you need
});

const productCategory = new mongoose.Schema({
  // fields
  categoryId: { type: Number },
  productId: { type: mongoose.Schema.Types.ObjectId },
});

const vendorRequirement = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendorName: { type: String },
  vendorDescirption: { type: String },
  itemRequired: { type: String },
  quantityRequired: { type: Number },
  toBeDeliveredOn: { type: Date },
  vendorLocation: { type: [Number] },
  isFullfilled: { type: Boolean, default: false },
  rejectedProducersId: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  acceptedProducerName: { type: String },
  acceptedProducerId: { type: mongoose.Schema.Types.ObjectId },
});

// Create Mongoose Models
const User = mongoose.model("User", userSchema);
const Address = mongoose.model("Address", addressSchema);
const Cart = mongoose.model("Cart", cartSchema);
const CartProduct = mongoose.model("CartProduct", cartProductSchema);
const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
const Rating = mongoose.model("Rating", ratingSchema);
const Review = mongoose.model("Review", reviewSchema);
const Order = mongoose.model("Order", orderSchema);
const OrderedProduct = mongoose.model("OrderedProduct", orderedProductSchema);
const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
const UsedPromo = mongoose.model("UsedPromo", usedPromoSchema);
const ProductCategory = mongoose.model("ProductCategory", productCategory);
const VendorRequirement = mongoose.model("UserRequirement", vendorRequirement);

module.exports = {
  User,
  Address,
  Cart,
  CartProduct,
  Product,
  Category,
  Rating,
  Review,
  ProductCategory,
  Order,
  OrderedProduct,
  PromoCode,
  UsedPromo,
  VendorRequirement,
};
