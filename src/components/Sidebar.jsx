import {
  FaTachometerAlt,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen, toggleSidebar }) {
  const logout = () => {
    localStorage.removeItem("trackzone_token");
    localStorage.removeItem("trackzone_user");
    toggleSidebar();
  };
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");
  const isAdmin = user.role === "Owner" || user.role === "Admin";
  const isTechnician = user.role === "Technician";
  const dashboardPath = isAdmin ? "/admin" : isTechnician ? "/technician" : "/dispatcher";

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <h3 className="text-center text-white py-4 border-bottom">TrackZone</h3>

      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <NavLink
            to={dashboardPath}
            className="nav-link"
            onClick={toggleSidebar}
          >
            <FaTachometerAlt className="me-2" />
            Dashboard
          </NavLink>
        </li>

        {!isTechnician && (
        <li className="nav-item">
          <NavLink
            to="/create-job"
            className="nav-link"
            onClick={toggleSidebar}
          >
            <FaClipboardList className="me-2" />
            Create Job
          </NavLink>
        </li>
        )}

        <li className="nav-item">
          <NavLink to="/jobs" className="nav-link" onClick={toggleSidebar}>
            <FaClipboardList className="me-2" />
            View Jobs
          </NavLink>
        </li>
        {!isTechnician && <li className="nav-item">
          <NavLink
            to="/technician"
            className="nav-link"
            onClick={toggleSidebar}
          >
            <FaUsers className="me-2" />
            Technicians
          </NavLink>
        </li>}

        {!isTechnician && <li className="nav-item">
          <NavLink to="/reports" className="nav-link" onClick={toggleSidebar}>
            <FaChartBar className="me-2" />
            Reports
          </NavLink>
        </li>}

        <li className="nav-item">
          <NavLink to="/settings" className="nav-link" onClick={toggleSidebar}>
            <FaCog className="me-2" />
            Settings
          </NavLink>
        </li>

        <li className="nav-item mt-5">
          <NavLink
            to="/"
            className="nav-link text-danger"
            onClick={logout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
