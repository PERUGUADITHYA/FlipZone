import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import "../styles/Header.css";

const Header = ({
  cartCount = 0,
  setSearchQuery,
  setSelectedCategory,
  user,
  setUser,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const uniqueCats = [...new Set(data.map((p) => p.category))];
        setCategories(uniqueCats);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchQuery(value);
  };

  const handleCategory = (e) => {
    const selected = e.target.value;
    setQuery("");
    setSearchQuery("");
    setSelectedCategory(selected);

    if (selected) {
      toast.success(`Showing ${selected}`, { icon: "📦" });
    }
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="headerContainer">
      {/* LOGO */}
      <motion.div
        className="logo"
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
      >
        <img
          src="https://images.unsplash.com/photo-1654573817889-296cad084c97?w=500"
          alt="Logo"
        />
        <span className="logoName">Flipkart Lite</span>
      </motion.div>

      {/* SEARCH */}
      <motion.div className="searchBox" whileHover={{ scale: 1.02 }}>
        <FiSearch className="searchIcon" />
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={handleSearch}
        />
      </motion.div>

      {/* CATEGORY */}
      <motion.div className="categoryMenu" whileHover={{ scale: 1.03 }}>
        <select onChange={handleCategory}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </motion.div>

      {/* PROFILE ONLY */}
      <div
        className="profileWrapper"
        onMouseEnter={() => setOpenProfile(true)}
        onMouseLeave={() => setOpenProfile(false)}
      >
        <div className="profileBtn">
          <FiUser size={18} />
          <span className="profileName">{user?.name}</span>
        </div>

        <AnimatePresence>
          {openProfile && (
            <motion.div
              className="profileDropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div onClick={() => navigate("/cart")}>
                🛒 My Cart ({cartCount})
              </div>

              <div onClick={() => navigate("/orders")}>📦 My Orders</div>

              <div className="logoutItem" onClick={handleLogout}>
                🚪 Logout
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
