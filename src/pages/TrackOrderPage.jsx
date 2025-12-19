import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/TrackOrder.css";

const statusFlow = ["Ordered", "Packed", "Shipped", "Delivered"];
const statusIcons = ["🛒", "📦", "🚚", "✔"];
const statusColors = ["#ff9800", "#2196f3", "#9c27b0", "#4caf50"];

const TrackOrderPage = () => {
  const { orderId, itemId } = useParams();
  const [item, setItem] = useState(null);

  // 🔥 GET LOGGED-IN USER
  const user = JSON.parse(localStorage.getItem("user"));
  const userKey = user?.email ? `orders_${user.email}` : null;

  useEffect(() => {
    if (!userKey) return;

    const interval = setInterval(() => {
      // ✅ LOAD ONLY CURRENT USER ORDERS
      const orders = JSON.parse(localStorage.getItem(userKey)) || [];

      const order = orders.find((o) => String(o.id) === String(orderId));

      const found = order?.items.find((i) => String(i.id) === String(itemId));

      setItem(found || null);
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId, itemId, userKey]);

  if (!item)
    return <h3 style={{ textAlign: "center" }}>Loading tracking...</h3>;

  if (item.cancelled)
    return (
      <h3 style={{ textAlign: "center", color: "#e63946" }}>
        ❌ Order Cancelled
      </h3>
    );

  return (
    <div className="trackPage">
      <h2>{item.title}</h2>

      <div className="progressContainer">
        {statusFlow.map((step, idx) => {
          const active = idx <= item.statusIndex;
          const nextActive = idx < item.statusIndex;

          return (
            <div key={idx} className="progressStep">
              <div
                className={`circle ${active ? "active" : ""}`}
                style={{
                  backgroundColor: active ? statusColors[idx] : "#ccc",
                  boxShadow: active
                    ? `0 0 15px ${statusColors[idx]}, 0 4px 15px rgba(0,0,0,0.2)`
                    : "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {active ? statusIcons[idx] : idx + 1}
              </div>

              <span
                className="label"
                style={{
                  color: active ? statusColors[idx] : "#aaa",
                }}
              >
                {step}
              </span>

              {idx !== statusFlow.length - 1 && (
                <div
                  className={`line ${nextActive ? "active" : ""}`}
                  style={{
                    background: nextActive
                      ? `linear-gradient(90deg, ${statusColors[idx]}, ${
                          statusColors[idx + 1]
                        })`
                      : "#ddd",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackOrderPage;
