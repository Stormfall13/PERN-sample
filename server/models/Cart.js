const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const CartItem = require("./CartItem");

const Cart = sequelize.define("Cart", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
});



module.exports = Cart;
