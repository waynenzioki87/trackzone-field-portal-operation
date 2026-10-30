import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

const emptyJob = { clientName: "", contactPerson: "", phone: "", county: "", town: "", device: "", issue: "", priority: "Medium", status: "Pending", assignedTechnician: "" };

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");
  const canManage = ["Owner", "Admin", "Dispatcher"].includes(user.role);

  const loadJobs = async () => {
    try { setJobs((await axios.get("http://localhost:5000/api/jobs")).data); }
    catch (error) { console.error("Error fetching jobs:", error); }
  };
  useEffect(() => {
    loadJobs();
    axios.get("http://localhost:5000/api/auth/technicians")
      .then(({ data }) => setTechnicians(data))
      .catch(console.error);
  }, []);

  const viewJob = (job) => window.alert(`Client: ${job.clientName}\nContact: ${job.contactPerson}\nPhone: ${job.phone}\nLocation: ${job.town}, ${job.county}\nDevice: ${job.device}\nIssue: ${job.issue}\nPriority: ${job.priority}\nStatus: ${job.status}\nTechnician: ${job.assignedTechnician || "Not Assigned"}`);

  const deleteJob = async (job) => {
    if (!window.confirm(`Delete job for ${job.clientName}? This cannot be undone.`)) return;
    try { await axios.delete(`http://localhost:5000/api/jobs/${job._id}`); setMessage("Job deleted successfully."); loadJobs(); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to delete job."); }
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/${editingJob._id}`, editingJob);
      setEditingJob(null); setMessage("Job updated successfully."); loadJobs();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to update job."); }
  };

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.clientName} ${job.contactPerson} ${job.phone} ${job.town} ${job.county} ${job.assignedTechnician || ""}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (!statusFilter || job.status === statusFilter) && (!priorityFilter || job.priority === priorityFilter);
  });

  return <DashboardLayout>
    <div className="card shadow-sm border-0"><div className="card-header bg-primary text-white"><h3 className="mb-0">Job Management</h3></div><div className="card-body">
      {message && <div className="alert alert-info py-2">{message}</div>}
      <div className="row g-2 mb-3"><div className="col-md-6"><input className="form-control" placeholder="Search client, location or technician" value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="col-md-3"><select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All statuses</option><option>Pending</option><option>Assigned</option><option>In Progress</option><option>Completed</option></select></div><div className="col-md-3"><select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div></div>
      <div className="table-responsive"><table className="table table-striped table-hover align-middle mb-0"><thead><tr><th>Client</th><th>Location</th><th>Technician</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredJobs.map((job) => <tr key={job._id}><td>{job.clientName}</td><td>{job.town}, {job.county}</td><td>{job.assignedTechnician || "Not Assigned"}</td><td>{job.priority}</td><td>{job.status}</td><td><div className="d-flex gap-2"><button className="btn btn-sm btn-primary" onClick={() => viewJob(job)}>View</button>{canManage && <><button className="btn btn-sm btn-warning" onClick={() => setEditingJob({ ...emptyJob, ...job })}>Edit</button><button className="btn btn-sm btn-danger" onClick={() => deleteJob(job)}>Delete</button></>}</div></td></tr>)}</tbody></table></div>
    </div></div>
    {editingJob && <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}><div className="modal-dialog modal-lg modal-dialog-scrollable"><div className="modal-content"><div className="modal-header"><h5>Edit Job</h5><div className="ms-auto me-2"><button type="submit" form="edit-job-form" className="btn btn-primary btn-sm">Save Changes</button></div><button className="btn-close" onClick={() => setEditingJob(null)} /></div><form id="edit-job-form" onSubmit={saveEdit}><div className="modal-body"><div className="row"><div className="col-md-6 mb-3"><label className="form-label">Client Name</label><input className="form-control" value={editingJob.clientName} onChange={(e) => setEditingJob({ ...editingJob, clientName: e.target.value })} required /></div><div className="col-md-6 mb-3"><label className="form-label">Contact Person</label><input className="form-control" value={editingJob.contactPerson} onChange={(e) => setEditingJob({ ...editingJob, contactPerson: e.target.value })} required /></div><div className="col-md-6 mb-3"><label className="form-label">Phone</label><input className="form-control" value={editingJob.phone} onChange={(e) => setEditingJob({ ...editingJob, phone: e.target.value })} required /></div><div className="col-md-3 mb-3"><label className="form-label">County</label><input className="form-control" value={editingJob.county} onChange={(e) => setEditingJob({ ...editingJob, county: e.target.value })} required /></div><div className="col-md-3 mb-3"><label className="form-label">Town</label><input className="form-control" value={editingJob.town} onChange={(e) => setEditingJob({ ...editingJob, town: e.target.value })} required /></div><div className="col-md-6 mb-3"><label className="form-label">Device</label><input className="form-control" value={editingJob.device} onChange={(e) => setEditingJob({ ...editingJob, device: e.target.value })} required /></div><div className="col-md-6 mb-3"><label className="form-label">Technician</label><select className="form-select" value={editingJob.assignedTechnician || ""} onChange={(e) => setEditingJob({ ...editingJob, assignedTechnician: e.target.value })}><option value="">Not assigned</option>{technicians.map((technician) => <option key={technician._id} value={technician.name}>{technician.name}</option>)}</select></div><div className="col-md-6 mb-3"><label className="form-label">Priority</label><select className="form-select" value={editingJob.priority} onChange={(e) => setEditingJob({ ...editingJob, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div><div className="col-md-6 mb-3"><label className="form-label">Status</label><select className="form-select" value={editingJob.status} onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })}><option>Pending</option><option>Assigned</option><option>In Progress</option><option>Completed</option></select></div><div className="col-12 mb-3"><label className="form-label">Issue</label><textarea className="form-control" rows="3" value={editingJob.issue} onChange={(e) => setEditingJob({ ...editingJob, issue: e.target.value })} required /></div></div></div><div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setEditingJob(null)}>Cancel</button><button className="btn btn-primary">Save Changes</button></div></form></div></div></div>}
  </DashboardLayout>;
}
export default Jobs;
