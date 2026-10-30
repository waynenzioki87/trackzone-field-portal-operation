import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";

function DispatcherDashboard() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => { axios.get("http://localhost:5000/api/jobs").then(({ data }) => setJobs(data)).catch(console.error); }, []);
  const count = (status) => jobs.filter((job) => job.status === status).length;
  const highPriority = jobs.filter((job) => job.priority === "High" || job.priority === "Critical").length;
  return <DashboardLayout><h2 className="mb-4">Dispatcher Dashboard</h2><div className="row g-4"><div className="col-md-6 col-xl-3"><DashboardCard title="Total Jobs" value={jobs.length} color="#2563EB" /></div><div className="col-md-6 col-xl-3"><DashboardCard title="Pending Jobs" value={count("Pending")} color="#F59E0B" /></div><div className="col-md-6 col-xl-3"><DashboardCard title="Completed" value={count("Completed")} color="#22C55E" /></div><div className="col-md-6 col-xl-3"><DashboardCard title="High Priority" value={highPriority} color="#EF4444" /></div></div></DashboardLayout>;
}
export default DispatcherDashboard;
