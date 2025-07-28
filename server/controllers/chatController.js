const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const { Op } = require("sequelize");

exports.createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existingChat = await Chat.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
      senderId,
      receiverId,
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Ошибка при создании чата" });
  }
};

// Получить все чаты пользователя
exports.getUserChats = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        include: [
          { model: User, as: "sender", attributes: ["id", "username"] },
          { model: User, as: "receiver", attributes: ["id", "username"] },
        ],
      });
  
      res.json(chats);
    } catch (err) {
      console.error("Error fetching chats:", err);
      res.status(500).json({ error: "Ошибка при получении чатов" });
    }
  };
  

// Отправка сообщения
exports.sendMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
  
    try {
      const message = await Message.create({
        chatId,
        senderId,
        text,
      });
  
      res.json(message);
    } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).json({ error: "Ошибка при отправке сообщения" });
    }
};
  
// Получить сообщения по chatId
exports.getMessages = async (req, res) => {
    try {
      const messages = await Message.findAll({
        where: { chatId: req.params.chatId },
        order: [["createdAt", "ASC"]],
      });
      res.json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ message: "Ошибка при получении сообщений" });
    }
};

exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    await Chat.destroy({ where: { id: chatId } });
    res.status(200).json({ message: "Чат успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении чата:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
