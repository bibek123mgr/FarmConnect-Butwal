import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Store,
    ShoppingCart,
    Mail,
    Calendar,
    Eye,
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
    DollarSign,
    Percent,
    AlertCircle,
    Edit2,
    UserCheck,
    UserX,
    Clock as ClockIcon,
    MessageSquare,
    Star,
    TrendingUp,
    Users,
    Building2,
    CreditCard,
    FileText,
    Save,
} from "lucide-react";
import { useAppDispatch } from "./hooks/hooks";
// import type { IUser } from "../../features/auth/AuthSlice";

// Vendor specific interface
interface Vendor {
    id: number;
    role: string;
    storeName: string;
    storeDescription?: string;
    storeLogo?: string;
    storeBanner?: string;
    storeAddress?: string;
    storePhone?: string;
    status: 'pending' | 'approved' | 'suspended' | 'rejected';
    commissionRate: number;
    totalSales: number;
    totalProducts: number;
    totalOrders: number;
    rating: number;
    totalReviews: number;
    rejectionReason?: string;
    approvedAt?: string;
    suspendedAt?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    businessLicense?: string;
    taxId?: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface StatusUpdateData {
    status: 'pending' | 'approved' | 'suspended' | 'rejected';
    remarks: string;
}

const AdminVendorManagement = () => {
    const dispatch = useAppDispatch();
    // Mock data - replace with actual API calls
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [verificationFilter, setVerificationFilter] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState<StatusUpdateData>({
        status: 'approved',
        remarks: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [localStatusFilter, setLocalStatusFilter] = useState<string>("all");
    const [localVerificationFilter, setLocalVerificationFilter] = useState<string>("all");

    useEffect(() => {
        // Fetch vendors - replace with actual API call
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockVendors: Vendor[] = [
                {
                    id: 1,
                    name: "John Farmer",
                    email: "john@greenfarm.com",
                    role: "farmer",
                    createdAt: "2024-01-15T10:00:00Z",
                    updatedAt: "2024-01-15T10:00:00Z",
                    storeName: "Green Valley Farms",
                    storeDescription: "Organic vegetables and fruits",
                    storeAddress: "123 Farm Road, Rural County, CA 90210",
                    storePhone: "+1 (555) 123-4567",
                    status: 'approved',
                    commissionRate: 10,
                    totalSales: 45678,
                    totalProducts: 45,
                    totalOrders: 234,
                    rating: 4.8,
                    totalReviews: 127,
                    verificationStatus: 'verified',
                    businessLicense: "BL-2024-001",
                    taxId: "TAX-123456",
                    approvedAt: "2024-01-20T10:00:00Z"
                },
                {
                    id: 2,
                    name: "Sarah Wilson",
                    email: "sarah@organicfresh.com",
                    role: "farmer",
                    createdAt: "2024-02-10T10:00:00Z",
                    updatedAt: "2024-02-10T10:00:00Z",
                    storeName: "Organic Fresh Market",
                    storeDescription: "Fresh organic produce delivered daily",
                    storeAddress: "456 Market St, Cityville, ST 12345",
                    storePhone: "+1 (555) 234-5678",
                    status: 'pending',
                    commissionRate: 12,
                    totalSales: 0,
                    totalProducts: 0,
                    totalOrders: 0,
                    rating: 0,
                    totalReviews: 0,
                    verificationStatus: 'pending',
                },
                {
                    id: 3,
                    name: "Mike Johnson",
                    email: "mike@dairyfresh.com",
                    role: "farmer",
                    createdAt: "2024-01-05T10:00:00Z",
                    updatedAt: "2024-01-05T10:00:00Z",
                    storeName: "Dairy Fresh Products",
                    storeDescription: "Fresh dairy and organic milk",
                    storeAddress: "789 Dairy Lane, Milk Town, ST 67890",
                    storePhone: "+1 (555) 345-6789",
                    status: 'suspended',
                    commissionRate: 10,
                    totalSales: 12345,
                    totalProducts: 23,
                    totalOrders: 89,
                    rating: 3.5,
                    totalReviews: 45,
                    verificationStatus: 'verified',
                    suspendedAt: "2024-03-01T10:00:00Z",
                    rejectionReason: "Multiple customer complaints about product quality"
                },
                {
                    id: 4,
                    name: "Emily Chen",
                    email: "emily@organictea.com",
                    role: "farmer",
                    createdAt: "2024-03-20T10:00:00Z",
                    updatedAt: "2024-03-20T10:00:00Z",
                    storeName: "Organic Tea Gardens",
                    storeDescription: "Premium organic tea leaves",
                    storeAddress: "321 Tea Plantation Rd, Hill Town, ST 34567",
                    storePhone: "+1 (555) 456-7890",
                    status: 'rejected',
                    commissionRate: 15,
                    totalSales: 0,
                    totalProducts: 0,
                    totalOrders: 0,
                    rating: 0,
                    totalReviews: 0,
                    verificationStatus: 'rejected',
                    rejectionReason: "Business license verification failed"
                }
            ];
            setVendors(mockVendors);
            setLoading(false);
        }, 1000);
    };

    const handleSearch = () => {
        setSearchTerm(localSearchTerm);
        setStatusFilter(localStatusFilter);
        setVerificationFilter(localVerificationFilter);
        setCurrentPage(1);
    };

    const handleSelectVendor = (vendor: Vendor) => {
        setSelectedVendor(vendor);
    };

    const handleUpdateStatus = () => {
        if (!selectedVendor) return;

        // Update vendor status - replace with actual API call
        const updatedVendors = vendors.map(vendor =>
            vendor.id === selectedVendor.id
                ? {
                    ...vendor,
                    status: statusUpdate.status,
                    rejectionReason: statusUpdate.status === 'rejected' ? statusUpdate.remarks : vendor.rejectionReason,
                    approvedAt: statusUpdate.status === 'approved' ? new Date().toISOString() : vendor.approvedAt,
                    suspendedAt: statusUpdate.status === 'suspended' ? new Date().toISOString() : vendor.suspendedAt,
                }
                : vendor
        );

        setVendors(updatedVendors);
        setSelectedVendor({ ...selectedVendor, status: statusUpdate.status });
        setShowStatusModal(false);
        setStatusUpdate({ status: 'approved', remarks: '' });
    };

    const clearFilters = () => {
        setLocalSearchTerm("");
        setLocalStatusFilter("all");
        setLocalVerificationFilter("all");
        setSearchTerm("");
        setStatusFilter("all");
        setVerificationFilter("all");
        setCurrentPage(1);
    };

    const filteredVendors = vendors?.filter((vendor) => {
        const matchesSearch =
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.storeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
        const matchesVerification = verificationFilter === "all" || vendor.verificationStatus === verificationFilter;
        return matchesSearch && matchesStatus && matchesVerification;
    });

    // Pagination logic
    const totalFilteredVendors = filteredVendors?.length || 0;
    const totalPages = Math.ceil(totalFilteredVendors / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVendors = filteredVendors?.slice(startIndex, endIndex);

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return "bg-green-100 text-green-800";
            case 'pending':
                return "bg-yellow-100 text-yellow-800";
            case 'suspended':
                return "bg-red-100 text-red-800";
            case 'rejected':
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'pending':
                return <ClockIcon className="w-3.5 h-3.5" />;
            case 'suspended':
                return <AlertCircle className="w-3.5 h-3.5" />;
            case 'rejected':
                return <X className="w-3.5 h-3.5" />;
            default:
                return <ClockIcon className="w-3.5 h-3.5" />;
        }
    };

    const getVerificationColor = (status: string) => {
        switch (status) {
            case 'verified':
                return "bg-blue-100 text-blue-800";
            case 'pending':
                return "bg-orange-100 text-orange-800";
            case 'rejected':
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalVendors = filteredVendors?.length || 0;
    const totalApproved = filteredVendors?.filter(v => v.status === "approved").length || 0;
    const totalPending = filteredVendors?.filter(v => v.status === "pending").length || 0;
    const totalSuspended = filteredVendors?.filter(v => v.status === "suspended").length || 0;
    const totalRevenue = filteredVendors?.reduce((sum, v) => sum + v.totalSales, 0) || 0;

    const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || verificationFilter !== "all";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                    <p className="text-gray-600 mt-2">Manage and monitor all marketplace vendors</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: "Total Vendors", value: totalVendors, color: "purple", icon: Store },
                        { label: "Approved", value: totalApproved, color: "green", icon: CheckCircle },
                        { label: "Pending", value: totalPending, color: "yellow", icon: ClockIcon },
                        { label: "Suspended", value: totalSuspended, color: "red", icon: AlertCircle },
                        { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "blue", icon: DollarSign },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 ${index === 4 ? 'col-span-2 lg:col-span-1' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                                </div>
                                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search vendors by name, email or store name..."
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={localStatusFilter}
                                        onChange={(e) => setLocalStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                                    <select
                                        value={localVerificationFilter}
                                        onChange={(e) => setLocalVerificationFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="verified">Verified</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
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
                                {verificationFilter !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs">
                                        Verification: {verificationFilter}
                                        <button onClick={() => {
                                            setLocalVerificationFilter("all");
                                            setVerificationFilter("all");
                                            setCurrentPage(1);
                                        }} className="hover:text-orange-900">
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
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Store / Vendor</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(limit)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={7} className="px-6 py-4">
                                                <div className="animate-pulse">
                                                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedVendors?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12">
                                            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No vendors found</h3>
                                            <p className="text-gray-500 mt-1">Try adjusting your filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedVendors?.map((vendor) => (
                                        <tr
                                            key={vendor.id}
                                            className="hover:bg-gray-50 transition cursor-pointer"

                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                                        <Store className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{vendor.storeName}</p>
                                                        <p className="text-sm text-gray-500">{vendor.name}</p>
                                                        <p className="text-xs text-gray-400">{vendor.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                                                    {getStatusIcon(vendor.status)}
                                                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getVerificationColor(vendor.verificationStatus)}`}>
                                                    {vendor.verificationStatus.charAt(0).toUpperCase() + vendor.verificationStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{formatCurrency(vendor.totalSales)}</p>
                                                    <p className="text-xs text-gray-500">{vendor.totalOrders} orders</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="font-medium text-gray-900">{vendor.rating.toFixed(1)}</span>
                                                    <span className="text-xs text-gray-500">({vendor.totalReviews})</span>
                                                </div>
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
                    {totalFilteredVendors > 0 && (
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
                                    Showing {startIndex + 1} to {Math.min(endIndex, totalFilteredVendors)} of {totalFilteredVendors} vendors
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

            {/* Vendor Details Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Store className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedVendor.storeName}</h2>
                                    <p className="text-green-100 text-sm">Vendor ID: #{selectedVendor.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVendor(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Vendor Info */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-green-600" />
                                            Store Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Store Name</p>
                                                <p className="text-sm text-gray-800 font-medium">{selectedVendor.storeName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Store Description</p>
                                                <p className="text-sm text-gray-600">{selectedVendor.storeDescription || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Store Address</p>
                                                <div className="flex items-start gap-1.5 text-sm text-gray-800">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                                    <span>{selectedVendor.storeAddress || "N/A"}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Store Phone</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{selectedVendor.storePhone || "N/A"}</span>
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
                                                <p className="text-sm text-gray-800">{selectedVendor.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email Address</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{selectedVendor.email}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Member Since</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {formatDate(selectedVendor.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Business & Performance */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-600" />
                                            Business Verification
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Verification Status</p>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getVerificationColor(selectedVendor.verificationStatus)}`}>
                                                    {selectedVendor.verificationStatus.charAt(0).toUpperCase() + selectedVendor.verificationStatus.slice(1)}
                                                </span>
                                            </div>
                                            {selectedVendor.businessLicense && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Business License</p>
                                                    <p className="text-sm text-gray-800 font-mono">{selectedVendor.businessLicense}</p>
                                                </div>
                                            )}
                                            {selectedVendor.taxId && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Tax ID</p>
                                                    <p className="text-sm text-gray-800 font-mono">{selectedVendor.taxId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            Performance Metrics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 pl-6">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Total Sales</p>
                                                <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedVendor.totalSales)}</p>
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
                                                <p className="text-xs text-gray-500">Commission Rate</p>
                                                <p className="text-lg font-bold text-gray-900">{selectedVendor.commissionRate}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4 text-green-600" />
                                            Status History
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Current Status</p>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedVendor.status)}`}>
                                                    {getStatusIcon(selectedVendor.status)}
                                                    {selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}
                                                </span>
                                            </div>
                                            {selectedVendor.approvedAt && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Approved On</p>
                                                    <p className="text-sm text-gray-800">{formatDate(selectedVendor.approvedAt)}</p>
                                                </div>
                                            )}
                                            {selectedVendor.rejectionReason && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Rejection/Suspension Reason</p>
                                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg mt-1">{selectedVendor.rejectionReason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Update Status
                                </button>
                                <button
                                    onClick={() => setSelectedVendor(null)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                                >
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
                            <button
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setStatusUpdate({ status: 'approved', remarks: '' });
                                }}
                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vendor
                                </label>
                                <p className="text-gray-900 font-medium">{selectedVendor.storeName}</p>
                                <p className="text-sm text-gray-500">{selectedVendor.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Status *
                                </label>
                                <select
                                    value={statusUpdate.status}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks / Reason *
                                </label>
                                <textarea
                                    value={statusUpdate.remarks}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter remarks or reason for status change..."
                                />
                            </div>

                            {(statusUpdate.status === 'rejected' || statusUpdate.status === 'suspended') && !statusUpdate.remarks && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    Remarks are required for rejection or suspension
                                </p>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setStatusUpdate({ status: 'approved', remarks: '' });
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={(statusUpdate.status === 'rejected' || statusUpdate.status === 'suspended') && !statusUpdate.remarks}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
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