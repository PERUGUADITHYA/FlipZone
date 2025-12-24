import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiMenu, FiX } from "react-icons/fi";
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
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/products.json`)
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

  const handleCategory = (value) => {
    setQuery("");
    setSearchQuery("");
    setSelectedCategory(value);
    setOpenDrawer(false);

    if (value) toast.success(`Showing ${value}`, { icon: "📦" });
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <>
      <header className="headerContainer">
        {/* MOBILE MENU ICON */}
        <div className="mobileMenuBtn" onClick={() => setOpenDrawer(true)}>
          <FiMenu size={22} />
        </div>

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
          <span className="logoName">FlipZone</span>
        </motion.div>

        {/* DESKTOP SEARCH */}
        <div className="desktopOnly">
          <motion.div className="searchBox">
            <FiSearch className="searchIcon" />
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={handleSearch}
            />
          </motion.div>
        </div>

        {/* DESKTOP CATEGORY */}
        <div className="desktopOnly categoryMenu">
          <select onChange={(e) => handleCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* DESKTOP PROFILE */}
        <div
          className="profileWrapper desktopOnly"
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

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {openDrawer && (
          <>
            <motion.div
              className="drawerOverlay"
              onClick={() => setOpenDrawer(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="mobileDrawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="drawerHeader">
                <span>Hello, {user?.name}</span>
                <FiX size={22} onClick={() => setOpenDrawer(false)} />
              </div>

              <div className="drawerSearch">
                <FiSearch />
                <input
                  placeholder="Search products..."
                  value={query}
                  onChange={handleSearch}
                />
              </div>

              <div className="drawerSection">
                <h4>Categories</h4>
                {categories.map((c) => (
                  <div key={c} onClick={() => handleCategory(c)}>
                    {c}
                  </div>
                ))}
              </div>

              <div className="drawerSection">
                <div onClick={() => navigate("/cart")}>
                  🛒 Cart ({cartCount})
                </div>
                <div onClick={() => navigate("/orders")}>📦 Orders</div>
                <div className="logoutItem" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
