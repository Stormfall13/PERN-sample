import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import BasketCount from "../components/BasketCount";

import noPhoto from '../assets/no-photo.png';


const Home = () => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Ошибка загрузки категорий", err));
    }, []);

    return (
        <div>
            <Header />
            <BasketCount />
            <nav>
                <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                    <Link to={`/category/${category.id}`}>
                    {category.name}
                    <div style={{
                        width: 100,
                        height: 100,
                    }}>
                        <img 
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            src={category.image ? `${process.env.REACT_APP_API_URL}${category.image}` : noPhoto}
                            alt="category image" />
                    </div>
                    
                    </Link>
                    </li>
                ))}
                </ul>
            </nav>
        </div>
    );
};

export default Home;
