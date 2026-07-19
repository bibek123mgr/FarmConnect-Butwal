import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Store,
    Mail,
    Calendar,
    Eye,
    X,
    MapPin,
    Shield,
    CheckCircle,
    AlertCircle,
    Edit2,
    Clock as ClockIcon,
    TrendingUp,
    Users,
    Building2,
    Save,
    RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { fetchVendors, fetchVendorStats } from "./features/vendor/vendorApi";
import type { IVendor } from "./features/vendor/vendorSlice";

interface StatusUpdateData {
    status: 'active' | 'inactive';
    remarks: string;
}

const AdminVendorManagement = () => {
    const dispatch = useAppDispatch();
    const { vendors, pagination, loading, stats } = useAppSelector((state) => state.vendor);

    const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState<StatusUpdateData>({
        status: 'active',
        remarks: ''
    });

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Local filter states for UI
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [localStatusFilter, setLocalStatusFilter] = useState<string>("all");

    // Fetch vendors when filters change
    useEffect(() => {
        const filters = {
            page: currentPage,
            limit: limit,
            search: searchTerm || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
        };
        dispatch(fetchVendors(filters));
    }, [dispatch, currentPage, limit, searchTerm, statusFilter]);

    useEffect(() => {
        dispatch(fetchVendorStats());
    }, []);

    const handleSearch = () => {
        setSearchTerm(localSearchTerm);
        setStatusFilter(localStatusFilter);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setLocalSearchTerm("");
        setLocalStatusFilter("all");
        setSearchTerm("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    const handleSelectVendor = (vendor: IVendor) => {
        setSelectedVendor(vendor);
    };

    const handleUpdateStatus = async () => {
        if (!selectedVendor) return;
        // Here you would call your API to update vendor status
        // await dispatch(updateVendorStatus({ id: selectedVendor.id, isActive: statusUpdate.status === 'active', remarks: statusUpdate.remarks }));
        setShowStatusModal(false);
        setStatusUpdate({ status: 'active', remarks: '' });
        // Refetch vendors after update
        // dispatch(fetchVendors({ page: currentPage, limit: limit, search: searchTerm, status: statusFilter }));
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
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
        let end = Math.min(pagination.totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(numAmount || 0);
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };

    const getStatusIcon = (isActive: boolean) => {
        return isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />;
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? "Active" : "Inactive";
    };

    const getVerificationColor = (isVerified: boolean) => {
        return isVerified ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";
    };

    const getVerificationText = (isVerified: boolean) => {
        return isVerified ? "Verified" : "Pending";
    };

    // Calculate stats from current vendors
    const totalVendors = pagination.total || 0;
    // const totalActive = vendors?.filter(v => v.isActive === true).length || 0;
    // const totalInactive = vendors?.filter(v => v.isActive === false).length || 0;
    // const totalVerified = vendors?.filter(v => v.isVerified === true).length || 0;
    // const totalRevenue = vendors?.reduce((sum, v) => sum + (parseFloat(v.totalSalesRevenue) || 0), 0) || 0;

    const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-2 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                    <p className="text-gray-600 mt-2">Manage and monitor all marketplace vendors</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Vendors</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.totalVendors}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Store className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.activerVendors}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Inactive</p>
                                <p className="text-2xl font-bold text-red-600">{stats?.inactiveVendors}</p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Verified</p>
                                <p className="text-2xl font-bold text-blue-600">{stats?.verifiedVendors}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search vendors by name, email or farm name..."
                                    value={localSearchTerm}
                                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <select
                                value={localStatusFilter}
                                onChange={(e) => setLocalStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
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
                                {statusFilter !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                        Status: {statusFilter}
                                        <button onClick={() => {
                                            setLocalStatusFilter("all");
                                            setStatusFilter("all");
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

                {/* Vendors Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Farm / Owner</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    {/* <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th> */}
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(limit)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={8} className="px-6 py-4">
                                                <div className="animate-pulse">
                                                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : vendors?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No vendors found</h3>
                                            <p className="text-gray-500 mt-1">Try adjusting your filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    vendors?.map((vendor: IVendor) => (
                                        <tr
                                            key={vendor.id}
                                            className="hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => handleSelectVendor(vendor)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {vendor.logo ? (
                                                        <img
                                                            src={vendor.logo}
                                                            alt={vendor.farmName}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=No+Image";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                                            <Store className="w-5 h-5 text-green-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{vendor.farmName}</p>
                                                        <p className="text-sm text-gray-500">{vendor.user.name}</p>
                                                        <p className="text-xs text-gray-400">{vendor.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.isActive)}`}>
                                                    {getStatusIcon(vendor.isActive)}
                                                    {getStatusText(vendor.isActive)}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getVerificationColor(vendor.isVerified)}`}>
                                                    {getVerificationText(vendor.isVerified)}
                                                </span>
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{vendor.totalProducts}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{vendor.totalOrders}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">Rs. {vendor.totalSalesRevenue}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(vendor.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectVendor(vendor);
                                                        }}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
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
                    {totalVendors > 0 && (
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
                                    Showing {vendors?.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalVendors)} of {totalVendors} vendors
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
                                    disabled={currentPage === pagination.totalPages}
                                    className={`p-2 rounded-lg border transition ${currentPage === pagination.totalPages
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                        }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => goToPage(pagination.totalPages)}
                                    disabled={currentPage === pagination.totalPages}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${currentPage === pagination.totalPages
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

            {/* Vendor Details Modal - Same as before */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Store className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedVendor.farmName}</h2>
                                    <p className="text-green-100 text-sm">Vendor ID: #{selectedVendor.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-white/10 rounded-lg transition text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-green-600" />
                                            Farm Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Farm Name</p>
                                                <p className="text-sm text-gray-800 font-medium">{selectedVendor.farmName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Description</p>
                                                <p className="text-sm text-gray-600">{selectedVendor.description || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Address</p>
                                                <div className="flex items-start gap-1.5 text-sm text-gray-800">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                                    <span>{selectedVendor.address}, {selectedVendor.district}, {selectedVendor.province}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-green-600" />
                                            Owner Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Owner Name</p>
                                                <p className="text-sm text-gray-800">{selectedVendor.user.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email Address</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{selectedVendor.user.email}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Member Since</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {formatDate(selectedVendor.user.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-600" />
                                            Business Details
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">PAN Number</p>
                                                <p className="text-sm text-gray-800 font-mono">{selectedVendor.panNo || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">VAT Number</p>
                                                <p className="text-sm text-gray-800 font-mono">{selectedVendor.vatNo || "N/A"}</p>
                                            </div>
                                            {/* <div>
                                                <p className="text-xs text-gray-500">Verification Status</p>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getVerificationColor(selectedVendor.isVerified)}`}>
                                                    {getVerificationText(selectedVendor.isVerified)}
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            Performance Metrics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 pl-6">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Total Revenue</p>
                                                <p className="text-lg font-bold text-gray-900">Rs. {selectedVendor.totalSalesRevenue}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Total Products</p>
                                                <p className="text-lg font-bold text-gray-900">{selectedVendor.totalProducts}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Total Orders</p>
                                                <p className="text-lg font-bold text-gray-900">{selectedVendor.totalOrders}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className={`text-lg font-bold ${selectedVendor.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                    {getStatusText(selectedVendor.isActive)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4 text-green-600" />
                                            Account Timeline
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Account Created</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedVendor.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Last Updated</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedVendor.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                {/* <button onClick={() => setShowStatusModal(true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" />
                                    Update Status
                                </button> */}
                                <button onClick={() => setSelectedVendor(null)} className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && selectedVendor && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Update Vendor Status</h3>
                            <button onClick={() => { setShowStatusModal(false); setStatusUpdate({ status: 'active', remarks: '' }); }} className="p-1 hover:bg-gray-100 rounded-lg transition">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                                <p className="text-gray-900 font-medium">{selectedVendor.farmName}</p>
                                <p className="text-sm text-gray-500">{selectedVendor.user.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedVendor.isActive)}`}>
                                    {getStatusIcon(selectedVendor.isActive)}
                                    {getStatusText(selectedVendor.isActive)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Status *</label>
                                <select
                                    value={statusUpdate.status}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Reason</label>
                                <textarea
                                    value={statusUpdate.remarks}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter remarks or reason for status change..."
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button onClick={() => { setShowStatusModal(false); setStatusUpdate({ status: 'active', remarks: '' }); }} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                                Cancel
                            </button>
                            <button onClick={handleUpdateStatus} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendorManagement;