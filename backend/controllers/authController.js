const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../services/emailService");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const issueVerification = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationTokenHash = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();
  return sendVerificationEmail({ email: user.email, name: user.name, token });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "An account with this email already exists" });
    const allowedRegistrationRoles = ["Dispatcher", "Technician"];
    const registrationRole = allowedRegistrationRoles.includes(role) ? role : "Technician";
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 10), role: registrationRole });
    const verification = await issueVerification(user);
    res.status(201).json({
      message: "Account created. Check your email to verify it.",
      verificationUrl: process.env.NODE_ENV === "production" ? undefined : verification.verificationUrl,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isEmailVerified) return res.status(403).json({ message: "Please verify your email before logging in", code: "EMAIL_NOT_VERIFIED" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const tokenHash = hashToken(req.params.token);
  const user = await User.findOne({ emailVerificationTokenHash: tokenHash, emailVerificationExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ message: "Verification link is invalid or has expired" });
  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.json({ message: "Email verified successfully. You can now log in." });
};

const resendVerificationEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
  if (!user) return res.status(404).json({ message: "No account found for this email" });
  if (user.isEmailVerified) return res.status(400).json({ message: "This email is already verified" });
  await issueVerification(user);
  res.json({ message: "A new verification email has been sent" });
};

const forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const user = await User.findOne({ email });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = hashToken(token);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail({ email: user.email, name: user.name, token });
  }
  res.json({ message: "If an account exists for that email, a password-reset link has been sent." });
};

const resetPassword = async (req, res) => {
  if (!req.body.password || req.body.password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
  const user = await User.findOne({ passwordResetTokenHash: hashToken(req.params.token), passwordResetExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired" });
  user.password = await bcrypt.hash(req.body.password, 10);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successfully. You can now log in." });
};

const listTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: "Technician" })
      .select("name email isEmailVerified createdAt")
      .sort({ name: 1 });
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: "Unable to load technicians", error: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, listTechnicians };
