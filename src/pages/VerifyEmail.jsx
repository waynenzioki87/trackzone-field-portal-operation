import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, message: "", success: false });
  useEffect(() => {
    axios.get(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then((response) => setState({ loading: false, message: response.data.message, success: true }))
      .catch((error) => setState({ loading: false, message: error.response?.data?.message || "Verification failed.", success: false }));
  }, [token]);
  return <div className="d-flex justify-content-center align-items-center vh-100 bg-light"><div className="card shadow p-4 text-center" style={{ maxWidth: 480 }}><h2>Email verification</h2>{state.loading ? <p>Verifying...</p> : <div className={`alert ${state.success ? "alert-success" : "alert-danger"}`}>{state.message}</div>}<Link className="btn btn-primary" to="/">Continue to login</Link></div></div>;
}
export default VerifyEmail;
