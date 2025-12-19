import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="productsPage">
      <div className="productsHeader">
        <input
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="productGrid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default Products;
