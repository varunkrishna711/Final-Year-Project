// const sequelize = require('../db')
// const {DataTypes} = require('sequelize')

// const User = sequelize.define('user', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   email: {type: DataTypes.STRING, unique: true, allowNull: false},
//   password: {type: DataTypes.STRING, allowNull: false},
//   firstname: {type: DataTypes.STRING},
//   lastname: {type: DataTypes.STRING},
//   image: {type: DataTypes.STRING},
//   role: {type: DataTypes.STRING, defaultValue: "USER"},
// })

// const Address = sequelize.define('address', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   firstname: {type: DataTypes.STRING, allowNull: false},
//   lastname: {type: DataTypes.STRING, allowNull: false},
//   country: {type: DataTypes.STRING, allowNull: false},
//   addressLineOne: {type: DataTypes.STRING, allowNull: false},
//   addressLineTwo: {type: DataTypes.STRING},
//   city: {type: DataTypes.STRING, allowNull: false},
//   state: {type: DataTypes.STRING, allowNull: false},
//   zip: {type: DataTypes.STRING, allowNull: false},
// })

// const Cart = sequelize.define('cart', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   subTotal: {type: DataTypes.INTEGER, defaultValue: 0},
// })

// const CartProduct = sequelize.define('cart_product', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   count: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
//   selectedSize: {type: DataTypes.STRING, allowNull: false},
//   price: {type: DataTypes.INTEGER, allowNull: false},
//   totalPrice: {type: DataTypes.INTEGER, allowNull: false},
// })

// const Product = sequelize.define('product', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   images: {type: DataTypes.ARRAY(DataTypes.STRING)},
//   name: {type: DataTypes.STRING, allowNull: false},
//   price: {type: DataTypes.INTEGER, allowNull: false},
//   rating: {type: DataTypes.INTEGER, defaultValue: 5},
//   effects: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
//   relieve: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
//   ingridients: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
//   sizes: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
//   description: {type: DataTypes.STRING, allowNull: false},
//   shortDescription: {type: DataTypes.STRING, allowNull: false},
//   instock: {type: DataTypes.BOOLEAN, defaultValue: true}
// })

// const Category = sequelize.define('category', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   name: {type: DataTypes.STRING, unique: true, allowNull: false},
//   description: {type: DataTypes.STRING, allowNull: false}
// })

// const Rating = sequelize.define('rating', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   rate: {type: DataTypes.INTEGER, allowNull: false},
// })

// const Review = sequelize.define('review', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   name: {type: DataTypes.STRING, allowNull: false},
//   rate: {type: DataTypes.INTEGER, allowNull: false},
//   review: {type: DataTypes.STRING, allowNull: false},
// })

// const Order = sequelize.define('order', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   email: {type: DataTypes.STRING, allowNull: false},
//   firstName: {type: DataTypes.STRING, allowNull: false},
//   lastName: {type: DataTypes.STRING, allowNull: false},
//   country: {type: DataTypes.STRING, allowNull: false},
//   addressLineOne: {type: DataTypes.STRING, allowNull: false},
//   addressLineTwo: {type: DataTypes.STRING},
//   city: {type: DataTypes.STRING, allowNull: false},
//   state: {type: DataTypes.STRING, allowNull: false},
//   zip: {type: DataTypes.STRING, allowNull: false},
//   phone: {type: DataTypes.STRING},
//   notes: {type: DataTypes.STRING},
//   shippingCost: {type: DataTypes.INTEGER, defaultValue: 50, allowNull: false},
//   total: {type: DataTypes.INTEGER, allowNull: false},
// })

// const OrderedProduct = sequelize.define('orderedProduct', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   count: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
//   selectedSize: {type: DataTypes.STRING, allowNull: false},
//   price: {type: DataTypes.INTEGER, allowNull: false},
//   totalPrice: {type: DataTypes.INTEGER, allowNull: false},
// })

// const PromoCode = sequelize.define('promocode', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   promocode: {type: DataTypes.STRING, allowNull: false},
//   percentDiscount: {type: DataTypes.INTEGER, allowNull: false},
//   expirationDate: {type: DataTypes.DATE},
// })

// const UsedPromo = sequelize.define('usedpromo', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
// })

// const ProductCategory = sequelize.define('product_category')

// User.hasOne(Cart)
// Cart.belongsTo(User)

// User.hasMany(Rating)
// Rating.belongsTo(User)

// User.hasMany(Address)
// Address.belongsTo(User)

// Cart.hasMany(CartProduct, {as: 'products'})
// CartProduct.belongsTo(Cart)

// Product.hasMany(CartProduct)
// CartProduct.belongsTo(Product)

// Order.hasMany(OrderedProduct)
// OrderedProduct.belongsTo(Order)

// Product.hasMany(OrderedProduct)
// OrderedProduct.belongsTo(Product)

// Product.hasMany(Rating)
// Rating.belongsTo(Product)

// Product.hasMany(Review)
// Review.belongsTo(Product)

// User.hasMany(Review)
// Review.belongsTo(User)

// Review.hasOne(Rating)
// Rating.belongsTo(Review)

// User.hasMany(Order)
// Order.belongsTo(User)

// PromoCode.hasMany(UsedPromo)
// UsedPromo.belongsTo(PromoCode)

// User.hasMany(UsedPromo)
// UsedPromo.belongsTo(User)

// Category.belongsToMany(Product, { through: ProductCategory });
// Product.belongsToMany(Category, { through: ProductCategory });

// module.exports = {
//   User,
//   Address,
//   Cart,
//   CartProduct,
//   Product,
//   Category,
//   Rating,
//   Review,
//   ProductCategory,
//   Order,
//   OrderedProduct,
//   PromoCode,
//   UsedPromo
// }

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  image: { type: String },
  role: { type: String, default: "USER" },
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

const cartSchema = new mongoose.Schema({
  subTotal: { type: Number, default: 0 },
  // Add any other fields you need
});

const cartProductSchema = new mongoose.Schema({
  count: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  // Add any other fields you need
});

const productSchema = new mongoose.Schema({
  images: [String],
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 5 },
  // effects: [String],
  // relieve: [String],
  // ingredients: [String],
  sizes: [String],
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  instock: { type: Boolean, default: true },
  categoriesId: [{ type: Number }],
  // Add any other fields you need
});

const categorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  // Add any other fields you need
});

const ratingSchema = new mongoose.Schema({
  rate: { type: Number, required: true },
  // Add any other fields you need
});

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  review: { type: String, required: true },
  // Add any other fields you need
});

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
  // Add any other fields you need
});

const orderedProductSchema = new mongoose.Schema({
  count: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  // Add any other fields you need
});

const promoCodeSchema = new mongoose.Schema({
  promocode: { type: String, required: true },
  percentDiscount: { type: Number, required: true },
  expirationDate: { type: Date },
  // Add any other fields you need
});

const usedPromoSchema = new mongoose.Schema({
  // Add any fields you need
});

const productCategory = new mongoose.Schema({
  // fields
  categoryId: { type: Number },
  productId: { type: mongoose.Schema.Types.ObjectId },
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

// Add relationships manually in Mongoose models, as MongoDB doesn't handle them automatically like Sequelize
// You can use references or embedding depending on your use case.

// Example: Reference in Mongoose
// userSchema.hasOne(cartSchema); // Assuming a one-to-one relationship
// cartSchema.belongsTo(userSchema);

// Example: Embedding in Mongoose
// productSchema.add({ ratings: [ratingSchema] }); // Assuming a one-to-many relationship

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
};
