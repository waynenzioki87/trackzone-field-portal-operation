import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaUserCircle, FaTruckMoving, FaBars } from "react-icons/fa";

function Navbar({ toggleSidebar }) {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");
  useEffect(() => { axios.get("http://localhost:5000/api/jobs").then(({ data }) => setJobs(data)).catch(console.error); }, []);
  const relevant = jobs.filter((job) => user.role === "Technician" ? job.assignedTechnician?.toLowerCase() === user.name?.toLowerCase() : true).slice(0, 5);
  return <nav className="navbar navbar-expand-lg bg-white shadow-sm px-3 py-3"><div className="container-fluid"><div className="d-flex align-items-center"><button className="btn btn-outline-primary me-3 d-lg-none" onClick={toggleSidebar}><FaBars /></button><FaTruckMoving size={32} color="#2563EB" className="me-2"/><h4 className="mb-0 fw-bold text-primary">TrackZone</h4></div><div className="d-flex align-items-center"><div className="position-relative me-4"><button className="btn btn-link text-secondary p-0" onClick={() => setOpen(!open)} aria-label="Notifications"><FaBell size={22}/>{relevant.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{relevant.length}</span>}</button>{open && <div className="card shadow position-absolute end-0 mt-2" style={{ width: 320, zIndex: 1100 }}><div className="card-header fw-semibold">Notifications</div><div className="list-group list-group-flush">{relevant.length === 0 ? <div className="list-group-item text-muted">No recent notifications</div> : relevant.map((job) => <div className="list-group-item" key={job._id}><strong>{job.clientName}</strong><div className="small text-muted">{job.status} - {job.priority} priority</div></div>)}</div></div>}</div><div className="d-flex align-items-center"><FaUserCircle size={35} className="text-primary me-2"/><span className="fw-semibold">{user.name || "User"}</span></div></div></div></nav>;
}
export default Navbar;
