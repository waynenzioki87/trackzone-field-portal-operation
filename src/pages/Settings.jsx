import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function Settings() {
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem("trackzone_settings") || "{\"emailNotifications\":true,\"jobAlerts\":true,\"timezone\":\"Africa/Nairobi\"}"));
  const [saved, setSaved] = useState(false);
  const update = (event) => { const value = event.target.type === "checkbox" ? event.target.checked : event.target.value; setSettings({ ...settings, [event.target.name]: value }); setSaved(false); };
  const save = (event) => { event.preventDefault(); localStorage.setItem("trackzone_settings", JSON.stringify(settings)); setSaved(true); };
  return <DashboardLayout><h2 className="mb-4">Settings</h2><div className="row g-4"><div className="col-lg-5"><div className="card shadow-sm border-0"><div className="card-body"><h5>Account</h5><p className="mb-1"><strong>{user.name || "User"}</strong></p><p className="text-muted mb-1">{user.email || ""}</p><span className="badge bg-primary">{user.role || "User"}</span></div></div></div><div className="col-lg-7"><div className="card shadow-sm border-0"><div className="card-body"><h5 className="mb-3">Preferences</h5>{saved && <div className="alert alert-success py-2">Settings saved.</div>}<form onSubmit={save}><div className="form-check form-switch mb-3"><input className="form-check-input" type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={update}/><label className="form-check-label">Email notifications</label></div><div className="form-check form-switch mb-3"><input className="form-check-input" type="checkbox" name="jobAlerts" checked={settings.jobAlerts} onChange={update}/><label className="form-check-label">Job status alerts</label></div><label className="form-label">Timezone</label><select className="form-select mb-3" name="timezone" value={settings.timezone} onChange={update}><option>Africa/Nairobi</option><option>UTC</option><option>Africa/Johannesburg</option></select><button className="btn btn-primary">Save settings</button></form></div></div></div></div></DashboardLayout>;
}
export default Settings;


