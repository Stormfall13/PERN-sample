const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category");


const Product = sequelize.define("Product", {
    nameProd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Category,
        key: "id",
        onDelete: "CASCADE", // <-- Добавляем каскадное удаление
        },
    },
    image: {  // 🔹 Добавляем поле для хранения пути к изображению
        type: DataTypes.STRING,
        allowNull: true, // Можно загружать товары без фото
    },
});

Category.hasMany(Product, { foreignKey: "categoryId", onDelete: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Product;
