import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Layers,
  Settings,
  LogOut,
  BarChart3,
  Star,
  Truck,
  ChevronLeft,
  ChevronRight,
  X,
  Boxes,
  FolderTree,
  Grid3x3,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { LogoutUser } from "../../features/auth/AuthApi";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isMobile }: AdminSidebarProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const menuItems = [
    { path: "/admin", name: "Dashboard", icon: LayoutDashboard, roles: ["admin", "super_admin"] },
    { path: "/admin/products", name: "Products", icon: Package, roles: ["admin", "super_admin"] },
    { path: "/admin/orders", name: "Orders", icon: ShoppingCart, roles: ["admin", "super_admin"] },
    { path: "/admin/users", name: "Users", icon: Users, roles: ["super_admin"] },
    { path: "/admin/categories", name: "Categories", icon: FolderTree, roles: ["admin", "super_admin"] },
    { path: "/admin/brands", name: "Brands", icon: Tags, roles: ["admin", "super_admin"] },
    { path: "/admin/analytics", name: "Analytics", icon: BarChart3, roles: ["admin", "super_admin"] },
    { path: "/admin/reviews", name: "Reviews", icon: Star, roles: ["admin", "super_admin"] },
    { path: "/admin/shipping", name: "Shipping", icon: Truck, roles: ["admin", "super_admin"] },
    { path: "/admin/settings", name: "Settings", icon: Settings, roles: ["admin", "super_admin"] },
  ];


  const handleLogout = async () => {
    await dispatch(LogoutUser());
    window.location.href = "/login";
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 ${
          isMobile 
            ? `${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64`
            : `${sidebarOpen ? "w-64" : "w-20"}`
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-between p-4 border-b ${!isMobile && !sidebarOpen ? "justify-center" : ""}`}>
            {(!isMobile && sidebarOpen) || (isMobile && sidebarOpen) ? (
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-green-600" />
                <span className="font-bold text-xl text-gray-800">AdminPanel</span>
              </div>
            ) : (
              !isMobile && !sidebarOpen && <Package className="w-8 h-8 text-green-600" />
            )}
            
            <div className="flex items-center gap-2">
              {isMobile && sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
              {!isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition"
                >
                  {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition ${
                        isActive
                          ? "bg-gradient-to-r from-green-50 to-green-100 text-green-600"
                          : "text-gray-600 hover:bg-gray-50"
                      } ${!isMobile && !sidebarOpen ? "justify-center" : ""}`
                    }
                    title={!isMobile && !sidebarOpen ? item.name : ""}
                  >
                    <item.icon className="w-5 h-5" />
                    {((!isMobile && sidebarOpen) || (isMobile && sidebarOpen)) && (
                      <span className="text-sm">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition ${
                !isMobile && !sidebarOpen ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-5 h-5" />
              {((!isMobile && sidebarOpen) || (isMobile && sidebarOpen)) && (
                <span className="text-sm">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;