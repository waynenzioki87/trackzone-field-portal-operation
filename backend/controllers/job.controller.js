const Job = require("../models/Job.model");
const User = require("../models/User");
const { sendJobNotificationEmail } = require("../services/emailService");

const notifyAssignedTechnician = async (job) => {
  if (!job.assignedTechnician) return;
  const technician = await User.findOne({
    role: "Technician",
    $or: [{ name: job.assignedTechnician }, { email: job.assignedTechnician }],
  });
  if (technician?.email) await sendJobNotificationEmail({
    email: technician.email,
    name: technician.name,
    subject: "TrackZone job assignment",
    details: `Hello ${technician.name},\n\nYou have been assigned job ${job._id} for ${job.clientName}.\nLocation: ${job.town}, ${job.county}\nDevice: ${job.device}\nPriority: ${job.priority}\nStatus: ${job.status}`,
  });
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get one job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job
const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body };
    if (jobData.assignedTechnician) jobData.status = "Assigned";
    const job = await Job.create(jobData);

    await notifyAssignedTechnician(job);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a job by ID
const updateJob = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.assignedTechnician && updates.status === "Pending") {
      updates.status = "Assigned";
    }
    if (!updates.assignedTechnician && updates.status === "Assigned") {
      updates.status = "Pending";
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await notifyAssignedTechnician(job);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job by ID
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};