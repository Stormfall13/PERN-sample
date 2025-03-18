import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    return (
        <div>
            <h1>{category ? category.name : "Загрузка..."}</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h3>{product.nameProd}</h3>
                        <p>Цена: {product.price} $</p>
                        <img 
                            src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto} 
                            alt={product.nameProd} 
                            width="200" 
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPage;
