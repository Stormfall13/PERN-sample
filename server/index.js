require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

// app.use(cors());
app.use(cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Защищённый маршрут (пример)
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ message: "Доступ разрешён", user: req.user });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
});

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

sequelize
    .sync({ alter: true })
    .then(() => console.log("📦 DB updated with models"))
    .catch((err) => console.error("❌ Database sync error:", err));
