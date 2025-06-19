const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Cart = sequelize.define("Cart", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
});

Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Cart;
