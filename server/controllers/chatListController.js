const User = require("../models/User");
const StartedChat = require("../models/StartedChat");

exports.getStartedChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      include: {
        model: User,
        as: "startedWith",
        attributes: ["id", "username", "email"],
        through: { attributes: [] },
      },
    });

    res.json(user.startedWith);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при загрузке начатых чатов" });
  }
};

exports.addToStartedChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { partnerId } = req.body;

    const user = await User.findByPk(userId);
    const partner = await User.findByPk(partnerId);

    if (!user || !partner) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await user.addStartedWith(partner);
    res.json({ message: "Чат добавлен в список" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при добавлении в список" });
  }
};

exports.removeFromStartedChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { partnerId } = req.body;

    const user = await User.findByPk(userId);
    const partner = await User.findByPk(partnerId);

    if (!user || !partner) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await user.removeStartedWith(partner);
    res.json({ message: "Пользователь удалён из списка" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при удалении из списка" });
  }
};
