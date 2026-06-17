import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Calendar,
    Eye,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    Filter,
    ChevronDown,
    RefreshCw,
    Download,
    Send,
    FileText,
    Wallet,
    TrendingUp,
    Users,
    Banknote,
    CreditCard,
    Loader2,
    MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../hooks/hooks";

// Interfaces
interface Payout {
    id: number;
    vendorId: number;
    vendorName: string;
    vendorEmail: string;
    farmName: string;
    amount: number;
    commission: number;
    netAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'cash';
    paymentDetails: {
        bankName?: string;
        accountNumber?: string;
        accountName?: string;
        paypalEmail?: string;
        transactionId?: string;
    };
    period: {
        startDate: string;
        endDate: string;
    };
    remarks?: string;
    processedBy?: string;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface PayoutStats {
    totalPending: number;
    totalProcessing: number;
    totalCompleted: number;
    totalAmount: number;
    totalCommission: number;
    totalNetAmount: number;
    pendingCount: number;
    completedCount: number;
}

interface PayoutFilters {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    vendorId?: number;
    startDate?: string;
    endDate?: string;
}

const AdminPayoutsManagement = () => {
    const dispatch = useAppDispatch();
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [processRemark, setProcessRemark] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState<PayoutFilters>({
        page: 1,
        limit: 10,
    });
    const [localSearch, setLocalSearch] = useState("");
    const [localStatus, setLocalStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });
    
    const [stats, setStats] = useState<PayoutStats>({
        totalPending: 0,
        totalProcessing: 0,
        totalCompleted: 0,
        totalAmount: 0,
        totalCommission: 0,
        totalNetAmount: 0,
        pendingCount: 0,
        completedCount: 0,
    });

    // Mock data - replace with actual API calls
    const mockPayouts: Payout[] = [
        {
            id: 1,
            vendorId: 1,
            vendorName: "John Farmer",
            vendorEmail: "john@greenvalley.com",
            farmName: "Green Valley Farms",
            amount: 5000,
            commission: 500,
            netAmount: 4500,
            status: 'pending',
            paymentMethod: 'bank_transfer',
            paymentDetails: {
                bankName: "NIC Asia Bank",
                accountNumber: "1234567890",
                accountName: "John Farmer",
            },
            period: {
                startDate: "2024-04-01",
                endDate: "2024-04-30",
            },
            createdAt: "2024-05-01T10:00:00Z",
            updatedAt: "2024-05-01T10:00:00Z",
        },
        {
            id: 2,
            vendorId: 2,
            vendorName: "Sarah Wilson",
            vendorEmail: "sarah@organicfresh.com",
            farmName: "Organic Fresh Market",
            amount: 8750,
            commission: 875,
            netAmount: 7875,
            status: 'processing',
            paymentMethod: 'paypal',
            paymentDetails: {
                paypalEmail: "sarah@organicfresh.com",
            },
            period: {
                startDate: "2024-04-01",
                endDate: "2024-04-30",
            },
            processedBy: "Admin",
            processedAt: "2024-05-02T09:00:00Z",
            createdAt: "2024-05-01T10:00:00Z",
            updatedAt: "2024-05-02T09:00:00Z",
        },
        {
            id: 3,
            vendorId: 3,
            vendorName: "Mike Johnson",
            vendorEmail: "mike@dairyfresh.com",
            farmName: "Dairy Fresh Products",
            amount: 3200,
            commission: 320,
            netAmount: 2880,
            status: 'completed',
            paymentMethod: 'bank_transfer',
            paymentDetails: {
                bankName: "Kumari Bank",
                accountNumber: "9876543210",
                accountName: "Mike Johnson",
                transactionId: "TRX-202405001",
            },
            period: {
                startDate: "2024-03-01",
                endDate: "2024-03-31",
            },
            processedBy: "Admin",
            processedAt: "2024-04-05T14:30:00Z",
            createdAt: "2024-04-01T10:00:00Z",
            updatedAt: "2024-04-05T14:30:00Z",
        },
        {
            id: 4,
            vendorId: 4,
            vendorName: "Emily Chen",
            vendorEmail: "emily@organictea.com",
            farmName: "Organic Tea Gardens",
            amount: 12400,
            commission: 1240,
            netAmount: 11160,
            status: 'failed',
            paymentMethod: 'stripe',
            paymentDetails: {
                transactionId: "STR_001",
            },
            period: {
                startDate: "2024-04-01",
                endDate: "2024-04-30",
            },
            remarks: "Insufficient funds in vendor account",
            createdAt: "2024-05-01T10:00:00Z",
            updatedAt: "2024-05-01T10:00:00Z",
        },
        {
            id: 5,
            vendorId: 5,
            vendorName: "David Rodriguez",
            vendorEmail: "david@freshfruits.com",
            farmName: "Tropical Fruit Paradise",
            amount: 6200,
            commission: 620,
            netAmount: 5580,
            status: 'pending',
            paymentMethod: 'bank_transfer',
            paymentDetails: {
                bankName: "Global IME Bank",
                accountNumber: "5555555555",
                accountName: "David Rodriguez",
            },
            period: {
                startDate: "2024-04-01",
                endDate: "2024-04-30",
            },
            createdAt: "2024-05-01T10:00:00Z",
            updatedAt: "2024-05-01T10:00:00Z",
        },
    ];

    useEffect(() => {
        fetchPayouts();
    }, [filters]);

    const fetchPayouts = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            let filtered = [...mockPayouts];
            
            // Apply search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(p => 
                    p.vendorName.toLowerCase().includes(searchLower) ||
                    p.farmName.toLowerCase().includes(searchLower) ||
                    p.vendorEmail.toLowerCase().includes(searchLower)
                );
            }
            
            // Apply status filter
            if (filters.status && filters.status !== 'all') {
                filtered = filtered.filter(p => p.status === filters.status);
            }
            
            // Calculate pagination
            const startIndex = ((filters.page || 1) - 1) * (filters.limit || 10);
            const endIndex = startIndex + (filters.limit || 10);
            const paginatedData = filtered.slice(startIndex, endIndex);
            
            setPayouts(paginatedData);
            setPagination({
                currentPage: filters.page || 1,
                totalPages: Math.ceil(filtered.length / (filters.limit || 10)),
                totalItems: filtered.length,
                itemsPerPage: filters.limit || 10,
            });
            
            // Calculate stats
            const statsData = {
                totalPending: filtered.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netAmount, 0),
                totalProcessing: filtered.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.netAmount, 0),
                totalCompleted: filtered.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.netAmount, 0),
                totalAmount: filtered.reduce((sum, p) => sum + p.amount, 0),
                totalCommission: filtered.reduce((sum, p) => sum + p.commission, 0),
                totalNetAmount: filtered.reduce((sum, p) => sum + p.netAmount, 0),
                pendingCount: filtered.filter(p => p.status === 'pending').length,
                completedCount: filtered.filter(p => p.status === 'completed').length,
            };
            setStats(statsData);
            setLoading(false);
        }, 1000);
    };

    const handleSearch = () => {
        setFilters({
            ...filters,
            search: localSearch || undefined,
            status: localStatus !== 'all' ? localStatus : undefined,
            page: 1,
        });
    };

    const clearFilters = () => {
        setLocalSearch("");
        setLocalStatus("all");
        setFilters({
            page: 1,
            limit: 10,
        });
    };

    const handleViewDetails = (payout: Payout) => {
        setSelectedPayout(payout);
        setShowDetailsModal(true);
    };

    const handleProcessPayout = (payout: Payout) => {
        setSelectedPayout(payout);
        setProcessRemark("");
        setShowProcessModal(true);
    };

    const confirmProcessPayout = async () => {
        if (!selectedPayout) return;
        
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            const updatedPayouts = payouts.map(p => 
                p.id === selectedPayout.id 
                    ? { 
                        ...p, 
                        status: 'processing' as const,
                        processedBy: "Admin",
                        processedAt: new Date().toISOString(),
                        remarks: processRemark || undefined
                    }
                    : p
            );
            setPayouts(updatedPayouts);
            toast.success(`Payout for ${selectedPayout.farmName} is now processing`);
            setShowProcessModal(false);
            setIsProcessing(false);
            fetchPayouts();
        }, 1500);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            setFilters({ ...filters, page });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, limit: Number(e.target.value), page: 1 });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(pagination.totalPages, start + maxVisible - 1);
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return "bg-yellow-100 text-yellow-800";
            case 'processing':
                return "bg-blue-100 text-blue-800";
            case 'completed':
                return "bg-green-100 text-green-800";
            case 'failed':
                return "bg-red-100 text-red-800";
            case 'cancelled':
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-3.5 h-3.5" />;
            case 'processing':
                return <Loader2 className="w-3.5 h-3.5" />;
            case 'completed':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'failed':
                return <AlertCircle className="w-3.5 h-3.5" />;
            default:
                return <Clock className="w-3.5 h-3.5" />;
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'bank_transfer':
                return <Banknote className="w-4 h-4" />;
            case 'paypal':
                return <CreditCard className="w-4 h-4" />;
            default:
                return <Wallet className="w-4 h-4" />;
        }
    };

    const hasActiveFilters = filters.search || (filters.status && filters.status !== 'all');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
                        <p className="text-gray-600 mt-2">Manage vendor payouts and commission settlements</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Amount</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalPending)}</p>
                                <p className="text-xs text-gray-500">{stats.pendingCount} payouts</p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Processing</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalProcessing)}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCompleted)}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-purple-600" />
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
                                    placeholder="Search by vendor name, farm name or email..."
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
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
                                        value={localStatus}
                                        onChange={(e) => setLocalStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="failed">Failed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {filters.search && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                                        Search: {filters.search}
                                        <button onClick={() => {
                                            setLocalSearch("");
                                            setFilters({ ...filters, search: undefined, page: 1 });
                                        }} className="hover:text-green-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.status && filters.status !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                        Status: {filters.status}
                                        <button onClick={() => {
                                            setLocalStatus("all");
                                            setFilters({ ...filters, status: undefined, page: 1 });
                                        }} className="hover:text-blue-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Payouts Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(filters.limit)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={8} className="px-6 py-4">
                                                <div className="animate-pulse">
                                                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No payouts found</h3>
                                            <p className="text-gray-500 mt-1">Try adjusting your filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{payout.farmName}</p>
                                                    <p className="text-sm text-gray-500">{payout.vendorName}</p>
                                                    <p className="text-xs text-gray-400">{payout.vendorEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="text-gray-700">{formatDate(payout.period.startDate)}</p>
                                                    <p className="text-gray-500 text-xs">to {formatDate(payout.period.endDate)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-medium text-gray-900">{formatCurrency(payout.amount)}</span>
                                            </td>
                                          
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                                                    {getStatusIcon(payout.status)}
                                                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {getPaymentMethodIcon(payout.paymentMethod)}
                                                    <span className="text-sm text-gray-600">
                                                        {payout.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                                                         payout.paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(payout)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {payout.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleProcessPayout(payout)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                                                            title="Process Payout"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalItems > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Show</span>
                                <select
                                    value={filters.limit}
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
                                    Showing {((pagination.currentPage - 1) * (filters.limit || 10)) + 1} to {Math.min(pagination.currentPage * (filters.limit || 10), pagination.totalItems)} of {pagination.totalItems} payouts
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(1)}
                                    disabled={pagination.currentPage === 1}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${pagination.currentPage === 1
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                    }`}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => goToPage(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className={`p-2 rounded-lg border transition ${pagination.currentPage === 1
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
                                        className={`px-3 py-1 rounded-lg transition text-sm ${pagination.currentPage === page
                                            ? "bg-green-600 text-white"
                                            : "text-gray-600 hover:bg-green-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className={`p-2 rounded-lg border transition ${pagination.currentPage === pagination.totalPages
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                    }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => goToPage(pagination.totalPages)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${pagination.currentPage === pagination.totalPages
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

            {/* Payout Details Modal */}
            {showDetailsModal && selectedPayout && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Payout Details</h2>
                                    <p className="text-green-100 text-sm">Payout ID: #{selectedPayout.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Vendor Information */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-green-600" />
                                            Vendor Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Farm Name</p>
                                                <p className="text-sm text-gray-800 font-medium">{selectedPayout.farmName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Vendor Name</p>
                                                <p className="text-sm text-gray-800">{selectedPayout.vendorName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm text-gray-800">{selectedPayout.vendorEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            Payout Period
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Start Date</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedPayout.period.startDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">End Date</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedPayout.period.endDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Request Date</p>
                                                <p className="text-sm text-gray-800">{formatDateTime(selectedPayout.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Wallet className="w-4 h-4 text-green-600" />
                                            Payment Details
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Method</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    {getPaymentMethodIcon(selectedPayout.paymentMethod)}
                                                    {selectedPayout.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                                                     selectedPayout.paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}
                                                </div>
                                            </div>
                                            {selectedPayout.paymentDetails.bankName && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Bank Name</p>
                                                    <p className="text-sm text-gray-800">{selectedPayout.paymentDetails.bankName}</p>
                                                </div>
                                            )}
                                            {selectedPayout.paymentDetails.accountNumber && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Account Number</p>
                                                    <p className="text-sm text-gray-800 font-mono">{selectedPayout.paymentDetails.accountNumber}</p>
                                                </div>
                                            )}
                                            {selectedPayout.paymentDetails.accountName && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Account Name</p>
                                                    <p className="text-sm text-gray-800">{selectedPayout.paymentDetails.accountName}</p>
                                                </div>
                                            )}
                                            {selectedPayout.paymentDetails.paypalEmail && (
                                                <div>
                                                    <p className="text-xs text-gray-500">PayPal Email</p>
                                                    <p className="text-sm text-gray-800">{selectedPayout.paymentDetails.paypalEmail}</p>
                                                </div>
                                            )}
                                            {selectedPayout.paymentDetails.transactionId && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Transaction ID</p>
                                                    <p className="text-sm text-gray-800 font-mono">{selectedPayout.paymentDetails.transactionId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            Financial Breakdown
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div className="flex justify-between">
                                                <p className="text-xs text-gray-500">Total Sales</p>
                                                <p className="text-sm font-medium text-gray-800">{formatCurrency(selectedPayout.amount)}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-xs text-gray-500">Commission (10%)</p>
                                                <p className="text-sm text-orange-600">{formatCurrency(selectedPayout.commission)}</p>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                                <p className="text-sm font-semibold text-gray-700">Net Payout</p>
                                                <p className="text-lg font-bold text-green-600">{formatCurrency(selectedPayout.netAmount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    Status Timeline
                                </h3>
                                <div className="space-y-3 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${selectedPayout.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">Payout Request Created</p>
                                            <p className="text-xs text-gray-500">{formatDateTime(selectedPayout.createdAt)}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedPayout.status)}`}>
                                            {selectedPayout.status}
                                        </span>
                                    </div>
                                    {selectedPayout.processedAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Payout Processed</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(selectedPayout.processedAt)}</p>
                                                <p className="text-xs text-gray-500">By: {selectedPayout.processedBy}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedPayout.remarks && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                                <p className="text-xs font-medium text-gray-700">Remarks</p>
                                            </div>
                                            <p className="text-sm text-gray-600">{selectedPayout.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                {selectedPayout.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleProcessPayout(selectedPayout);
                                        }}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Process Payout
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Process Payout Modal */}
            {showProcessModal && selectedPayout && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Process Payout</h3>
                            <button
                                onClick={() => {
                                    setShowProcessModal(false);
                                    setProcessRemark("");
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
                                <p className="text-gray-900 font-medium">{selectedPayout.farmName}</p>
                                <p className="text-sm text-gray-500">{selectedPayout.vendorName}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Amount</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(selectedPayout.amount)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Commission (10%)</span>
                                    <span className="text-orange-600">{formatCurrency(selectedPayout.commission)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-sm font-semibold text-gray-700">Net Payout</span>
                                    <span className="text-lg font-bold text-green-600">{formatCurrency(selectedPayout.netAmount)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                                    {getPaymentMethodIcon(selectedPayout.paymentMethod)}
                                    <span className="text-sm text-gray-700">
                                        {selectedPayout.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                                         selectedPayout.paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks (Optional)
                                </label>
                                <textarea
                                    value={processRemark}
                                    onChange={(e) => setProcessRemark(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Add any remarks for this payout..."
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowProcessModal(false);
                                    setProcessRemark("");
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmProcessPayout}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Confirm Payout
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayoutsManagement;