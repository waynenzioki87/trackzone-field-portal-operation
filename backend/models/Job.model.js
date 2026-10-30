const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },

    contactPerson: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    county: {
    type: String,
    required: true,
    },

    town: {
    type: String,
    required: true,
    },

    device: {
      type: String,
      required: true,
    },

    issue: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Progress",
        "Completed",
      ],
      default: "Pending",
    },

    assignedTechnician: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);