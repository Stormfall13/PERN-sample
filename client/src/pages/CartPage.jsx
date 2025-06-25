import { useEffect, useState } from "react";
import { useNavigate ,Link } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) setCart(data);
      else console.error("Ошибка загрузки корзины", data);
    } catch (err) {
      console.error("Ошибка при получении корзины:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Товар удалён из корзины");
        fetchCart(); // обновим корзину
      } else {
        console.error("Ошибка удаления товара", data);
      }
    } catch (err) {
      console.error("Ошибка при удалении товара:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Корзина очищена");
        fetchCart(); // обновим
      } else {
        console.error("Ошибка очистки корзины", data);
      }
    } catch (err) {
      console.error("Ошибка при очистке корзины:", err);
    }
  };

  if (!cart) return <div>Загрузка корзины...</div>;
  if (!Array.isArray(cart.CartItems) || cart.CartItems.length === 0) return <div>Корзина пуста.</div>;

  return (
    <div>
      <h1>Корзина</h1>
      <ul>
        {cart.CartItems.map((item) => (
          <li key={item.id}>
            <h3>
            <Link to={`/product/${item.Product.id}`}>
                {item.Product?.nameProd || "Без названия"}
            </Link>
            </h3>
            <p>Цена: {item.Product?.price || "?"} $</p>
            <p>Кол-во: {item.quantity}</p>
            <img
              src={item.Product?.image ? `${process.env.REACT_APP_API_URL}${item.Product.image}` : noPhoto}
              alt={item.Product?.nameProd}
              width="150"
            />
            <br />
            <button onClick={() => navigate('/')}>
                Продолжить покупики
            </button>
            <button onClick={() => handleRemoveItem(item.Product.id)}>
              Удалить товар
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleClearCart} style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}>
        Очистить корзину
      </button>
    </div>
  );
};

export default CartPage;
