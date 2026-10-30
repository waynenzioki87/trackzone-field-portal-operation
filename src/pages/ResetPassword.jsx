import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to reset password.");
    }
  };

  return <div className="d-flex justify-content-center align-items-center vh-100 bg-light"><div className="card shadow p-4" style={{ width: 420 }}><h3 className="mb-3">Reset password</h3>{message && <div className={`alert ${success ? "alert-success" : "alert-danger"}`}>{message}</div>}<form onSubmit={submit}><div className="mb-3"><label className="form-label">New password</label><input className="form-control" type="password" minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><div className="mb-3"><label className="form-label">Confirm password</label><input className="form-control" type="password" minLength="8" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div><button className="btn btn-primary w-100" disabled={success}>Reset password</button></form>{success && <Link className="btn btn-link w-100 mt-2" to="/">Continue to login</Link>}</div></div>;
}
export default ResetPassword;
