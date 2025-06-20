import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

import './categoryPage.css';

const CategoryPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categories/${id}`)
            .then((res) => res.json())
            .then((data) => setCategory(data))
            .catch((err) => console.error("Ошибка загрузки категории", err));

        fetch(`${process.env.REACT_APP_API_URL}/api/products?categoryId=${id}`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Ошибка загрузки товаров", err));
    }, [id]);

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // body: JSON.stringify({ productId }),
                body: JSON.stringify({ productId, quantity: 1 }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Ошибка при добавлении в корзину");
    
            alert("Товар добавлен в корзину");
        } catch (err) {
            console.error("Ошибка добавления в корзину:", err.message);
        }
    };
    

    return (
        <div>
            <h1>{category ? category.name : "Загрузка..."}</h1>
            <ul>
            {products.map((product) => (
                <li key={product.id}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3>{product.nameProd}</h3>
                    <p>Цена: {product.price} $</p>
                    <img 
                        src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto} 
                        alt={product.nameProd} 
                        width="200" 
                    />
                </Link>
                <button onClick={() => handleAddToCart(product.id)}>
                    Добавить в корзину
                </button>
                </li>
            ))}
            </ul>

        </div>
    );
};

export default CategoryPage;
