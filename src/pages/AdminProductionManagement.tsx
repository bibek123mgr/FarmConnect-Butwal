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
    Filter,
    ChevronDown,
    RefreshCw,
    Plus,
    Loader2,
    Factory,
    ClipboardList,
    TrendingUp,
    Printer,
    Edit,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchProductForCombobox } from "../features/product/productApi";
import { createProduction, fetchProductions, updateProduction, deleteProduction, fetchProductionStats } from "../features/production/productionApi";

// Interface matching the actual data structure
interface ProductionRecord {
    id: number;
    productId: number;
    productName: string;
    farmId: number;
    farmName: string;
    quantity: number;
    costPerUnit: number;
    remarks: string;
    createdAt: string;
}

interface ProductionStats {
    totalProduction: number;
    totalValue: number;
    averageRate: number;
}

const AdminProductionManagement = () => {
    const dispatch = useAppDispatch();
    const { productsForCombobox: products } = useAppSelector((state) => state.product);
    const { productions, pagination: productionPagination, loading: productionLoading, productionStats } = useAppSelector((state) => state.production);
    const { user } = useAppSelector((state) => state.auth);

    const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state for both create and edit - Changed to string for number fields
    const [formData, setFormData] = useState({
        id: 0,
        productId: "",
        quantity: "",      // Changed from 0 to empty string
        costPerUnit: "",   // Changed from 0 to empty string
        remarks: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
    });
    const [localSearch, setLocalSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const [stats, setStats] = useState<ProductionStats>({
        totalProduction: 0,
        totalValue: 0,
        averageRate: 0,
    });

    // Fetch productions when filters change
    useEffect(() => {
        dispatch(fetchProductions(filters));
    }, [filters, dispatch]);

    // Fetch products for dropdown
    useEffect(() => {
        dispatch(fetchProductForCombobox());
        dispatch(fetchProductionStats());
    }, [dispatch]);



    // Calculate stats whenever productions change
    useEffect(() => {
        if (productions && productions.length > 0) {
            const totalProduction = productions.reduce((sum, record) => sum + record.quantity, 0);
            const totalValue = productions.reduce((sum, record) => sum + (record.quantity * record.costPerUnit), 0);
            const averageRate = totalProduction > 0 ? totalValue / totalProduction : 0;

            setStats({
                totalProduction,
                totalValue,
                averageRate,
            });
        } else {
            setStats({
                totalProduction: 0,
                totalValue: 0,
                averageRate: 0,
            });
        }
    }, [productions]);

    const handleSearch = () => {
        setFilters({ ...filters, search: localSearch, page: 1 });
    };

    const clearFilters = () => {
        setLocalSearch("");
        setFilters({ page: 1, limit: 10, search: "" });
    };

    const handleViewDetails = (record: ProductionRecord) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setFormData({
            id: 0,
            productId: "",
            quantity: "",      // Empty string
            costPerUnit: "",   // Empty string
            remarks: "",
        });
        setShowFormModal(true);
    };

    const handleEdit = (record: ProductionRecord) => {
        setIsEditing(true);
        setFormData({
            id: record.id,
            productId: record.productId.toString(),
            quantity: record.quantity.toString(),      // Convert to string
            costPerUnit: record.costPerUnit.toString(), // Convert to string
            remarks: record.remarks || "",
        });
        setShowFormModal(true);
    };

    const handleDeleteClick = (record: ProductionRecord) => {
        setSelectedRecord(record);
        setShowDeleteConfirm(true);
    };

    // Simplified handleInputChange - just sets the value directly
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const productId = e.target.value;
        setFormData({
            ...formData,
            productId: productId
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Parse the string values to numbers
        const quantity = parseFloat(formData.quantity as string);
        const costPerUnit = parseFloat(formData.costPerUnit as string);

        // Validate inputs
        if (!formData.productId || isNaN(quantity) || quantity <= 0 || isNaN(costPerUnit) || costPerUnit <= 0) {
            toast.error("Please fill in all required fields with valid numbers");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditing) {
                // Update existing record
                const updatedRecord = {
                    productId: parseInt(formData.productId),
                    quantity: quantity,
                    rate: costPerUnit,
                    remarks: formData.remarks
                };
                const id = formData.id
                await dispatch(updateProduction({ payload: updatedRecord, id })).unwrap();
                toast.success("Production record updated successfully");
            } else {
                // Create new record
                const newRecord = {
                    productId: parseInt(formData.productId),
                    quantity: quantity,
                    rate: costPerUnit,
                    remarks: formData.remarks
                };
                await dispatch(createProduction(newRecord)).unwrap();
                toast.success("Production record created successfully");
            }
            setShowFormModal(false);
            setFormData({ id: 0, productId: "", quantity: "", costPerUnit: "", remarks: "" });
            // Refresh the list
            dispatch(fetchProductions(filters));
        } catch (error) {
            toast.error(isEditing ? "Failed to update production record" : "Failed to create production record");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteProduction(selectedRecord.id)).unwrap();
            toast.success("Production record deleted successfully");
            setShowDeleteConfirm(false);
            setSelectedRecord(null);
            // Refresh the list
            dispatch(fetchProductions(filters));
        } catch (error) {
            toast.error("Failed to delete production record");
        } finally {
            setIsDeleting(false);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= (productionPagination?.totalPages || 1)) {
            setFilters({ ...filters, page });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, limit: Number(e.target.value), page: 1 });
    };

    const getPageNumbers = () => {
        const totalPages = productionPagination?.totalPages || 1;
        const page = productionPagination?.page || 1;
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
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

    const hasActiveFilters = filters.search !== "";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Production Management</h1>
                        <p className="text-gray-600 mt-2">Manage production records and track inventory</p>
                    </div>
                    {user?.role === "farmer" &&
                        <div className="flex gap-3">
                            <button
                                onClick={handleAdd}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Production
                            </button>
                        </div>
                    }
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Production</p>
                                <p className="text-2xl font-bold text-gray-900">{productionStats?.totalQuantity} units</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Factory className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Value</p>
                                <p className="text-2xl font-bold text-green-600">Rs. {productionStats?.totalCost}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-green-600">Rs.</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Records</p>
                                <p className="text-2xl font-bold text-orange-600">{productionStats?.totalProductions}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-orange-600" />
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
                                    placeholder="Search by product name or remarks..."
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
                    </div>
                </div>

                {/* Production Records Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Farm</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Unit</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    {user?.role === "farmer" &&
                                        <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    }
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {productionLoading ? (
                                    [...Array(filters.limit)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={8} className="px-6 py-4">
                                                <div className="animate-pulse">
                                                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : !productions || productions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No production records found</h3>
                                            <p className="text-gray-500 mt-1">Click "Add Production Record" to create one</p>
                                        </td>
                                    </tr>
                                ) : (
                                    productions.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{record.productName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm text-gray-900">{record.farmName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-gray-900">{record.quantity.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-gray-900">Rs. {record.costPerUnit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-bold text-green-600">Rs. {(record.quantity * record.costPerUnit).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 max-w-xs truncate">
                                                    {record.remarks || "-"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(record.createdAt)}
                                                </div>
                                            </td>
                                            {user?.role === "farmer" &&
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(record)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(record)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(record)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {(productionPagination?.total || 0) > 0 && (
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
                                    Showing {((productionPagination?.page || 1) - 1) * filters.limit + 1} to {Math.min((productionPagination?.page || 1) * filters.limit, productionPagination?.total || 0)} of {productionPagination?.total || 0} records
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(1)}
                                    disabled={productionPagination?.page === 1}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${productionPagination?.page === 1
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                        }`}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => goToPage((productionPagination?.page || 1) - 1)}
                                    disabled={productionPagination?.page === 1}
                                    className={`p-2 rounded-lg border transition ${productionPagination?.page === 1
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
                                        className={`px-3 py-1 rounded-lg transition text-sm ${productionPagination?.page === page
                                            ? "bg-green-600 text-white"
                                            : "text-gray-600 hover:bg-green-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage((productionPagination?.page || 1) + 1)}
                                    disabled={productionPagination?.page === productionPagination?.totalPages}
                                    className={`p-2 rounded-lg border transition ${productionPagination?.page === productionPagination?.totalPages
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                        }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => goToPage(productionPagination?.totalPages || 1)}
                                    disabled={productionPagination?.page === productionPagination?.totalPages}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${productionPagination?.page === productionPagination?.totalPages
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

            {/* Single Form Modal for Add/Edit */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                        <div className={`sticky top-0 px-6 py-4 rounded-t-2xl flex justify-between items-center
                                bg-gradient-to-r from-green-600 to-green-500
                        `}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditing ? "bg-white/20" : "bg-white/20"
                                    }`}>
                                    {isEditing ? (
                                        <Edit className="w-5 h-5 text-white" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {isEditing ? "Edit Production" : "Add Production"}
                                    </h2>
                                    <p className="text-white/90 text-sm">
                                        {isEditing ? "Update production details" : "Enter production details"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFormModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleProductSelect}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products?.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.unit})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter quantity"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cost Per Unit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="costPerUnit"
                                    value={formData.costPerUnit}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Optional remarks..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                />
                            </div>

                            {formData.productId && formData.quantity && formData.costPerUnit &&
                                parseFloat(formData.quantity as string) > 0 &&
                                parseFloat(formData.costPerUnit as string) > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Amount:</span>
                                            <span className="text-xl font-bold text-green-600">
                                                Rs. {(parseFloat(formData.quantity as string) * parseFloat(formData.costPerUnit as string)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50
                                            bg-green-600 hover:bg-green-700
                                    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {isEditing ? "Updating..." : "Adding..."}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            {isEditing ? "Update Record" : "Add Record"}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedRecord && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Delete Production Record</h2>
                                    <p className="text-red-100 text-sm">This action cannot be undone</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete the production record for <strong>{selectedRecord.productName}</strong>?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-red-800">
                                    <strong>Quantity:</strong> {selectedRecord.quantity.toLocaleString()} units<br />
                                    <strong>Total Value:</strong> Rs. {(selectedRecord.quantity * selectedRecord.costPerUnit).toLocaleString()}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                This will permanently delete this production record from the system.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Yes, Delete
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Production Details Modal */}
            {showDetailsModal && selectedRecord && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Production Details</h2>
                                    <p className="text-green-100 text-sm">Record ID: #{selectedRecord.id}</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Product</p>
                                        <p className="text-lg font-semibold text-gray-900">{selectedRecord.productName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Farm</p>
                                        <p className="text-lg font-semibold text-gray-900">{selectedRecord.farmName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Quantity Produced</p>
                                        <p className="text-2xl font-bold text-gray-900">{selectedRecord.quantity.toLocaleString()} units</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Cost Per Unit</p>
                                        <p className="text-xl font-semibold text-gray-900">Rs. {selectedRecord.costPerUnit}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600">Rs. {(selectedRecord.quantity * selectedRecord.costPerUnit).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Production Date</p>
                                        <p className="text-gray-800">{formatDate(selectedRecord.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Remarks</p>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRecord.remarks || "No remarks"}</p>
                                    </div>
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
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleEdit(selectedRecord);
                                    }}
                                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Record
                                </button>
                                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2">
                                    <Printer className="w-4 h-4" />
                                    Print Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductionManagement;