import React from "react";
import "../styles/Cart.css";
import toast from "react-hot-toast";

const CartPage = ({ cart, updateQty, removeFromCart, clearCart }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleRemove = (item) => {
    removeFromCart(item.id);
    toast(`${item.title} removed from cart`);
  };

  const handleClear = () => {
    clearCart();
    toast("Cart cleared");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 🔥 GET CURRENT LOGGED-IN USER
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      toast.error("User not logged in");
      return;
    }

    const userKey = `orders_${user.email}`;

    const order = {
      id: Date.now().toString(),
      userEmail: user.email, // 🔥 USER BINDING
      date: new Date().toLocaleString(),
      items: cart.map((item) => ({
        ...item,
        cancelled: false,
        statusIndex: 0, // 🔥 INITIAL STATUS
        lastStatusUpdate: Date.now(), // 🔥 TIME START
        stepDelay: 2 * 60 * 1000 + Math.floor(Math.random() * 60000), // 2–3 mins
      })),
    };

    // 🔥 LOAD USER-SPECIFIC ORDERS
    const existingOrders = JSON.parse(localStorage.getItem(userKey)) || [];

    // 🔥 SAVE USER-SPECIFIC ORDERS
    localStorage.setItem(userKey, JSON.stringify([...existingOrders, order]));

    clearCart();
    toast.success("🎉 Order placed successfully!");
  };

  return (
    <div className="cartPage" data-aos="fade-up">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table className="cartTable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="cartItem">
                    <img src={item.image} alt="" />
                    <div>{item.title}</div>
                  </td>

                  <td>₹{item.price}</td>

                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      min={1}
                      onChange={(e) =>
                        updateQty(item.id, Number(e.target.value))
                      }
                    />
                  </td>

                  <td>₹{item.price * item.qty}</td>

                  <td>
                    <button
                      className="delBtn"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cartSummary">
            <h3>Total: ₹{total}</h3>

            <button onClick={handleClear} className="clearBtn">
              Clear Cart
            </button>

            <button className="checkoutBtn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
