import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Store,
  ShoppingCart,
  Mail,
  Calendar,
  Eye,
  User as UserIcon,
  RefreshCw,
  Filter,
  ChevronDown,
  X,
  MapPin,
  Phone,
  Shield,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import type { IUser } from "./features/auth/AuthSlice";
import { getAllUsers } from "./features/user/userApi";

const AdminUsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localRoleFilter, setLocalRoleFilter] = useState<string>("all");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users && selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId);
      setUserDetails(user || null);
    }
  }, [selectedUserId, users]);

  const handleSearch = () => {
    setSearchTerm(localSearchTerm);
    setRoleFilter(localRoleFilter);
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const clearFilters = () => {
    setLocalSearchTerm("");
    setLocalRoleFilter("all");
    setSearchTerm("");
    setRoleFilter("all");
    setCurrentPage(1);
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalFilteredUsers = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalFilteredUsers / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers?.slice(startIndex, endIndex);

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "farmer":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "farmer":
        return <Store className="w-3.5 h-3.5" />;
      case "admin":
        return <Shield className="w-3.5 h-3.5" />;
      case "customer":
        return <ShoppingCart className="w-3.5 h-3.5" />;
      default:
        return <UserIcon className="w-3.5 h-3.5" />;
    }
  };

  const totalUsers = filteredUsers?.length || 0;
  const totalFarmers = filteredUsers?.filter((u) => u.role === "farmer").length || 0;
  const totalCustomers = filteredUsers?.filter((u) => u.role === "customer").length || 0;
  const totalAdmins = filteredUsers?.filter((u) => u.role === "admin").length || 0;

  const hasActiveFilters = searchTerm !== "" || roleFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all platform users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Farmers</p>
                <p className="text-2xl font-bold text-green-600">{totalFarmers}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-purple-600">{totalCustomers}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-orange-600">{totalAdmins}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - User List */}
          <div className="flex-1">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={localRoleFilter}
                        onChange={(e) => setLocalRoleFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="farmer">Farmer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                )}

                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                        Search: {searchTerm}
                        <button onClick={() => {
                          setLocalSearchTerm("");
                          setSearchTerm("");
                          setCurrentPage(1);
                        }} className="hover:text-green-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {roleFilter !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                        Role: {roleFilter}
                        <button onClick={() => {
                          setLocalRoleFilter("all");
                          setRoleFilter("all");
                          setCurrentPage(1);
                        }} className="hover:text-blue-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
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
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      [...Array(limit)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan={4} className="px-6 py-4">
                            <div className="animate-pulse">
                              <div className="h-16 bg-gray-100 rounded-lg"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : paginatedUsers?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12">
                          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                          <p className="text-gray-500 mt-1">Try adjusting your filters</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers?.map((user) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 transition cursor-pointer ${selectedUserId === user.id ? "bg-green-50" : ""
                            }`}
                          onClick={() => handleSelectUser(user.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-semibold text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {getRoleIcon(user.role)}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(user.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleSelectUser(user.id)}
                                className={`p-2 rounded-lg transition ${selectedUserId === user.id
                                    ? "text-green-600 bg-green-100"
                                    : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
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

              {/* Pagination */}
              {totalFilteredUsers > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Show</span>
                    <select
                      value={limit}
                      onChange={handleLimitChange}
                      className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                    <span className="ml-4">
                      Showing {startIndex + 1} to {Math.min(endIndex, totalFilteredUsers)} of {totalFilteredUsers} users
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg border transition text-sm ${currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                        }`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition ${currentPage === 1
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
                        className={`px-3 py-1 rounded-lg transition text-sm ${currentPage === page
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
                      className={`p-2 rounded-lg border transition ${currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                        }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg border transition text-sm ${currentPage === totalPages
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
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-xl shadow-sm sticky top-24 overflow-hidden border border-gray-200">
              {userDetails ? (
                <div>
                  {/* Header with Gradient */}
                  <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-bold text-white">
                          {userDetails.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">{userDetails.name}</h2>
                        <p className="text-green-100 text-sm mt-0.5">{userDetails.email}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(userDetails.role)}`}>
                          {getRoleIcon(userDetails.role)}
                          {userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Content */}
                  <div className="p-6 space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        Contact Information
                      </h3>
                      <div className="space-y-2.5 pl-6">
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <p className="text-sm text-gray-800">{userDetails.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Member Since</p>
                          <div className="flex items-center gap-1.5 text-sm text-gray-800">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {formatDate(userDetails.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        Account Details
                      </h3>
                      <div className="space-y-2.5 pl-6">
                        <div>
                          <p className="text-xs text-gray-500">User ID</p>
                          <p className="text-sm text-gray-800 font-mono">#{userDetails.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Status</p>
                          <div className="flex items-center gap-1.5 text-sm text-green-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Orders</span>
                          <span className="font-semibold text-gray-900">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Select a user to view details</p>
                  <p className="text-xs text-gray-400 mt-1">Click on any user from the list</p>
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