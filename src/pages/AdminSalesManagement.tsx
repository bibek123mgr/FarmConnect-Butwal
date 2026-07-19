import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
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
    Package,
    DollarSign,
    Users,
    TrendingUp,
    TrendingDown,
    CreditCard,
    MapPin,
    Phone,
    Printer,
    Send,
    FileText,
    Plus,
} from "lucide-react";
import toast from "react-hot-toast";

// Interfaces
interface SalesOrder {
    id: number;
    orderNumber: string;
    customerId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
    paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';
    orderDate: string;
    deliveryDate?: string;
    items: SalesItem[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
    notes?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface SalesItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface SalesStats {
    totalOrders: number;
    totalRevenue: number;
    totalItems: number;
    averageOrderValue: number;
    pendingOrders: number;
    deliveredThisMonth: number;
    revenueThisMonth: number;
    growth: number;
}

const AdminSalesManagement = () => {
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    // Filter states
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "all",
        paymentStatus: "all",
    });
    const [localSearch, setLocalSearch] = useState("");
    const [localStatus, setLocalStatus] = useState("all");
    const [localPaymentStatus, setLocalPaymentStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });

    const [stats, setStats] = useState<SalesStats>({
        totalOrders: 0,
        totalRevenue: 0,
        totalItems: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        deliveredThisMonth: 0,
        revenueThisMonth: 0,
        growth: 0,
    });

    // Mock data
    const mockSalesOrders: SalesOrder[] = [
        {
            id: 1,
            orderNumber: "ORD-2024-0001",
            customerId: 1,
            customerName: "John Doe",
            customerEmail: "john@example.com",
            customerPhone: "+1 234-567-8901",
            customerAddress: "123 Main St, New York, NY 10001",
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            orderDate: "2024-05-01",
            deliveryDate: "2024-05-03",
            items: [
                { id: 1, productId: 1, productName: "Organic Apples", quantity: 5, unitPrice: 120, total: 600 },
                { id: 2, productId: 2, productName: "Fresh Spinach", quantity: 2, unitPrice: 40, total: 80 },
            ],
            subtotal: 680,
            tax: 54.4,
            shippingCost: 50,
            discount: 0,
            total: 784.4,
            trackingNumber: "TRK123456789",
            createdAt: "2024-05-01T10:00:00Z",
            updatedAt: "2024-05-03T14:30:00Z",
        },
        {
            id: 2,
            orderNumber: "ORD-2024-0002",
            customerId: 2,
            customerName: "Jane Smith",
            customerEmail: "jane@example.com",
            customerPhone: "+1 234-567-8902",
            customerAddress: "456 Oak Ave, Los Angeles, CA 90001",
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'mobile_payment',
            orderDate: "2024-05-05",
            items: [
                { id: 3, productId: 3, productName: "Basmati Rice", quantity: 10, unitPrice: 180, total: 1800 },
            ],
            subtotal: 1800,
            tax: 144,
            shippingCost: 100,
            discount: 50,
            total: 1994,
            trackingNumber: "TRK987654321",
            createdAt: "2024-05-05T11:00:00Z",
            updatedAt: "2024-05-06T09:00:00Z",
        },
        {
            id: 3,
            orderNumber: "ORD-2024-0003",
            customerId: 3,
            customerName: "Bob Johnson",
            customerEmail: "bob@example.com",
            customerPhone: "+1 234-567-8903",
            customerAddress: "789 Pine Rd, Chicago, IL 60601",
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'bank_transfer',
            orderDate: "2024-05-10",
            items: [
                { id: 4, productId: 4, productName: "Organic Honey", quantity: 3, unitPrice: 350, total: 1050 },
                { id: 5, productId: 5, productName: "Fresh Milk", quantity: 4, unitPrice: 60, total: 240 },
            ],
            subtotal: 1290,
            tax: 103.2,
            shippingCost: 75,
            discount: 0,
            total: 1468.2,
            createdAt: "2024-05-10T14:00:00Z",
            updatedAt: "2024-05-10T14:00:00Z",
        },
        {
            id: 4,
            orderNumber: "ORD-2024-0004",
            customerId: 4,
            customerName: "Alice Brown",
            customerEmail: "alice@example.com",
            customerPhone: "+1 234-567-8904",
            customerAddress: "321 Elm St, Houston, TX 77001",
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            orderDate: "2024-05-12",
            items: [
                { id: 6, productId: 6, productName: "Organic Carrots", quantity: 8, unitPrice: 55, total: 440 },
            ],
            subtotal: 440,
            tax: 35.2,
            shippingCost: 0,
            discount: 20,
            total: 455.2,
            createdAt: "2024-05-12T09:00:00Z",
            updatedAt: "2024-05-12T10:00:00Z",
        },
    ];

    useEffect(() => {
        fetchSalesOrders();
    }, [filters]);

    const fetchSalesOrders = async () => {
        setLoading(true);
        setTimeout(() => {
            let filtered = [...mockSalesOrders];

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(order =>
                    order.orderNumber.toLowerCase().includes(searchLower) ||
                    order.customerName.toLowerCase().includes(searchLower) ||
                    order.customerEmail.toLowerCase().includes(searchLower)
                );
            }

            if (filters.status && filters.status !== 'all') {
                filtered = filtered.filter(order => order.status === filters.status);
            }

            if (filters.paymentStatus && filters.paymentStatus !== 'all') {
                filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
            }

            const startIndex = (filters.page - 1) * filters.limit;
            const endIndex = startIndex + filters.limit;
            const paginatedData = filtered.slice(startIndex, endIndex);

            setSalesOrders(paginatedData);
            setPagination({
                currentPage: filters.page,
                totalPages: Math.ceil(filtered.length / filters.limit),
                totalItems: filtered.length,
                itemsPerPage: filters.limit,
            });

            // Calculate stats
            const totalRevenue = filtered.reduce((sum, order) => sum + order.total, 0);
            const totalItems = filtered.reduce((sum, order) =>
                sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
            const deliveredThisMonth = filtered.filter(order => {
                if (!order.deliveryDate) return false;
                const deliveryDate = new Date(order.deliveryDate);
                const now = new Date();
                return deliveryDate.getMonth() === now.getMonth() &&
                    deliveryDate.getFullYear() === now.getFullYear();
            }).reduce((sum, order) => sum + order.total, 0);

            const revenueThisMonth = filtered.filter(order => {
                const orderDate = new Date(order.orderDate);
                const now = new Date();
                return orderDate.getMonth() === now.getMonth() &&
                    orderDate.getFullYear() === now.getFullYear();
            }).reduce((sum, order) => sum + order.total, 0);

            setStats({
                totalOrders: filtered.length,
                totalRevenue: totalRevenue,
                totalItems: totalItems,
                averageOrderValue: filtered.length > 0 ? totalRevenue / filtered.length : 0,
                pendingOrders: filtered.filter(order => order.status === 'pending').length,
                deliveredThisMonth: deliveredThisMonth,
                revenueThisMonth: revenueThisMonth,
                growth: 15.5, // Mock growth percentage
            });
            setLoading(false);
        }, 1000);
    };

    const handleSearch = () => {
        setFilters({ ...filters, search: localSearch, status: localStatus, paymentStatus: localPaymentStatus, page: 1 });
    };

    const clearFilters = () => {
        setLocalSearch("");
        setLocalStatus("all");
        setLocalPaymentStatus("all");
        setFilters({ page: 1, limit: 10, search: "", status: "all", paymentStatus: "all" });
    };

    const handleViewDetails = (order: SalesOrder) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleUpdateStatus = (order: SalesOrder) => {
        setSelectedOrder(order);
        setUpdateStatus(order.status);
        setTrackingNumber(order.trackingNumber || '');
        setShowUpdateStatusModal(true);
    };

    const confirmUpdateStatus = async () => {
        if (!selectedOrder) return;

        // Here you would call API to update order status
        toast.success(`Order ${selectedOrder.orderNumber} status updated to ${updateStatus}`);
        setShowUpdateStatusModal(false);
        fetchSalesOrders();
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
            case 'pending': return "bg-yellow-100 text-yellow-800";
            case 'confirmed': return "bg-blue-100 text-blue-800";
            case 'processing': return "bg-purple-100 text-purple-800";
            case 'shipped': return "bg-indigo-100 text-indigo-800";
            case 'delivered': return "bg-green-100 text-green-800";
            case 'cancelled': return "bg-red-100 text-red-800";
            case 'refunded': return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3.5 h-3.5" />;
            case 'confirmed': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'processing': return <Package className="w-3.5 h-3.5" />;
            case 'shipped': return <Truck className="w-3.5 h-3.5" />;
            case 'delivered': return <CheckCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return "bg-green-100 text-green-800";
            case 'pending': return "bg-yellow-100 text-yellow-800";
            case 'partial': return "bg-orange-100 text-orange-800";
            case 'refunded': return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash': return <DollarSign className="w-4 h-4" />;
            case 'card': return <CreditCard className="w-4 h-4" />;
            default: return <CreditCard className="w-4 h-4" />;
        }
    };

    const hasActiveFilters = filters.search || (filters.status && filters.status !== 'all') || (filters.paymentStatus && filters.paymentStatus !== 'all');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-2 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
                        <p className="text-gray-600 mt-2">Manage customer orders and sales transactions</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm">
                            <Plus className="w-4 h-4" />
                            New Order
                        </button>
                        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Items</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.totalItems}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Order Value</p>
                                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.averageOrderValue)}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">This Month Revenue</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.revenueThisMonth)}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Growth</p>
                                <p className="text-2xl font-bold text-green-600">+{stats.growth}%</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
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
                                    placeholder="Search by order number, customer name or email..."
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                    <select
                                        value={localStatus}
                                        onChange={(e) => setLocalStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                    <select
                                        value={localPaymentStatus}
                                        onChange={(e) => setLocalPaymentStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sales Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
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
                                ) : salesOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12">
                                            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                                            <p className="text-gray-500 mt-1">No sales orders match your filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    salesOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                                    <p className="text-xs text-gray-500">ID: #{order.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                                                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(order.orderDate)}
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
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
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
                                                    <button
                                                        onClick={() => handleUpdateStatus(order)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                                                        title="Update Status"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
                                                        title="Print Invoice"
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
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Order Details</h2>
                                    <p className="text-green-100 text-sm">{selectedOrder.orderNumber}</p>
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
                                {/* Customer Information */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-green-600" />
                                            Customer Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Customer Name</p>
                                                <p className="text-sm text-gray-800 font-medium">{selectedOrder.customerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm text-gray-800">{selectedOrder.customerEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    {selectedOrder.customerPhone}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Address</p>
                                                <div className="flex items-start gap-1.5 text-sm text-gray-800">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                                    {selectedOrder.customerAddress}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            Order Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Order Date</p>
                                                <p className="text-sm text-gray-800">{formatDate(selectedOrder.orderDate)}</p>
                                            </div>
                                            {selectedOrder.deliveryDate && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Delivery Date</p>
                                                    <p className="text-sm text-gray-800">{formatDate(selectedOrder.deliveryDate)}</p>
                                                </div>
                                            )}
                                            {selectedOrder.trackingNumber && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Tracking Number</p>
                                                    <p className="text-sm text-blue-600">{selectedOrder.trackingNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-green-600" />
                                            Payment Information
                                        </h3>
                                        <div className="space-y-2.5 pl-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Method</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-800">
                                                    {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                                                    {selectedOrder.paymentMethod === 'mobile_payment' ? 'Mobile Payment' :
                                                        selectedOrder.paymentMethod.charAt(0).toUpperCase() + selectedOrder.paymentMethod.slice(1)}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Status</p>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                                                    {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="pt-3 border-t border-gray-100">
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
                                                        <td colSpan={3} className="py-1 text-right text-gray-600">Shipping:</td>
                                                        <td className="py-1 text-right text-gray-600">{formatCurrency(selectedOrder.shippingCost)}</td>
                                                    </tr>
                                                    {selectedOrder.discount > 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="py-1 text-right text-gray-600">Discount:</td>
                                                            <td className="py-1 text-right text-red-600">-{formatCurrency(selectedOrder.discount)}</td>
                                                        </tr>
                                                    )}
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
                                    Order Timeline
                                </h3>
                                <div className="space-y-3 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">Order Created</p>
                                            <p className="text-xs text-gray-500">{formatDateTime(selectedOrder.createdAt)}</p>
                                        </div>
                                    </div>
                                    {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Status Updated to {selectedOrder.status}</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(selectedOrder.updatedAt)}</p>
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
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Update Status
                                </button>
                                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2">
                                    <Printer className="w-4 h-4" />
                                    Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showUpdateStatusModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Update Order Status</h3>
                            <button
                                onClick={() => setShowUpdateStatusModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order
                                </label>
                                <p className="text-gray-900 font-medium">{selectedOrder.orderNumber}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.customerName}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Status
                                </label>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Status *
                                </label>
                                <select
                                    value={updateStatus}
                                    onChange={(e) => setUpdateStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {updateStatus === 'shipped' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tracking Number
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter tracking number"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Add any remarks..."
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowUpdateStatusModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUpdateStatus}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminSalesManagement;