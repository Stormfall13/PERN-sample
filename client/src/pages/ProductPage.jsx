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

  if (!product) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.nameProd}</h1>
      <img
        src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto}
        alt={product.nameProd}
        width="300"
      />
      <p><strong>Цена:</strong> {product.price} $</p>
      <p><strong>Категория:</strong> {product.Category?.name || "Без категории"}</p>
      {/* Можно добавить описание или другие поля, если они есть */}
    </div>
  );
};

export default ProductPage;
