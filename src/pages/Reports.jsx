import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";

function Reports() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => { axios.get("http://localhost:5000/api/jobs").then(({ data }) => setJobs(data)).catch(console.error); }, []);
  const count = (status) => jobs.filter((job) => job.status === status).length;
  const priorities = ["Critical", "High", "Medium", "Low"];
  const completionRate = jobs.length ? Math.round((count("Completed") / jobs.length) * 100) : 0;
  const downloadCsv = () => {
    const rows = [["Client", "Location", "Technician", "Priority", "Status"], ...jobs.map((job) => [job.clientName, `${job.town}, ${job.county}`, job.assignedTechnician || "", job.priority, job.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "trackzone-jobs-report.csv"; link.click(); URL.revokeObjectURL(link.href);
  };
  return <DashboardLayout>
    <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="mb-0">Reports</h2><button className="btn btn-outline-primary" onClick={downloadCsv}>Download CSV</button></div>
    <div className="row g-3 mb-4"><div className="col-sm-6 col-xl"><DashboardCard title="Total Jobs" value={jobs.length} color="#2563EB" /></div><div className="col-sm-6 col-xl"><DashboardCard title="Pending" value={count("Pending")} color="#F59E0B" /></div><div className="col-sm-6 col-xl"><DashboardCard title="Assigned" value={count("Assigned")} color="#8B5CF6" /></div><div className="col-sm-6 col-xl"><DashboardCard title="In Progress" value={count("In Progress")} color="#0EA5E9" /></div><div className="col-sm-6 col-xl"><DashboardCard title="Completed" value={count("Completed")} color="#22C55E" /></div></div>
    <div className="row g-3 mb-4"><div className="col-md-6"><DashboardCard title="Completion Rate" value={`${completionRate}%`} color="#14B8A6" /></div><div className="col-md-6"><DashboardCard title="High Priority" value={jobs.filter((job) => job.priority === "High" || job.priority === "Critical").length} color="#EF4444" /></div></div>
    <div className="card shadow-sm border-0"><div className="card-header bg-white"><h5 className="mb-0">Jobs by priority</h5></div><div className="card-body"><table className="table mb-0"><thead><tr><th>Priority</th><th>Jobs</th></tr></thead><tbody>{priorities.map((priority) => <tr key={priority}><td>{priority}</td><td>{jobs.filter((job) => job.priority === priority).length}</td></tr>)}</tbody></table></div></div>
  </DashboardLayout>;
}
export default Reports;
