import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  FolderTree,
  DollarSign,
  CreditCard,
  FileText,
  Store,
  Factory,
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

  const menuGroups = [
    {
      title: "Main",
      items: [
        { path: "/admin/dashboard", name: "Dashboard", icon: LayoutDashboard, roles: ["farmer", "superadmin"] }
      ]
    },
    {
      title: "Vendor Management",
      items: [
        { path: "/admin/vendors", name: "All Vendors", icon: Store, roles: ["superadmin"] },
        // { path: "/admin/vendor-requests", name: "Vendor Requests", icon: UserPlus, roles: ["superadmin"] },
        // { path: "/admin/vendor-approvals", name: "Pending Approvals", icon: Clock, roles: ["superadmin"] },
        // { path: "/admin/vendor-stores", name: "Store Settings", icon: ShoppingBag, roles: ["superadmin"] },
        // { path: "/admin/commissions", name: "Commission Rates", icon: Percent, roles: ["superadmin"] },
      ]
    },
    {
      title: "Store Management",
      items: [
        { path: "/admin/products", name: "All Products", icon: Package, roles: ["farmer", "superadmin"] },
        { path: "/admin/orders", name: "All Orders", icon: ShoppingCart, roles: ["farmer", "superadmin"] },
        { path: "/admin/categories", name: "Categories", icon: FolderTree, roles: ["superadmin"] },
        { path: "/admin/production", name: "Inventory Management", icon: Factory, roles: ["farmer", "superadmin"] },
        // { path: "/admin/purchases", name: "Purchase Management", icon: TrendingUp, roles: ["admin", "superadmin"] },
        // { path: "/admin/sales", name: "Sales Management", icon: TrendingDown, roles: ["admin", "superadmin"] },
      ]
    },
    // {
    //   title: "Operations",
    //   items: [
    //     { path: "/admin/reviews", name: "Reviews", icon: Star, roles: ["admin", "superadmin"] },
    //     { path: "/admin/shipping", name: "Shipping", icon: Truck, roles: ["admin", "superadmin"] },
    //     { path: "/admin/disputes", name: "Disputes", icon: Shield, roles: ["superadmin"] },
    //   ]
    // },
    {
      title: "Financial",
      items: [
        { path: "/admin/payouts", name: "Vendor Payouts", icon: DollarSign, roles: ["superadmin"] },
        // { path: "/admin/transactions", name: "Transactions", icon: CreditCard, roles: ["superadmin"] },
        // { path: "/admin/reports", name: "Financial Reports", icon: FileText, roles: ["superadmin"] },
      ]
    },
    {
      title: "System",
      items: [
        { path: "/admin/settings", name: "Settings", icon: Settings, roles: ["admin", "superadmin"] },
      ]
    }
  ];

  // Filter items based on user role
  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(user?.role || "admin"))
  })).filter(group => group.items.length > 0);

  const handleLogout = async () => {
    await dispatch(LogoutUser());
    window.location.href = "/login";
  };

  // Format role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Superadmin";
      case "admin":
        return "Admin";
      default:
        return role;
    }
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
        className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 flex flex-col ${isMobile
          ? `${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64`
          : `${sidebarOpen ? "w-64" : "w-20"}`
          }`}
      >
        {/* Header Section with User Info */}
        <div className={`flex flex-col border-b ${!isMobile && !sidebarOpen ? "items-center" : ""}`}>
          <div className={`flex items-center justify-between p-4 w-full ${!isMobile && !sidebarOpen ? "justify-center" : ""}`}>
            {(!isMobile && sidebarOpen) || (isMobile && sidebarOpen) ? (
              <div className="pb-4 pt-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 text-sm truncate">
                      {user?.name || "Admin User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getRoleDisplayName(user?.role || "admin")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              !isMobile && !sidebarOpen && (
                <div className="py-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                </div>
              )
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
        </div>

        {/* Navigation Section with Groups */}
        <nav className="flex-1 overflow-y-auto py-4">
          {filteredMenuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {/* Group Title - Only show when sidebar is open */}
              {((!isMobile && sidebarOpen) || (isMobile && sidebarOpen)) && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.title}
                  </h3>
                </div>
              )}

              {/* Group Items */}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition ${isActive
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
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="border-t mt-auto">

          {/* Collapsed Footer Info */}
          {!isMobile && !sidebarOpen && (
            <div className="py-3 flex justify-center">
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            </div>
          )}

          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition ${!isMobile && !sidebarOpen ? "justify-center" : ""
                }`}
              title={!isMobile && !sidebarOpen ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5" />
              {((!isMobile && sidebarOpen) || (isMobile && sidebarOpen)) && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;