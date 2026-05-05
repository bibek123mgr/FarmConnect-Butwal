import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./components/includes/AdminHeader";
import AdminSidebar from "./components/includes/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
      
      {/* Main content - proper spacing for mobile and desktop */}
      <div 
        className={`transition-all duration-300 ${
          !isMobile && sidebarOpen ? "lg:ml-64" : !isMobile && !sidebarOpen ? "lg:ml-20" : ""
        }`}
      >
        <main className="p-4 md:p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;