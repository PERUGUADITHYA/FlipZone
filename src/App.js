import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 🔥 runtime flag (resets on npm start)
  const [appStarted, setAppStarted] = useState(false);

  // 🔥 user state (do NOT auto-login on start)
  const [user, setUser] = useState(null);

  // 🔥 FORCE LOGIN ON EVERY APP START
  useEffect(() => {
    setAppStarted(true);
  }, []);

  // 🔥 LOAD CART PER USER
  useEffect(() => {
    if (user?.email) {
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
      setCart(savedCart);
    } else {
      setCart([]);
    }
  }, [user]);

  // 🔥 SAVE CART PER USER
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // 🔥 SAVE USER ONLY AFTER LOGIN
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // 🔐 PROTECTED ROUTE
  const ProtectedRoute = ({ children }) => {
    if (!appStarted) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  // 🔓 PUBLIC ROUTE
  const PublicRoute = ({ children }) => {
    if (user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="appRoot">
      <Toaster position="top-right" />

      {user && (
        <Header
          cartCount={cart.reduce((s, i) => s + i.qty, 0)}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
          user={user}
          setUser={setUser}
        />
      )}

      <main className="mainContent">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login setUser={setUser} />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register setUser={setUser} />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home
                  addToCart={addToCart}
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products addToCart={addToCart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails addToCart={addToCart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage
                  cart={cart}
                  updateQty={(id, qty) =>
                    setCart((prev) =>
                      prev.map((p) => (p.id === id ? { ...p, qty } : p))
                    )
                  }
                  removeFromCart={(id) =>
                    setCart((prev) => prev.filter((p) => p.id !== id))
                  }
                  clearCart={() => setCart([])}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track/:orderId/:itemId"
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {user && <Footer />}
    </div>
  );
}

export default App;
