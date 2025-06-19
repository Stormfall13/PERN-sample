const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");

const router = express.Router();

// 📌 1. Создание товара
router.post("/", async (req, res) => {
    try {
        const { nameProd, price, categoryId, image } = req.body; // `image` приходит строкой

        if (!nameProd || !price || !categoryId) {
            return res.status(400).json({ message: "Все поля обязательны" });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        const newProduct = await Product.create({ nameProd, price, categoryId, image });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 2. Обновление товара (с возможностью менять `image`)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nameProd, price, categoryId, image } = req.body; // `image` теперь строка

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Категория не найдена" });
            }
        }

        product.nameProd = nameProd || product.nameProd;
        product.price = price || product.price;
        product.categoryId = categoryId || product.categoryId;
        product.image = image !== undefined ? image : product.image; // Если `image` передали — обновляем, иначе оставляем старое

        await product.save();
        res.json({ message: "Товар обновлён", product });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 3. Получение всех товаров с возможностью фильтрации по `categoryId`
router.get("/", async (req, res) => {
    try {
        const { categoryId } = req.query;

        const whereClause = categoryId ? { categoryId } : undefined;

        const products = await Product.findAll({
            where: whereClause,
            include: Category,
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 4. Удаление товара
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        await product.destroy();
        res.json({ message: "Товар удалён" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

module.exports = router;
