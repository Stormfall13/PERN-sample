// models/index.js
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Product = require('./Product');
const User = require('./User');
const Favorite = require("./Favorite");
const Chat = require('./Chat');
const Message = require('./Message');

// Chat -> User
Chat.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
Chat.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

// Message -> Chat
Message.belongsTo(Chat, { foreignKey: "chatId" });

// Message -> User
Message.belongsTo(User, { foreignKey: "senderId" });

User.hasMany(Message, { foreignKey: "senderId", onDelete: "CASCADE" });

// 🔁 Все связи определяем здесь
Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });

CartItem.belongsTo(Cart, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Favorite, { foreignKey: 'productId' });
Favorite.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  Cart,
  CartItem,
  Product,
  User,
  Favorite,
  Chat,
  Message,
};
