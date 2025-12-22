import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Auth.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name || !email || !password) {
      toast.error("All fields required ❗");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) {
      toast.error("User already exists ❌");
      return;
    }

    const newUser = { name, email, password };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    toast.success("Registered successfully 🎉");
    navigate("/login"); // navigate to login
  };

  return (
    <div className="authContainer">
      {/* BACKGROUND */}
      <div className="authLeft">
        <div
          className="authLeftBackground"
          style={{
            backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwp1PmTtxJpPLMquLg56NwMdPFd3tU9At32g&s')`,
          }}
        />
      </div>

      {/* REGISTER FORM CENTERED */}
      <div className="authRight">
        <div className="authCard">
          <h2>Register</h2>
          <div className="inputGroup">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label>Password</label>
            <div className="passwordWrapper">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPass ? (
                <AiOutlineEyeInvisible
                  size={22}
                  onClick={() => setShowPass(false)}
                />
              ) : (
                <AiOutlineEye size={22} onClick={() => setShowPass(true)} />
              )}
            </div>
          </div>

          <button onClick={handleRegister}>Register</button>
          <p>
            Already have account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
