import React, { useEffect, useState } from "react";
import "../styles/Orders.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const statusFlow = ["Ordered", "Packed", "Shipped", "Delivered"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // 🔥 GET LOGGED-IN USER
  const user = JSON.parse(localStorage.getItem("user"));
  const userKey = user?.email ? `orders_${user.email}` : null;

  // ✅ LOAD USER-SPECIFIC ORDERS
  useEffect(() => {
    if (!userKey) return;
    const stored = JSON.parse(localStorage.getItem(userKey)) || [];
    setOrders(stored);
  }, [userKey]);

  // 🔥 AUTO STATUS UPDATE ENGINE (USER ONLY)
  useEffect(() => {
    if (!userKey) return;

    const interval = setInterval(() => {
      const stored = JSON.parse(localStorage.getItem(userKey)) || [];

      const updated = stored.map((order) => ({
        ...order,
        items: order.items.map((item) => {
          if (item.cancelled) return item;

          // Initialize tracking
          if (item.statusIndex === undefined) {
            return {
              ...item,
              statusIndex: 0,
              lastStatusUpdate: Date.now(),
              stepDelay: (Math.floor(Math.random() * 3) + 1) * 60000, // 1–3 mins
            };
          }

          // Move status forward
          if (
            item.statusIndex < statusFlow.length - 1 &&
            Date.now() - item.lastStatusUpdate >= item.stepDelay
          ) {
            return {
              ...item,
              statusIndex: item.statusIndex + 1,
              lastStatusUpdate: Date.now(),
            };
          }

          return item;
        }),
      }));

      localStorage.setItem(userKey, JSON.stringify(updated));
      setOrders(updated);
    }, 5000);

    return () => clearInterval(interval);
  }, [userKey]);

  // ✅ CANCEL ITEM (USER SAFE)
  const cancelItem = (orderId, itemId) => {
    const updated = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId ? { ...item, cancelled: true } : item
            ),
          }
        : order
    );

    setOrders(updated);
    localStorage.setItem(userKey, JSON.stringify(updated));
    toast.error("Item cancelled");
  };

  // ✅ DELETE ORDER (USER SAFE)
  const deleteOrder = (orderId) => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem(userKey, JSON.stringify(updated));
    toast.success("Order deleted");
  };

  return (
    <div className="ordersPage">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="orderBox">
            <div className="orderHeader">
              <div>
                <h3>Order ID: {order.id}</h3>
                <p>{order.date}</p>
              </div>

              <button
                className="deleteOrderBtn"
                onClick={() => deleteOrder(order.id)}
              >
                Delete Order
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="orderItemCell">
                      <img src={item.image} alt="" />
                      {item.title}
                    </td>

                    <td>₹{item.price}</td>
                    <td>{item.qty}</td>

                    <td>
                      {item.cancelled ? (
                        <span className="cancelledText">Cancelled</span>
                      ) : (
                        statusFlow[item.statusIndex]
                      )}
                    </td>

                    <td>
                      {item.cancelled ? (
                        <span className="cancelledText">Cancelled</span>
                      ) : (
                        <>
                          <button
                            className="trackBtn"
                            onClick={() =>
                              navigate(`/track/${order.id}/${item.id}`)
                            }
                          >
                            Track
                          </button>

                          <button
                            className="cancelBtn"
                            onClick={() => cancelItem(order.id, item.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
