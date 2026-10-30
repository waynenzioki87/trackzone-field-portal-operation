const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");

router.use(authenticate);

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", authorize("Owner", "Admin", "Dispatcher"), createJob);
router.put("/:id", authorize("Owner", "Admin", "Dispatcher", "Technician"), updateJob);
router.delete("/:id", authorize("Owner", "Admin", "Dispatcher"), deleteJob);

module.exports = router;