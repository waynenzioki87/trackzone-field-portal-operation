import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");

  const loadJobs = () => {
    axios.get("http://localhost:5000/api/jobs")
      .then(({ data }) => setJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadJobs, []);

  const count = (status) => jobs.filter((job) => job.status === status).length;
  const critical = jobs.filter((job) => job.priority === "Critical" || job.priority === "High").length;
  const technicians = new Set(jobs.map((job) => job.assignedTechnician).filter(Boolean)).size;
  const completionRate = jobs.length ? Math.round((count("Completed") / jobs.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="mb-1">{user.role === "Owner" ? "Owner Dashboard" : "Admin Dashboard"}</h2><p className="text-muted mb-0">Live operations overview</p></div>
        <button className="btn btn-outline-primary" onClick={loadJobs}>Refresh</button>
      </div>
      {loading ? <p>Loading dashboard...</p> : <>
        <div className="row g-3">
          <div className="col-sm-6 col-xl"><DashboardCard title="Total Jobs" value={jobs.length} color="#2563EB" /></div>
          <div className="col-sm-6 col-xl"><DashboardCard title="Pending" value={count("Pending")} color="#F59E0B" /></div>
          <div className="col-sm-6 col-xl"><DashboardCard title="In Progress" value={count("In Progress")} color="#0EA5E9" /></div>
          <div className="col-sm-6 col-xl"><DashboardCard title="Completed" value={count("Completed")} color="#22C55E" /></div>
          <div className="col-sm-6 col-xl"><DashboardCard title="High Priority" value={critical} color="#EF4444" /></div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-md-4"><DashboardCard title="Technicians" value={technicians} color="#8B5CF6" /></div>
          <div className="col-md-4"><DashboardCard title="Completion Rate" value={`${completionRate}%`} color="#14B8A6" /></div>
          <div className="col-md-4"><DashboardCard title="Assigned Jobs" value={jobs.filter((job) => job.assignedTechnician).length} color="#F97316" /></div>
        </div>
        <div className="card border-0 shadow-sm mt-4"><div className="card-header bg-white"><h5 className="mb-0">Recent jobs</h5></div><div className="table-responsive"><table className="table table-hover mb-0"><thead><tr><th>Client</th><th>Technician</th><th>Priority</th><th>Status</th></tr></thead><tbody>{jobs.slice(0, 8).map((job) => <tr key={job._id}><td>{job.clientName}</td><td>{job.assignedTechnician || "Not assigned"}</td><td>{job.priority}</td><td>{job.status}</td></tr>)}</tbody></table></div></div>
      </>}
    </DashboardLayout>
  );
}
export default AdminDashboard;
