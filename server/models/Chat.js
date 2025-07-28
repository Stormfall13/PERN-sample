const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Chat = sequelize.define("Chat", {
  // ничего кроме id не нужно
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { timestamps: true });


module.exports = Chat;