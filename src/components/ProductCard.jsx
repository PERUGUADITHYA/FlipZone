import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import StarRating from "../pages/StarRating";

const ProductCard = ({ product, addToCart }) => {
  const handleAdd = (e) => {
    e.stopPropagation(); // extra safety
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="productCard"
      data-aos="fade-up"
    >
      <Link to={`/product/${product.id}`}>
        <div className="imgWrap">
          <motion.img
            src={product.image}
            alt={product.title}
            whileHover={{ scale: 1.1 }}
          />
        </div>
        <h3 className="pTitle">{product.title}</h3>
      </Link>

      <div className="pMeta">
        <span className="price">₹{product.price}</span>
        <StarRating rating={product.rating} />
      </div>

      <button className="addBtn" onClick={handleAdd}>
        Add to Cart
      </button>
    </motion.div>
  );
};

export default ProductCard;
