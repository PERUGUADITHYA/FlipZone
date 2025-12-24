import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Auth.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);

  // 🔥 Forgot password states
  const [forgot, setForgot] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      toast.error("Invalid email or password ❌");
      return;
    }

    setUser(found);
    toast.success("Login successful 🎉");
    navigate("/");
  };

  /* ================= SEND VERIFICATION ================= */
  const sendVerification = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find((u) => u.email === email);

    if (!found) {
      toast.error("Email not registered ❌");
      return;
    }

    toast.success("Verification email sent 📩 (demo)");
    setEmailSent(true);
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = () => {
    if (newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPass !== rePass) {
      toast.error("Passwords do not match ❌");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === email ? { ...u, password: newPass } : u
    );

    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Password reset successful 🔐");
    setForgot(false);
    setEmailSent(false);
    setNewPass("");
    setRePass("");
  };

  return (
    <div className="authContainer">
      {/* BACKGROUND */}
      <div className="authLeft">
        <div
          className="authLeftBackground"
          style={{
            backgroundImage:
              "url('https://t3.ftcdn.net/jpg/03/91/46/10/360_F_391461057_5P0BOWl4lY442Zoo9rzEeJU0S2c1WDZR.jpg')",
          }}
        />
      </div>

      {/* FORM */}
      <div className="authRight">
        <div className="authCard">
          <h2>{forgot ? "Reset Password" : "Login"}</h2>

          {/* EMAIL */}
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* LOGIN PASSWORD */}
          {!forgot && (
            <div className="inputGroup">
              <label>Password</label>
              <div className="passwordWrapper">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPass ? (
                  <AiOutlineEyeInvisible onClick={() => setShowPass(false)} />
                ) : (
                  <AiOutlineEye onClick={() => setShowPass(true)} />
                )}
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD FLOW */}
          {forgot && !emailSent && (
            <button onClick={sendVerification}>Send Verification</button>
          )}

          {forgot && emailSent && (
            <>
              <div className="inputGroup">
                <label>New Password</label>
                <div className="passwordWrapper">
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  {showNewPass ? (
                    <AiOutlineEyeInvisible
                      onClick={() => setShowNewPass(false)}
                    />
                  ) : (
                    <AiOutlineEye onClick={() => setShowNewPass(true)} />
                  )}
                </div>
              </div>

              <div className="inputGroup">
                <label>Re-enter Password</label>
                <div className="passwordWrapper">
                  <input
                    type={showRePass ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={rePass}
                    onChange={(e) => setRePass(e.target.value)}
                  />
                  {showRePass ? (
                    <AiOutlineEyeInvisible
                      onClick={() => setShowRePass(false)}
                    />
                  ) : (
                    <AiOutlineEye onClick={() => setShowRePass(true)} />
                  )}
                </div>
              </div>

              <button onClick={resetPassword}>Reset Password</button>
            </>
          )}

          {/* ACTION BUTTONS */}
          {!forgot && <button onClick={handleLogin}>Login</button>}

          {!forgot ? (
            <>
              <p className="forgot" onClick={() => setForgot(true)}>
                Forgot password?
              </p>
              <p>
                New user? <Link to="/register">Register here</Link>
              </p>
            </>
          ) : (
            <p className="forgot" onClick={() => setForgot(false)}>
              Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
