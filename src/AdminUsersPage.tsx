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

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users && selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId);
      setUserDetails(user || null);
    }
  }, [selectedUserId, users]);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const clearFilters = () => {
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

  const totalUsers = filteredUsers?.length || 0;
  const totalFarmers = filteredUsers?.filter((u) => u.role === "farmer").length || 0;
  const totalCustomers = filteredUsers?.filter((u) => u.role === "customer").length || 0;
  const totalAdmins = filteredUsers?.filter((u) => u.role === "admin").length || 0;

  const hasActiveFilters = searchTerm !== "" || roleFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor all platform users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Farmers</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{totalFarmers}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Customers</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalCustomers}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Admins</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{totalAdmins}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - User List */}
          <div className="flex-1">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(limit)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan={4} className="px-4 py-4">
                            <div className="animate-pulse">
                              <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : paginatedUsers?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No users found</p>
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
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.role === "farmer"
                                ? "bg-green-100 text-green-700"
                                : user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleSelectUser(user.id)}
                              className={`p-1.5 rounded-lg transition ${selectedUserId === user.id
                                  ? "text-green-600 bg-green-100"
                                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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

            </div>
          </div>

          {/* Right Side - User Details Panel */}
          <div className="lg:w-[450px]">
            <div className="bg-white rounded-lg shadow-sm sticky top-24 overflow-hidden">
              {userDetails ? (
                <div>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{userDetails.name}</h2>
                        <p className="text-green-100 text-sm">{userDetails.email}</p>
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white mt-1">
                          {userDetails.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        Contact Info
                      </h3>
                      <div className="space-y-2 pl-6">
                        <p className="text-sm text-gray-600">{userDetails.email}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          Joined {formatDate(userDetails.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">User ID</h3>
                      <p className="text-sm text-gray-500">#{userDetails.id}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Select a user to view details</p>
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