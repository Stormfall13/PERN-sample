import { useEffect, useState } from "react";
import noP2hoto from "../assets/no-photo.png";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setCartItems(data); // Убедись, что это массив данных
                } else {
                    console.error("Ошибка загрузки корзины", data);
                }
            } catch (err) {
                console.error("Ошибка при получении корзины:", err);
            }
        };

        fetchCartItems();
    }, []);

    // Проверка, чтобы map не вызывался на не-массиве
    if (!Array.isArray(cartItems)) {
        return <div>Произошла ошибка при загрузке корзины.</div>;
    }

    return (
        <div>
            <h1>Корзина</h1>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        <h3>{item.product.nameProd}</h3>
                        <p>Цена: {item.product.price} $</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CartPage;
