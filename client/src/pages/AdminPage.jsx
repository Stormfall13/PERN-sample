import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

const AdminPage = () => {
    const navigate = useNavigate();

    const [nameProd, setNameProd] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("")
    const [image, setImage] = useState("");
    const [allImages, setAllImages] = useState([]);
    
    const [categoryName, setCategoryName] = useState("");

    const [categories, setCategories] = useState([]);

    const [windowOverlay, setWindowOverlay] = useState(false);
    
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nameProd,
            price,
            categoryId,
            image,
            stock,
        };
        
        console.log("📤 JSON отправки:", JSON.stringify(payload, null, 2));
    
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Товар добавлен:", data);

        setNameProd("")
        setPrice("")
        setCategoryId("")
        setImage("")
        setStock("")
    };


    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: categoryName }),
            });

            if (!response.ok) throw new Error("Ошибка при добавлении категории");

            const data = await response.json();
            console.log("Категория добавлена:", data);
            setCategoryName("");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };


    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (!user) return; // Ждём, пока загрузится пользователь

        if (user.role !== "admin") {
            navigate("/"); // Нет прав — перенаправляем на главную
            return;
        }

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
                if (!res.ok) throw new Error("Ошибка загрузки категорий");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Ошибка категорий:", error);
            }
        };
        
        const fetchImages = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images`);
                if (!res.ok) throw new Error("Ошибка загрузки изображений");
                const data = await res.json();
                setAllImages(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        fetchImages();
        fetchCategories();

    }, [token, user, navigate]);


    if (!user) {
        return <h2>Загрузка...</h2>;
    }
    
    const toggleOverlay = () => {
        setWindowOverlay(!windowOverlay);
    };


    const selectImage = (imgPath) => {
        setImage(imgPath);        // Устанавливаем ссылку на выбранное изображение
        setWindowOverlay(false); // Закрываем оверлей
    };

    return (
        <div className="admin-container">
            <Header />
            <Link to="/gallery">
                Перейти в галерею
            </Link>
            <Link to='/all-users'>
                Страница пользователей
            </Link>
            <h1>Админ-панель</h1>



            <h2>Добавить категорию</h2>
            <form onSubmit={handleCategorySubmit}>
                <input
                    type="text"
                    placeholder="Название категории"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
                <button type="submit">Добавить категорию</button>
            </form>

            <div>
            <h2>Добавить товар</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Название" value={nameProd} onChange={(e) => setNameProd(e.target.value)} required />
                    <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input type="number" placeholder="Количество" value={stock} onChange={(e) => setStock(e.target.value)}/>
                    <input type="text" placeholder="ссылка изображения" value={image} onChange={(e) => setImage(e.target.value)} />
                    <div className="gallery__selected">
                        <button type="button" onClick={toggleOverlay}>Добавить из Галереи</button> 
                        {image ? (
                        <div className="selected__image" style={{ maxWidth: 100, maxHeight: 100 }}>
                            <img
                            src={`${process.env.REACT_APP_API_URL}${image.startsWith("/") ? "" : "/uploads/"}${image}`}
                            alt="Выбранное изображение"
                            style={{ width: "100%" }}
                            />
                        </div>
                        ) : (
                        <p>Изображение не выбрано</p>
                        )}
                    </div>
                    <button type="submit">Добавить</button>
                </form>
            </div>
            {windowOverlay && (
                <div className="overlay" style={{
                    position: 'fixed',
                    zIndex: 10,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    background: '#424242',
                    color: "#e0e0e0"
                }}>
                    <div className="overlay-content">
                        <h2>Выберите изображение</h2>
                        <button onClick={toggleOverlay} className="close-btn">Закрыть</button>
                        <div className="image-grid" style={{ display: "flex" }}>
                            {allImages.map((img) => (
                                <div className="image__grid-wrapper" key={img.id} style={{ cursor: 'pointer', maxWidth: 150 }}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${img.filepath}`}
                                        alt={img.filepath}
                                        onClick={() => selectImage(img.filepath)}
                                        style={{ width: '100%', borderRadius: 8, border: '2px solid #ccc' }}
                                    />
                                </div> 
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
