import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

import './categoryPage.css';

const CategoryPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categories/${id}`)
            .then((res) => res.json())
            .then((data) => setCategory(data))
            .catch((err) => console.error("Ошибка загрузки категории", err));

        fetch(`${process.env.REACT_APP_API_URL}/api/products?categoryId=${id}`)
            .then((res) => res.json())
            // .then((data) => setProducts(data))
            .then((data) => {
                setProducts(data);
                const initialQuantities = {};
                data.forEach((prod) => {
                    initialQuantities[prod.id] = 1;
                });
                setQuantities(initialQuantities);
            })
            .catch((err) => console.error("Ошибка загрузки товаров", err));
    }, [id]);

    const handleAddToCart = async (productId, stock) => {
        const quantity = quantities[productId] || 1;
        
        if (quantity > stock) {
            alert(`Недостаточно товара на складе. Всего: ${stock}`);
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Ошибка при добавлении в корзину");
    
            alert("Товар добавлен в корзину");
        } catch (err) {
            // console.error("Ошибка добавления в корзину:", err.message);
            alert(err.message);
        }
    };
    
    const increaseQuantity = (id, stock) => {
        setQuantities((prev) => {
            const newQty = prev[id] + 1;
            if (newQty > stock) {
                alert(`Недостаточно товара на складе. Всего: ${stock}`);
                return prev;
            }
            return { ...prev, [id]: newQty };
        });
    };
    
    const decreaseQuantity = (id) => {
        setQuantities((prev) => {
            const newQty = Math.max(prev[id] - 1, 1); // минимум 1
            return { ...prev, [id]: newQty };
        });
    };
    
    const handleQuantityChange = (e, id, stock) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) return;
        if (value > stock) {
            alert(`Недостаточно товара на складе. Всего: ${stock}`);
            return;
        }
        setQuantities((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <div>
            <h1>{category ? category.name : "Загрузка..."}</h1>
            <div className="wrapp__prod" style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}>
            {products.map((product) => (
                <div key={product.id} className="wrapper__prod" style={{
                    maxWidth: '300px',
                    width: '100%',
                }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3>{product.nameProd}</h3>
                    <p>Цена: {product.price} $</p>
                    <img 
                        src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto} 
                        alt={product.nameProd} 
                        width="200" 
                    />
                    <p>На складе: {product.stock}</p>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => decreaseQuantity(product.id)}>-</button>
                    <input
                        type="text"
                        value={quantities[product.id] || 1}
                        onChange={(e) => handleQuantityChange(e, product.id, product.stock)}
                        style={{ width: 50 }}
                        min={1}
                        max={product.stock}
                    />
                    <button onClick={() => increaseQuantity(product.id, product.stock)}>+</button>
                </div>
                <button onClick={() => handleAddToCart(product.id, product.stock)}>
                    Добавить в корзину
                </button>
                </div>
            ))}
            </div>

        </div>
    );
};

export default CategoryPage;
