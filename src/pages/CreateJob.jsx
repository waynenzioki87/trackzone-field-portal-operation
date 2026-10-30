import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

function CreateJob() {
  const [technicians, setTechnicians] = useState([]);
  const [job, setJob] = useState({
    clientName: "",
    contactPerson: "",
    phone: "",
    county: "",
    town: "",
    device: "",
    issue: "",
    priority: "Medium",
    assignedTechnician: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/technicians")
      .then(({ data }) => setTechnicians(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const selectedTechnician = technicians.find(
    (technician) => technician.name === job.assignedTechnician
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/jobs", {
        ...job,
        status: job.assignedTechnician ? "Assigned" : "Pending",
      });

      alert("✅ Job Created Successfully!");

      console.log(response.data);

      setJob({
        clientName: "",
        contactPerson: "",
        phone: "",
        county: "",
        town: "",
        device: "",
        issue: "",
        priority: "Medium",
        assignedTechnician: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create job.");
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Create New Job</h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Client Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="clientName"
                    value={job.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Contact Person */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPerson"
                    value={job.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={job.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* County */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">County</label>

                  <select
                    className="form-select"
                    name="county"
                    value={job.county}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select County</option>

                    <option>Nairobi</option>
                    <option>Kiambu</option>
                    <option>Machakos</option>
                    <option>Kajiado</option>
                    <option>Nakuru</option>
                    <option>Uasin Gishu</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Kilifi</option>
                    <option>Nyeri</option>
                    <option>Meru</option>
                    <option>Embu</option>
                    <option>Kitui</option>
                    <option>Kakamega</option>
                    <option>Bungoma</option>
                    <option>Kisii</option>
                    <option>Kericho</option>
                    <option>Narok</option>
                    <option>Garissa</option>
                    <option>Isiolo</option>
                  </select>
                </div>

                {/* Town */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Town</label>

                  <select
                    className="form-select"
                    name="town"
                    value={job.town}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Town</option>

                    <option>Nairobi CBD</option>
                    <option>Westlands</option>
                    <option>Karen</option>
                    <option>Embakasi</option>
                    <option>Thika</option>
                    <option>Ruiru</option>
                    <option>Juja</option>
                    <option>Kiambu Town</option>
                    <option>Kitengela</option>
                    <option>Athi River</option>
                    <option>Machakos Town</option>
                    <option>Nakuru Town</option>
                    <option>Naivasha</option>
                    <option>Eldoret</option>
                    <option>Kisumu City</option>
                    <option>Mombasa CBD</option>
                    <option>Nyali</option>
                    <option>Likoni</option>
                    <option>Malindi</option>
                    <option>Kilifi Town</option>
                  </select>
                </div>

                {/* Device */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Device Type</label>

                  <select
                    className="form-select"
                    name="device"
                    value={job.device}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Device</option>

                    <option>GPS Tracker</option>
                    <option>Dash Camera</option>
                    <option>Fuel Sensor</option>
                    <option>Speed Governor</option>
                    <option>Immobilizer</option>
                    <option>Temperature Sensor</option>
                    <option>Telematics Unit</option>
                    <option>Panic Button</option>
                    <option>RFID Reader</option>
                    <option>OBD Tracker</option>
                    <option>Asset Tracker</option>
                    <option>Driver ID Reader</option>
                    <option>Battery Monitor</option>
                    <option>Camera System</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    name="priority"
                    value={job.priority}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                {/* Issue */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Issue Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="issue"
                    value={job.issue}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Technician */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">Assign Technician</label>
                  <select
                    className="form-select"
                    name="assignedTechnician"
                    value={job.assignedTechnician}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Technician</option>
                    {technicians.map((technician) => (
                      <option key={technician._id} value={technician.name}>
                        {technician.name} — {technician.email}
                      </option>
                    ))}
                  </select>
                  {selectedTechnician && (
                    <div className="border rounded bg-light p-3 mt-2">
                      <div className="fw-semibold mb-1">Selected technician</div>
                      <div>{selectedTechnician.name}</div>
                      <small className="text-muted d-block">{selectedTechnician.email}</small>
                      <small className={selectedTechnician.isEmailVerified ? "text-success" : "text-warning"}>
                        {selectedTechnician.isEmailVerified ? "Email verified" : "Email not verified"}
                      </small>
                      <div className="small mt-2">
                        This technician will receive the job in their dashboard and an assignment email.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateJob;
