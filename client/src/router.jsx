import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const UserPage = lazy(() => import("./pages/UserPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CartPage = lazy(() => import("./pages/CartPage"));


const AppRouter = () => {

    return (
        <Router>
            <Suspense fallback={<div>Загрузка...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* 🔐 Защищенные маршруты (только для user и admin) */}
                    <Route path="/" element={ <ProtectedRoute allowedRoles={["user", "admin"]}> <Home /> </ProtectedRoute> } />
                    <Route path="/user" element={ <ProtectedRoute allowedRoles={["user", "admin"]}> <UserPage /> </ProtectedRoute> } />
                    <Route path="/admin" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminPage /> </ProtectedRoute> } />
                    <Route path="/gallery" element={ <ProtectedRoute allowedRoles={["admin"]}> <GalleryPage /> </ProtectedRoute> } />
                    <Route path="/category/:id" element={ <ProtectedRoute allowedRoles={["admin", "user"]}> <CategoryPage /> </ProtectedRoute> } />
                    <Route path="/cart" element={<ProtectedRoute allowedRoles={["user", "admin"]}> <CartPage/> </ProtectedRoute>} />
                    
                    {/* Если страница не найдена — редирект на `/` */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRouter;
