import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
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
    Truck,
    Plus,
    Edit2,
    Loader2,
    DollarSign,
    Users,
    FileText,
    Printer,
    Send,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import toast from "react-hot-toast";

// Interfaces
interface PurchaseOrder {
    id: number;
    poNumber: string;
    vendorId: number;
    vendorName: string;
    vendorEmail: string;
    status: 'draft' | 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
    orderDate: string;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    items: PurchaseItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    notes?: string;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    receivedBy?: string;
    receivedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface PurchaseItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    receivedQuantity?: number;
    notes?: string;
}

interface PurchaseStats {
    totalOrders: number;
    totalAmount: number;
    pendingApproval: number;
    pendingReceiving: number;
    receivedThisMonth: number;
    averageOrderValue: number;
}

const AdminPurchaseManagement = () => {
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [receiveQuantities, setReceiveQuantities] = useState<{ [key: number]: number }>({});

    // Filter states
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "all",
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

    const [stats, setStats] = useState<PurchaseStats>({
        totalOrders: 0,
        totalAmount: 0,
        pendingApproval: 0,
        pendingReceiving: 0,
        receivedThisMonth: 0,
        averageOrderValue: 0,
    });

    // Mock data
    const mockPurchaseOrders: PurchaseOrder[] = [
        {
            id: 1,
            poNumber: "PO-2024-0001",
            vendorId: 1,
            vendorName: "Green Valley Supplies",
            vendorEmail: "contact@greenvalley.com",
            status: 'received',
            orderDate: "2024-05-01",
            expectedDeliveryDate: "2024-05-10",
            actualDeliveryDate: "2024-05-08",
            items: [
                { id: 1, productId: 1, productName: "Organic Fertilizer", quantity: 100, unitPrice: 25, total: 2500 },
                { id: 2, productId: 2, productName: "Seeds Pack", quantity: 50, unitPrice: 15, total: 750 },
            ],
            subtotal: 3250,
            tax: 260,
            discount: 0,
            total: 3510,
            notes: "Urgent delivery needed",
            createdBy: "Admin",
            approvedBy: "Super Admin",
            approvedAt: "2024-05-02T10:00:00Z",
            receivedBy: "Warehouse Staff",
            receivedAt: "2024-05-08T14:30:00Z",
            createdAt: "2024-05-01T09:00:00Z",
            updatedAt: "2024-05-08T14:30:00Z",
        },
        {
            id: 2,
            poNumber: "PO-2024-0002",
            vendorId: 2,
            vendorName: "Fresh Produce Co",
            vendorEmail: "sales@freshproduce.com",
            status: 'shipped',
            orderDate: "2024-05-05",
            expectedDeliveryDate: "2024-05-15",
            items: [
                { id: 3, productId: 3, productName: "Packaging Materials", quantity: 200, unitPrice: 5, total: 1000 },
            ],
            subtotal: 1000,
            tax: 80,
            discount: 50,
            total: 1030,
            createdBy: "Admin",
            approvedBy: "Super Admin",
            approvedAt: "2024-05-06T11:00:00Z",
            createdAt: "2024-05-05T10:00:00Z",
            updatedAt: "2024-05-06T11:00:00Z",
        },
        {
            id: 3,
            poNumber: "PO-2024-0003",
            vendorId: 3,
            vendorName: "Farm Equipment Ltd",
            vendorEmail: "info@farmequipment.com",
            status: 'pending',
            orderDate: "2024-05-10",
            expectedDeliveryDate: "2024-05-20",
            items: [
                { id: 4, productId: 4, productName: "Irrigation System", quantity: 5, unitPrice: 500, total: 2500 },
                { id: 5, productId: 5, productName: "Water Pumps", quantity: 3, unitPrice: 300, total: 900 },
            ],
            subtotal: 3400,
            tax: 272,
            discount: 100,
            total: 3572,
            createdBy: "Admin",
            createdAt: "2024-05-10T09:00:00Z",
            updatedAt: "2024-05-10T09:00:00Z",
        },
        {
            id: 4,
            poNumber: "PO-2024-0004",
            vendorId: 4,
            vendorName: "Organic Seeds Inc",
            vendorEmail: "orders@organicseeds.com",
            status: 'approved',
            orderDate: "2024-05-12",
            expectedDeliveryDate: "2024-05-22",
            items: [
                { id: 6, productId: 6, productName: "Organic Wheat Seeds", quantity: 500, unitPrice: 10, total: 5000 },
            ],
            subtotal: 5000,
            tax: 400,
            discount: 200,
            total: 5200,
            createdBy: "Admin",
            approvedBy: "Super Admin",
            approvedAt: "2024-05-13T10:00:00Z",
            createdAt: "2024-05-12T14:00:00Z",
            updatedAt: "2024-05-13T10:00:00Z",
        },
    ];

    useEffect(() => {
        fetchPurchaseOrders();
    }, [filters]);

    const fetchPurchaseOrders = async () => {
        setLoading(true);
        setTimeout(() => {
            let filtered = [...mockPurchaseOrders];

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(po =>
                    po.poNumber.toLowerCase().includes(searchLower) ||
                    po.vendorName.toLowerCase().includes(searchLower)
                );
            }

            if (filters.status && filters.status !== 'all') {
                filtered = filtered.filter(po => po.status === filters.status);
            }

            const startIndex = (filters.page - 1) * filters.limit;
            const endIndex = startIndex + filters.limit;
            const paginatedData = filtered.slice(startIndex, endIndex);

            setPurchaseOrders(paginatedData);
            setPagination({
                currentPage: filters.page,
                totalPages: Math.ceil(filtered.length / filters.limit),
                totalItems: filtered.length,
                itemsPerPage: filters.limit,
            });

            // Calculate stats
            const totalAmount = filtered.reduce((sum, po) => sum + po.total, 0);
            const receivedThisMonth = filtered.filter(po => {
                if (!po.actualDeliveryDate) return false;
                const receivedDate = new Date(po.actualDeliveryDate);
                const now = new Date();
                return receivedDate.getMonth() === now.getMonth() &&
                    receivedDate.getFullYear() === now.getFullYear();
            }).reduce((sum, po) => sum + po.total, 0);

            setStats({
                totalOrders: filtered.length,
                totalAmount: totalAmount,
                pendingApproval: filtered.filter(po => po.status === 'pending').length,
                pendingReceiving: filtered.filter(po => po.status === 'shipped').length,
                receivedThisMonth: receivedThisMonth,
                averageOrderValue: filtered.length > 0 ? totalAmount / filtered.length : 0,
            });
            setLoading(false);
        }, 1000);
    };

    const handleSearch = () => {
        setFilters({ ...filters, search: localSearch, status: localStatus, page: 1 });
    };

    const clearFilters = () => {
        setLocalSearch("");
        setLocalStatus("all");
        setFilters({ page: 1, limit: 10, search: "", status: "all" });
    };

    const handleViewDetails = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleReceiveOrder = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        const initialQuantities: { [key: number]: number } = {};
        order.items.forEach(item => {
            initialQuantities[item.id] = item.quantity;
        });
        setReceiveQuantities(initialQuantities);
        setShowReceiveModal(true);
    };

    const confirmReceiveOrder = async () => {
        if (!selectedOrder) return;

        // Here you would call API to update received quantities
        toast.success(`Order ${selectedOrder.poNumber} has been received`);
        setShowReceiveModal(false);
        fetchPurchaseOrders();
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
            case 'draft': return "bg-gray-100 text-gray-800";
            case 'pending': return "bg-yellow-100 text-yellow-800";
            case 'approved': return "bg-blue-100 text-blue-800";
            case 'shipped': return "bg-purple-100 text-purple-800";
            case 'received': return "bg-green-100 text-green-800";
            case 'cancelled': return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3.5 h-3.5" />;
            case 'approved': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'shipped': return <Truck className="w-3.5 h-3.5" />;
            case 'received': return <Package className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    const hasActiveFilters = filters.search || (filters.status && filters.status !== 'all');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-2 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Purchase Management</h1>
                        <p className="text-gray-600 mt-2">Manage purchase orders and inventory procurement</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm">
                            <Plus className="w-4 h-4" />
                            Create Purchase Order
                        </button>
                        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Approval</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Receiving</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.pendingReceiving}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Truck className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Received This Month</p>
                                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.receivedThisMonth)}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Order Value</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.averageOrderValue)}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
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
                                    placeholder="Search by PO number or vendor..."
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
                                        <option value="draft">Draft</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="received">Received</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Purchase Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(filters.limit)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={7} className="px-6 py-4">
                                                <div className="animate-pulse">
                                                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : purchaseOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12">
                                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No purchase orders found</h3>
                                            <p className="text-gray-500 mt-1">Create your first purchase order</p>
                                        </td>
                                    </tr>
                                ) : (
                                    purchaseOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.poNumber}</p>
                                                    <p className="text-xs text-gray-500">ID: #{order.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.vendorName}</p>
                                                    <p className="text-xs text-gray-500">{order.vendorEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(order.orderDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Truck className="w-3.5 h-3.5" />
                                                    {formatDate(order.expectedDeliveryDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {order.status === 'shipped' && (
                                                        <button
                                                            onClick={() => handleReceiveOrder(order)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                                                            title="Receive Order"
                                                        >
                                                            <Package className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
                                                        title="Print"
                                                    >
                                                        <Printer className="w-4 h-4" />
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
                                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)} of {pagination.totalItems} orders
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

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Purchase Order Details</h2>
                                    <p className="text-green-100 text-sm">{selectedOrder.poNumber}</p>
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
                                {/* Order Information */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-green-600" />
                                            Order Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">PO Number</p>
                                                <p className="text-sm text-gray-800 font-medium">{selectedOrder.poNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Order Date</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedOrder.orderDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Expected Delivery</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedOrder.expectedDeliveryDate)}</p>
                                            </div>
                                            {selectedOrder.actualDeliveryDate && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Actual Delivery</p>
                                                    <p className="text-sm text-green-600">{formatDate(selectedOrder.actualDeliveryDate)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-green-600" />
                                            Vendor Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Vendor Name</p>
                                                <p className="text-sm text-gray-800">{selectedOrder.vendorName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm text-gray-800">{selectedOrder.vendorEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-green-600" />
                                            Order Items
                                        </h3>
                                        <div className="space-y-2 pl-6">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-2 text-xs text-gray-500">Product</th>
                                                        <th className="text-center py-2 text-xs text-gray-500">Qty</th>
                                                        <th className="text-right py-2 text-xs text-gray-500">Price</th>
                                                        <th className="text-right py-2 text-xs text-gray-500">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.items.map((item) => (
                                                        <tr key={item.id} className="border-b border-gray-100">
                                                            <td className="py-2 text-gray-800">{item.productName}</td>
                                                            <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                                                            <td className="py-2 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                                            <td className="py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t border-gray-200">
                                                        <td colSpan={3} className="py-2 text-right text-gray-600">Subtotal:</td>
                                                        <td className="py-2 text-right font-medium">{formatCurrency(selectedOrder.subtotal)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3} className="py-1 text-right text-gray-600">Tax:</td>
                                                        <td className="py-1 text-right text-gray-600">{formatCurrency(selectedOrder.tax)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3} className="py-1 text-right text-gray-600">Discount:</td>
                                                        <td className="py-1 text-right text-red-600">-{formatCurrency(selectedOrder.discount)}</td>
                                                    </tr>
                                                    <tr className="border-t border-gray-200">
                                                        <td colSpan={3} className="py-2 text-right font-bold text-gray-900">Total:</td>
                                                        <td className="py-2 text-right font-bold text-green-600">{formatCurrency(selectedOrder.total)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    Timeline
                                </h3>
                                <div className="space-y-3 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">Order Created</p>
                                            <p className="text-xs text-gray-500">{formatDateTime(selectedOrder.createdAt)}</p>
                                            <p className="text-xs text-gray-500">By: {selectedOrder.createdBy}</p>
                                        </div>
                                    </div>
                                    {selectedOrder.approvedAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Order Approved</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(selectedOrder.approvedAt)}</p>
                                                <p className="text-xs text-gray-500">By: {selectedOrder.approvedBy}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedOrder.receivedAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Order Received</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(selectedOrder.receivedAt)}</p>
                                                <p className="text-xs text-gray-500">By: {selectedOrder.receivedBy}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                                >
                                    Close
                                </button>
                                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
                                    <Printer className="w-4 h-4" />
                                    Print Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Receive Order Modal */}
            {showReceiveModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Receive Order</h3>
                            <button
                                onClick={() => setShowReceiveModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-900 font-medium">{selectedOrder.poNumber}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.vendorName}</p>
                            </div>

                            <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.productName}</p>
                                                <p className="text-xs text-gray-500">Ordered: {item.quantity} units</p>
                                            </div>
                                            <p className="text-sm font-medium">{formatCurrency(item.unitPrice)}/unit</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">Received Quantity</label>
                                            <input
                                                type="number"
                                                value={receiveQuantities[item.id]}
                                                onChange={(e) => setReceiveQuantities({
                                                    ...receiveQuantities,
                                                    [item.id]: Math.min(Number(e.target.value), item.quantity)
                                                })}
                                                min="0"
                                                max={item.quantity}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Max: {item.quantity} units</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowReceiveModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReceiveOrder}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Confirm Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPurchaseManagement;