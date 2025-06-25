import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

const ProductPage = () => {
  const { id } = useParams(); // ID товара
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Ошибка загрузки товара", err));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1, // или можно добавить выбор количества позже
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Товар добавлен в корзину");
      } else {
        console.error("Ошибка добавления", data);
        alert("Не удалось добавить товар в корзину");
      }
    } catch (err) {
      console.error("Ошибка при добавлении в корзину", err);
      alert("Произошла ошибка");
    }
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.nameProd}</h1>
      <img
        src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto}
        alt={product.nameProd}
        width="300"
      />
      <p><strong>Количество:</strong>{product.stock}</p>
      <p><strong>Цена:</strong> {product.price} $</p>
      <p><strong>Категория:</strong> {product.Category?.name || "Без категории"}</p>
      <button onClick={handleAddToCart}>Добавить в корзину</button>
      {/* Можно добавить описание или другие поля, если они есть */}
    </div>
  );
};

export default ProductPage;
