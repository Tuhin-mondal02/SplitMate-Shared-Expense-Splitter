import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Register() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      return setError("Please enter your name.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const { error } = await register(
        name.trim(),
        email.trim(),
        password
      );

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Please check your email for the confirmation link."
        );

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-logo">
          <Wallet size={32} />
        </div>

        <h1>Create Account</h1>
        <p>Start managing your shared expenses</p>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        {success && (
          <div className="auth-success">{success}</div>
        )}

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <div className="auth-input">
            <User size={20} />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label>Email Address</label>

          <div className="auth-input">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="auth-input">
            <Lock size={20} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label>Confirm Password</label>

          <div className="auth-input">
            <Lock size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </div>

      </div>
    </div>
  );
}