require("dotenv").config();
require('./models/associations');

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageRoutes = require("./routes/imageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatListRoutes = require("./routes/chatListRoutes");

const authMiddleware = require("./middlewares/authMiddleware");

const Image = require("./models/Image");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");

const app = express();
const server = http.createServer(app); // <-- создаём http сервер из express
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
});

// Socket.IO события
io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
  
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });
  
    // socket.on("sendMessage", async ({ chatId, senderId, content }) => {
    //     try {
    //       const newMessage = await Message.create({ chatId, senderId, content });
      
    //       io.to(chatId).emit("newMessage", {
    //         id: newMessage.id,
    //         chatId,
    //         senderId,
    //         content,
    //         createdAt: newMessage.createdAt,
    //       });
    //     } catch (err) {
    //       console.error("Error saving message:", err);
    //     }
    //   });

    socket.on("sendMessage", (data) => {
        const { chatId, senderId, content } = data;
    
        const message = {
          senderId,
          content,
          chatId,
          createdAt: new Date().toISOString(),
    };
    
    io.to(chatId).emit("newMessage", message); // <- вот оно!
    
    });
  
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
});

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
app.use("/api/images", imageRoutes);
app.use("/assets", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static(path.join(__dirname, "assets"))); 
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chatlist", chatListRoutes);


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
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


sequelize
    .sync({ alter: true })
    // .sync({ force: true }) // Удаляет старые таблицы
    .then(() => console.log("📦 DB updated with models"))
    .catch((err) => console.error("❌ Database sync error:", err));
