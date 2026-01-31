import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/login", form);
      const res = await API.get("/auth/me");
      setUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <div className="error">{error}</div>}

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
