const express = require("express");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Получение корзины пользователя
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { userId: req.user.id },
            include: {
                model: CartItem,
                include: Product
            }
        });

        if (!cart) {
            return res.json({ items: [] }); // Вернуть пустую корзину
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении корзины", error: err.message });
    }
});

// 📌 Добавить товар в корзину
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            cart = await Cart.create({ userId: req.user.id });
        }

        let item = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity
            });
        }

        res.json({ message: "Товар добавлен в корзину", item });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при добавлении товара", error: err.message });
    }
});

// 📌 Удалить товар из корзины
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
        if (!item) return res.status(404).json({ message: "Товар не найден в корзине" });

        await item.destroy();
        res.json({ message: "Товар удалён из корзины" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при удалении", error: err.message });
    }
});

// 📌 Очистить корзину полностью
router.delete("/clear", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        await CartItem.destroy({ where: { cartId: cart.id } });
        res.json({ message: "Корзина очищена" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при очистке корзины", error: err.message });
    }
});

module.exports = router;
