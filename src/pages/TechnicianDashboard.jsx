import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";

function TechnicianDashboard() {
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");
  const isTechnician = user.role === "Technician";
  const [jobs, setJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [jobResponse, technicianResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/jobs"),
        axios.get("http://localhost:5000/api/auth/technicians")
      ]);
      setJobs(jobResponse.data);
      setTechnicians(technicianResponse.data);
    } catch (error) { console.error(error); }
  };
  useEffect(() => { loadData(); }, []);

  const assignedJobs = jobs.filter((job) => job.assignedTechnician && (
    job.assignedTechnician.toLowerCase() === user.name?.toLowerCase() || job.assignedTechnician.toLowerCase() === user.email?.toLowerCase()
  ));

  const updateStatus = async (id, status) => {
    try { await axios.put(`http://localhost:5000/api/jobs/${id}`, { status }); setMessage("Job status updated."); loadData(); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to update job."); }
  };

  if (!isTechnician) {
    return <DashboardLayout><h2 className="mb-4">Technicians</h2>{message && <div className="alert alert-info">{message}</div>}<div className="row g-3 mb-4"><div className="col-md-4"><DashboardCard title="Registered Technicians" value={technicians.length} color="#2563EB" /></div><div className="col-md-4"><DashboardCard title="Assigned Jobs" value={jobs.filter((job) => job.assignedTechnician).length} color="#F59E0B" /></div><div className="col-md-4"><DashboardCard title="Active Assignments" value={jobs.filter((job) => job.assignedTechnician && job.status !== "Completed").length} color="#22C55E" /></div></div>{technicians.length === 0 ? <div className="alert alert-light">No technician accounts have been registered yet.</div> : <div className="row g-3">{technicians.map((technician) => { const assigned = jobs.filter((job) => job.assignedTechnician?.toLowerCase() === technician.name.toLowerCase() || job.assignedTechnician?.toLowerCase() === technician.email.toLowerCase()); return <div className="col-md-6 col-xl-4" key={technician._id}><div className="card shadow-sm border-0 h-100"><div className="card-body"><h5>{technician.name}</h5><p className="mb-1">{technician.email}</p><span className={`badge ${technician.isEmailVerified ? "bg-success" : "bg-warning text-dark"}`}>{technician.isEmailVerified ? "Email verified" : "Not verified"}</span><hr /><p className="mb-1">{assigned.length} total jobs</p><p className="mb-0 text-muted">{assigned.filter((job) => job.status !== "Completed").length} active jobs</p></div></div></div>; })}</div>}</DashboardLayout>;
  }

  return <DashboardLayout><h2 className="mb-4">My Technician Dashboard</h2>{message && <div className="alert alert-info py-2">{message}</div>}<div className="row g-3 mb-4"><div className="col-md-4"><DashboardCard title="Assigned to Me" value={assignedJobs.length} color="#2563EB" /></div><div className="col-md-4"><DashboardCard title="Active Jobs" value={assignedJobs.filter((job) => job.status !== "Completed").length} color="#F59E0B" /></div><div className="col-md-4"><DashboardCard title="Completed" value={assignedJobs.filter((job) => job.status === "Completed").length} color="#22C55E" /></div></div>{assignedJobs.length === 0 ? <div className="alert alert-light">No jobs are assigned to your account yet.</div> : assignedJobs.map((job) => <div className="card border-0 shadow-sm mb-3" key={job._id}><div className="card-body"><div className="d-flex justify-content-between flex-wrap"><div><h5>{job.clientName}</h5><p className="mb-1">{job.device} - {job.town}, {job.county}</p><p className="text-muted mb-2">{job.issue}</p></div><span className="badge bg-primary">{job.status}</span></div><div className="d-flex gap-2 flex-wrap"><button className="btn btn-sm btn-outline-primary" disabled={job.status !== "Pending"} onClick={() => updateStatus(job._id, "Assigned")}>Mark Assigned</button><button className="btn btn-sm btn-outline-warning" disabled={job.status === "In Progress" || job.status === "Completed"} onClick={() => updateStatus(job._id, "In Progress")}>Start Job</button><button className="btn btn-sm btn-success" disabled={job.status === "Completed"} onClick={() => updateStatus(job._id, "Completed")}>Complete Job</button></div></div></div>)}</DashboardLayout>;
}
export default TechnicianDashboard;
