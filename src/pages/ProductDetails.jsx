import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import StarRating from "./StarRating";

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data) => {
        const p = data.find((x) => String(x.id) === String(id));
        setProduct(p);
      });
  }, [id]);

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  const handleAdd = (e) => {
    e.preventDefault(); // 🔥 PREVENT PAGE RELOAD
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <motion.div className="productDetails" data-aos="fade-up">
      <div className="left">
        <motion.img
          src={product.image}
          alt={product.title}
          whileHover={{ scale: 1.05 }}
        />
      </div>

      <div className="right">
        <h2>{product.title}</h2>
        <p className="price">₹{product.price}</p>
        <span className="category">{product.category}</span>
        <div className="ratingBlock">
          <StarRating rating={product.rating} size={22} />
        </div>
        <p>{product.description}</p>
        {/* 🔥 FIXED BUTTON */}
        <button type="button" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
