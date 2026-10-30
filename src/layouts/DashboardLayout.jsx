import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="d-flex">

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main className="main-content flex-grow-1">
          {children}
        </main>

      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1040,
          }}
        ></div>
      )}
    </>
  );
}

export default DashboardLayout;