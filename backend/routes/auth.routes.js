const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  listTechnicians,
} = require("../controllers/authController");

const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/technicians", authenticate, authorize("Owner", "Admin", "Dispatcher", "Technician"), listTechnicians);

module.exports = router;