import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email ❗", {
        style: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px" },
      });
      return;
    }

    toast.success(`Subscribed successfully! 🎉`, {
      style: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px" },
    });

    setEmail(""); // CLEAR INPUT FIELD
  };

  return (
    <footer className="footerContainer">
      <div className="footerTop">
        <div className="footerColumn">
          <h3>Flipkart Lite</h3>
          <p>Your trusted shopping partner. Best deals • Fast delivery • Secure payments.</p>
        </div>

        <div className="footerColumn">
          <h4>Customer Service</h4>
          <ul>
            <li>Help Center</li>
            <li>Track Order</li>
            <li>Returns & Refunds</li>
            <li>Shipping Info</li>
            <li>Report Issue</li>
          </ul>
        </div>

        <div className="footerColumn">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>Flipkart Stories</li>
          </ul>
        </div>

        <div className="footerColumn">
          <h4>Legal</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund Policy</li>
            <li>Security</li>
          </ul>
        </div>

        <div className="footerColumn">
          <h4>Stay Updated</h4>

          <div className="emailSubscribe">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}                // controlled input
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>Subscribe</button>
          </div>

          <div className="social">
            <span>🌐</span>
            <span>📘</span>
            <span>🐦</span>
            <span>📸</span>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        © {new Date().getFullYear()} Flipkart Lite • All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
