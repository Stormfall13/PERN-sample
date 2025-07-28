const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const StartedChat = sequelize.define("StartedChat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.belongsToMany(User, {
  through: StartedChat,
  as: "startedWith",
  foreignKey: "userId",
  otherKey: "partnerId",
});

module.exports = StartedChat;