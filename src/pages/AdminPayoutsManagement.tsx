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
    Send,
    FileText,
    Wallet,
    Users,
    Banknote,
    CreditCard,
    Loader2,
    MessageSquare,
    Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../hooks/hooks";
import { createPayment } from "../features/payment/paymentApi";

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
    paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'cash' | 'khalti' | 'esewa';
    paymentDetails: {
        bankName?: string;
        accountNumber?: string;
        accountName?: string;
        paypalEmail?: string;
        transactionId?: string;
        khaltiNumber?: string;
        esewaNumber?: string;
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

// Static vendor data for dropdown
const staticVendors = [
    { id: 1, name: "John Farmer", farmName: "Green Valley Farms", email: "john@greenvalley.com" },
    { id: 2, name: "Sarah Wilson", farmName: "Organic Fresh Market", email: "sarah@organicfresh.com" },
    { id: 3, name: "Mike Johnson", farmName: "Dairy Fresh Products", email: "mike@dairyfresh.com" },
    { id: 4, name: "Emily Chen", farmName: "Organic Tea Gardens", email: "emily@organictea.com" },
    { id: 5, name: "David Rodriguez", farmName: "Tropical Fruit Paradise", email: "david@freshfruits.com" },
];

const AdminPayoutsManagement = () => {
    const dispatch = useAppDispatch();
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);
    const [processRemark, setProcessRemark] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [availableAmount, setAvailableAmount] = useState(0); // Example available amount

    // Add Payout Form State
    const [payoutForm, setPayoutForm] = useState({
        vendorId: "",
        amount: "",
        paymentMethod: "cash",
        reason: "",
    });

    const fetchAvaliableAmount = () => {
        const amount = 100000; // Example available amount
        setAvailableAmount(amount);
    }

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

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(p =>
                    p.vendorName.toLowerCase().includes(searchLower) ||
                    p.farmName.toLowerCase().includes(searchLower) ||
                    p.vendorEmail.toLowerCase().includes(searchLower)
                );
            }

            if (filters.status && filters.status !== 'all') {
                filtered = filtered.filter(p => p.status === filters.status);
            }

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

    const handleAddPayout = async () => {
        if (!payoutForm.vendorId || !payoutForm.amount || !payoutForm.paymentMethod) {
            toast.error("Please fill in all required fields");
            return;
        }

        const amount = parseFloat(payoutForm.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const newPayout: any = {
            vendorId: payoutForm.vendorId ? parseInt(payoutForm.vendorId) : 0,
            amount: amount,
            paymentMethod: payoutForm.paymentMethod as any,
            remarks: payoutForm.reason || ""
        };
        dispatch(createPayment(newPayout));
        console.log(newPayout);

        // setPayouts([newPayout, ...payouts]);
        // toast.success(`Payout created for ${selectedVendor.farmName}`);
        // setShowAddPayoutModal(false);
        // setPayoutForm({ vendorId: "", amount: "", paymentMethod: "", reason: "" });
        // fetchPayouts();
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
            case 'khalti':
                return <Wallet className="w-4 h-4" />;
            case 'esewa':
                return <Wallet className="w-4 h-4" />;
            default:
                return <Wallet className="w-4 h-4" />;
        }
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'paypal':
                return 'PayPal';
            case 'khalti':
                return 'Khalti';
            case 'esewa':
                return 'eSewa';
            case 'cash':
                return 'Cash';
            default:
                return method;
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
                    <button
                        onClick={() => setShowAddPayoutModal(true)}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Payout
                    </button>
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
                                                        {getPaymentMethodLabel(payout.paymentMethod)}
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

            {/* Add Payout Modal */}
            {showAddPayoutModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Add New Payout</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddPayoutModal(false);
                                    setPayoutForm({ vendorId: "", amount: "", paymentMethod: "", reason: "" });
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Vendor Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={payoutForm.vendorId}
                                    onChange={(e) => setPayoutForm({ ...payoutForm, vendorId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Vendor</option>
                                    {staticVendors.map((vendor) => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.farmName} - {vendor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Avaliable Amount (NPR) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    disabled
                                    value={availableAmount}
                                    onChange={fetchAvaliableAmount}
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>


                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (NPR) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={payoutForm.amount}
                                    onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Payment Method - Radio Buttons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={payoutForm.paymentMethod === 'cash'}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <span className="text-sm">Cash</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="khalti"
                                            checked={payoutForm.paymentMethod === 'khalti'}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <span className="text-sm">Khalti</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="esewa"
                                            checked={payoutForm.paymentMethod === 'esewa'}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <span className="text-sm">eSewa</span>
                                    </label>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    value={payoutForm.reason}
                                    onChange={(e) => setPayoutForm({ ...payoutForm, reason: e.target.value })}
                                    rows={3}
                                    placeholder="Enter reason for payout..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddPayoutModal(false);
                                        setPayoutForm({ vendorId: "", amount: "", paymentMethod: "", reason: "" });
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPayout}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Payout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayoutsManagement;