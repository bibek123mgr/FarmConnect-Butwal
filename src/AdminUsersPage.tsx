// AdminUsersPage.tsx
import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  User as UserIcon,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Filter,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
// import { fetchUsers } from "../features/user/userApi";
// import { fetchOrders } from "../features/order/orderApi";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  address?: string;
  city?: string;
  avatar?: string;
}

interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

const AdminUsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading, pagination } = useAppSelector((state) => state.auth);
  const { orders } = useAppSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const filters: any = {
      page: currentPage,
      limit: limit,
      search: searchTerm || undefined,
      role: roleFilter === "all" ? undefined : roleFilter,
      isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    };
    // dispatch(fetchUsers(filters));
    // dispatch(fetchOrders({ limit: 100 }));
  }, [dispatch, currentPage, limit, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    if (users) {
      const totalFarmers = users.filter((u: User) => u.role === "farmer").length;
      const totalCustomers = users.filter((u: User) => u.role === "customer").length;
      const activeUsers = users.filter((u: User) => u.isActive === true).length;
      const inactiveUsers = users.filter((u: User) => u.isActive === false).length;
      const totalOrders = orders?.length || 0;
      const totalRevenue = 0

      setStats({
        totalUsers: users.length,
        totalFarmers,
        totalCustomers,
        activeUsers,
        inactiveUsers,
        totalOrders,
        totalRevenue,
      });
    }
  }, [users, orders]);

  useEffect(() => {
    if (selectedUserId) {
      const user = users?.find((u: User) => u.id === selectedUserId);
      setUserDetails(user || null);
      const userOrderList =  [];
    //   setUserOrders(userOrderList);
    }
  }, [selectedUserId, users, orders]);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const totalPages = pagination?.totalPages || 1;
  const totalUsers = pagination?.total || 0;
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return { icon: CheckCircle, text: "Delivered", color: "text-green-600", bg: "bg-green-100" };
      case "processing":
        return { icon: Clock, text: "Processing", color: "text-yellow-600", bg: "bg-yellow-100" };
      case "shipped":
        return { icon: TrendingUp, text: "Shipped", color: "text-blue-600", bg: "bg-blue-100" };
      case "cancelled":
        return { icon: XCircle, text: "Cancelled", color: "text-red-600", bg: "bg-red-100" };
      default:
        return { icon: Package, text: "Pending", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const hasActiveFilters = searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and monitor all platform users</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Farmers</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalFarmers}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Active Users</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeUsers}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactiveUsers}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - User List */}
          <div className="flex-1">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ height: "42px" }}
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                    style={{ height: "42px" }}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      style={{ height: "42px" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">User Role</label>
                      <select
                        value={roleFilter}
                        onChange={(e) => {
                          setRoleFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        style={{ height: "38px" }}
                      >
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="farmer">Farmer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Account Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        style={{ height: "38px" }}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(limit)].map((_, index) => (
                        <tr key={index}>
                          <td colSpan={5} className="px-4 py-4">
                            <div className="animate-pulse">
                              <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : users?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
                          <p className="text-gray-500 text-sm">No users match your search criteria</p>
                        </td>
                      </tr>
                    ) : (
                      users?.map((user: User) => (
                        <tr 
                          key={user.id} 
                          className={`hover:bg-gray-50 transition cursor-pointer ${
                            selectedUserId === user.id ? "bg-green-50" : ""
                          }`}
                          onClick={() => handleSelectUser(user.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "farmer" 
                                ? "bg-green-100 text-green-700" 
                                : user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleSelectUser(user.id)}
                                className={`p-1.5 rounded-lg transition ${
                                  selectedUserId === user.id 
                                    ? "text-green-600 bg-green-100" 
                                    : "text-blue-600 hover:bg-blue-50"
                                }`}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && !loading && users?.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Show</span>
                    <select
                      value={limit}
                      onChange={handleLimitChange}
                      className="px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ height: "32px" }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                    <span className="ml-4">
                      Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg border transition text-sm ${
                        currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                      }`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition ${
                        currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-lg transition text-sm ${
                          currentPage === page
                            ? "bg-green-600 text-white"
                            : "text-gray-600 hover:bg-green-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border transition ${
                        currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg border transition text-sm ${
                        currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                      }`}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - User Details Panel */}
          <div className="lg:w-[500px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden border border-gray-100">
              {userDetails ? (
                <div>
                  {/* User Profile Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{userDetails.name}</h2>
                        <p className="text-green-100 text-sm mt-1">{userDetails.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            userDetails.role === "farmer" 
                              ? "bg-green-800/50 text-green-100" 
                              : userDetails.role === "admin"
                              ? "bg-purple-800/50 text-purple-100"
                              : "bg-blue-800/50 text-blue-100"
                          }`}>
                            {userDetails.role}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            userDetails.isActive 
                              ? "bg-green-800/50 text-green-100" 
                              : "bg-red-800/50 text-red-100"
                          }`}>
                            {userDetails.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{userDetails.email}</span>
                        </div>
                        {userDetails.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{userDetails.phone}</span>
                          </div>
                        )}
                        {userDetails.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{userDetails.address}, {userDetails.city}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Joined {formatDate(userDetails.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Statistics */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        Order Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-2xl font-bold text-gray-800">{userOrders.length}</p>
                          <p className="text-xs text-gray-500">Total Orders</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-2xl font-bold text-green-600">
                            Rs. {userOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Total Spent</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    {userOrders.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Orders</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {userOrders.slice(0, 5).map((order) => {
                            const statusBadge = getStatusBadge(order.status);
                            const StatusIcon = statusBadge.icon;
                            return (
                              <div key={order.id} className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-800">Order #{order.id}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.color}`}>
                                    <StatusIcon className="w-3 h-3 inline mr-1" />
                                    {statusBadge.text}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                                  <span className="font-semibold text-gray-800">Rs. {order.total}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {userOrders.length > 5 && (
                          <p className="text-xs text-center text-gray-400 mt-2">
                            +{userOrders.length - 5} more orders
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No User Selected</h3>
                  <p className="text-gray-500 text-sm">Click on any user from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;