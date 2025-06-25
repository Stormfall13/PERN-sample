// models/index.js
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Product = require('./Product');
const User = require('./User');

// 🔁 Все связи определяем здесь
Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });

CartItem.belongsTo(Cart, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

module.exports = {
  Cart,
  CartItem,
  Product,
  User,
};
