import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({ username: "", email: "", role: "", password: "" });
    const navigate = useNavigate();

    const [nameProd, setNameProd] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState("");
    const [allImages, setAllImages] = useState([]);
    // console.log(image);
    
    const [categoryName, setCategoryName] = useState("");

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

        const fetchUsers = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Ошибка загрузки пользователей");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        fetchUsers();
    }, [token, user, navigate]);

    const deleteUser = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить пользователя?")) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Ошибка удаления");

            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setFormData({ username: user.username, email: user.email, role: user.role, password: "" });
    };

    const saveEdit = async () => {
        try {
            const updatedData = { ...formData };

            if (!updatedData.password) {
                delete updatedData.password; // Не отправляем, если пароль не изменён
            }

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${editUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error("Ошибка обновления");

            setUsers(users.map(user => (user.id === editUser.id ? { ...user, ...updatedData } : user)));
            setEditUser(null);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    if (!user) {
        return <h2>Загрузка...</h2>;
    }
    
    const toggleOverlay = () => {
        setWindowOverlay(!windowOverlay);
    };



    // const selectImage = (img) => {
        // console.log("Выбранное изображение:", img);
        // setImage(img); // Сохраняем весь объект изображения
        // setWindowOverlay(false);
    // };

    // const selectImage = (imgPath) => {
    //     console.log("Выбрано изображение:", imgPath);
    //     setImage(imgPath);
    //     setWindowOverlay(false);
    // };


    return (
        <div className="admin-container">
            <Header />
            <Link to="/gallery">
                <button>Перейти в галерею</button>
            </Link>
            <h1>Админ-панель</h1>

            <div className="users-list">
                {users.map((user) => (
                    <div className="user-card" key={user.id}>
                        <p><strong>ID:</strong> {user.id}</p>

                        <p><strong>Имя:</strong> 
                            {editUser?.id === user.id ? (
                                <input 
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            ) : (
                                user.username
                            )}
                        </p>

                        <p><strong>Email:</strong> 
                            {editUser?.id === user.id ? (
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            ) : (
                                user.email
                            )}
                        </p>

                        <p><strong>Роль:</strong> 
                            {editUser?.id === user.id ? (
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            ) : (
                                user.role
                            )}
                        </p>

                        <p><strong>Пароль:</strong> 
                            {editUser?.id === user.id ? (
                                <input 
                                    type="password"
                                    placeholder="Новый пароль (если нужно)"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            ) : (
                                "••••••"
                            )}
                        </p>

                        <div className="user-card-actions">
                            {editUser?.id === user.id ? (
                                <>
                                    <button onClick={saveEdit}>Сохранить</button>
                                    <button onClick={() => setEditUser(null)}>Отмена</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(user)}>Редактировать</button>
                                    <button onClick={() => deleteUser(user.id)}>Удалить</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

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
                    <input type="number" placeholder="ID категории" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />
                    <input type="text" placeholder="ссылка изображения" value={image} onChange={(e) => setImage(e.target.value)} />
                    <div className="gallery__selected">
                        <button type="button" onClick={toggleOverlay}>Добавить из Галереи</button> 
                        {image === null ? (
                            <p>Изображение не выбрано</p>
                        ) : (
                        <div className="selected__image" style={{
                            maxWidth: 100,
                            maxHeight: 100
                        }}>
                            {/* <img src={`${process.env.REACT_APP_API_URL}${image.filepath}`} alt={image.filepath}  style={{ width: '100%' }}/> */}
                            <div>asdasd</div>
                        </div>
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
                                <div className="image__grid-wrapper" key={img.id} style={{ maxWidth: 200, maxHeight: 200 }}>
                                    {/* <img src={`${process.env.REACT_APP_API_URL}${img.filepath}`} alt={img.filepath} onClick={() => selectImage(img.filepath)} style={{ width: '100%' }}/>  */}
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
