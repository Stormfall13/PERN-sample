import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const [startedChats, setStartedChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chat, setChats] = useState();
  console.log(chatMessages);
  
  const token = localStorage.getItem("token");

  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  

  // Загрузка списка начатых чатов
  useEffect(() => {
    if (!userId) return;

    const fetchStartedChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chatlist/started", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStartedChats(res.data);
      } catch (err) {
        console.error("Ошибка получения списка чатов:", err);
      }
    };

    fetchStartedChats();
  }, [userId]);

  // Обработка входящих сообщений
  // useEffect(() => {
  //   if (activeChatId) {
  //     socket.emit("joinChat", activeChatId);

  //     socket.on("newMessage", (msg) => {
  //       setChatMessages((prev) => [...prev, msg]);
  //     });

  //     return () => socket.off("newMessage");
  //   }
  // }, [activeChatId]);
  useEffect(() => {
    if (!activeChatId) return;
  
    console.log("Joining chat:", activeChatId);
    socket.emit("joinChat", activeChatId);
  
    const handleMessage = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    };
  
    socket.on("newMessage", handleMessage);
  
    return () => {
      console.log("Отключаюсь от чата");
      socket.off("newMessage", handleMessage); // важно отписываться от конкретного обработчика
    };
  }, [activeChatId]);

  const sendMessage = () => {
    if (!message || !activeChatId) return;

    console.log("Отправка сообщения:", message);
    socket.emit("sendMessage", {
      chatId: activeChatId,
      senderId: userId,
      content: message,
    });
    setMessage("");
  };

  const searchUsers = async () => {
    if (!searchTerm) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/user/users/search`, {
        params: { q: searchTerm, currentUserId: userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Ошибка поиска:", err);
    }
  };

  const startNewChat = async (otherUserId) => {
    try {
      console.log("startNewChat", { userId, otherUserId });
      const res = await axios.post(`http://localhost:5000/api/chats/create`, {
        senderId: userId,
        receiverId: otherUserId,
        
      });
      
            
      // Добавляем в список начатых чатов
      await axios.post("http://localhost:5000/api/chatlist/started", {
        partnerId: otherUserId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Обновляем список чатов
      setStartedChats((prev) => [...prev, { id: otherUserId, username: res.data.receiver?.username }]);
      setSearchResults([]);
      setSearchTerm("");
    } catch (err) {
      console.error("Ошибка создания чата:", err);
    }
  };

  const removeFromStartedChats = async (partnerId) => {
    try {
      await axios.delete("http://localhost:5000/api/chatlist/started", {
        data: { partnerId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setStartedChats((prev) => prev.filter((user) => user.id !== partnerId));
    } catch (err) {
      console.error("Ошибка удаления из списка:", err);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chat/delete/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // если у тебя авторизация по JWT
        },
      });
      // Удаляем из состояния
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error("Ошибка при удалении чата:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Список чатов (табы) */}
      <div style={{ width: "250px", borderRight: "1px solid gray", padding: "0.5rem" }}>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Найти пользователя"
          />
          <button onClick={searchUsers}>Поиск</button>

          {searchResults.map((user) => (
            <div key={user.id}>
             {user.isOnline ? (
                <span style={{ color: "green" }}>● Онлайн</span>
              ) : (
                <span style={{ color: "gray" }}>● Оффлайн</span>
              )} 
              {user.username}
              <button onClick={() => startNewChat(user.id)}>Начать чат</button>
              <button onClick={() => handleDeleteChat(chat.id)}>
                Удалить из списка
              </button>
            </div>
          ))}
        </div>

        <hr />

        <ul>
          {startedChats.map((user) => (
            <li key={user.id} style={{ marginBottom: "0.5rem" }}>
              <span
                onClick={() => {
                  setActiveChatId(user.chatId); // если используешь chatId, можешь изменить структуру
                  setChatMessages([]); // можно добавить загрузку сообщений
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: user.chatId === activeChatId ? "bold" : "normal",
                  marginRight: "0.5rem",
                }}
              >
                {user.username}
              </span>
              <button onClick={() => removeFromStartedChats(user.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Чат */}
      <div style={{ flex: 1, padding: "1rem" }}>
        <div style={{ height: "300px", overflowY: "auto" }}>
          {chatMessages.map((msg, i) => (
            <p key={i}>{msg.content}</p>
          ))}
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
