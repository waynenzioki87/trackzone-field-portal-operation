import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserShield } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/auth";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Dispatcher" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (mode === "register") {
        const response = await axios.post(`${API_URL}/register`, form);
        setMessage("Account created. Check your email and verify your address before logging in.");
        if (response.data.verificationUrl) {
          setMessage(`Account created. Open this presentation verification link: ${response.data.verificationUrl}`);
        }
        setMode("login");
      } else {
        const response = await axios.post(`${API_URL}/login`, form);
        localStorage.setItem("trackzone_token", response.data.token);
        localStorage.setItem("trackzone_user", JSON.stringify(response.data.user));
        const role = response.data.user.role;
        navigate(role === "Technician" ? "/technician" : role === "Admin" || role === "Owner" ? "/admin" : "/dispatcher");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to complete the request.");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!form.email) {
      setMessage("Enter your email address first.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email: form.email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to request a password reset.");
    }
  };

  const resend = async () => {
    try {
      const response = await axios.post(`${API_URL}/resend-verification`, { email: form.email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to resend verification email.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px", borderRadius: "15px" }}>
        <div className="text-center mb-4"><FaUserShield size={50} className="text-primary" /><h2 className="mt-3">TrackZone Dispatch Portal</h2></div>
        {message && <div className="alert alert-info py-2">{message}</div>}
        <form onSubmit={submit}>
          {mode === "register" && <div className="mb-3"><label className="form-label">Full name</label><input className="form-control" name="name" value={form.name} onChange={update} required /></div>}
          <div className="mb-3"><label className="form-label">Email address</label><input type="email" className="form-control" name="email" value={form.email} onChange={update} required /></div>
          <div className="mb-3"><label className="form-label">Password</label><input type="password" className="form-control" name="password" value={form.password} onChange={update} minLength={mode === "register" ? 8 : undefined} required /></div>
          {mode === "register" && <div className="mb-3"><label className="form-label">Role</label><select className="form-select" name="role" value={form.role} onChange={update}><option>Dispatcher</option><option>Technician</option></select></div>}
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</button>
        </form>
        {mode === "login" && <div className="d-flex justify-content-between"><button type="button" className="btn btn-link btn-sm mt-2" onClick={forgotPassword}>Forgot password?</button><button type="button" className="btn btn-link btn-sm mt-2" onClick={resend}>Resend verification email</button></div>}
        <button className="btn btn-link w-100 mt-2" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>{mode === "login" ? "Create an account" : "Already have an account? Login"}</button>
      </div>
    </div>
  );
}
export default Login;
