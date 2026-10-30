import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DispatcherDashboard from "./pages/DispatcherDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import CreateJob from "./pages/CreateJob";
import Jobs from "./pages/Jobs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dispatcher" element={<ProtectedRoute roles={["Dispatcher", "Owner", "Admin"]}><DispatcherDashboard /></ProtectedRoute>} />
      <Route path="/technician" element={<ProtectedRoute><TechnicianDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={["Owner", "Admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/create-job" element={<ProtectedRoute roles={["Owner", "Admin", "Dispatcher"]}><CreateJob /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute roles={["Owner", "Admin", "Dispatcher"]}><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/not-authorized" element={<div className="container mt-5"><h2>Access denied</h2><p>Your account does not have permission to open this page.</p></div>} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;