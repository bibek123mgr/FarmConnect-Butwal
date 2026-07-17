import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Eye,
    X,
    CheckCircle,
    Filter,
    ChevronDown,
    RefreshCw,
    Plus,
    Loader2,
    Printer,
    Edit,
    Trash2,
    AlertTriangle,
    Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

import type { DamageStats } from "../features/damage/DamageSlice";
import { createDamage, deleteDamages, fetchDamages, fetchDamageStats } from "../features/damage/DamageApi";

// Interface matching the actual data structure
interface DamageRecord {
    id: number;
    productId: number;
    productName: string;
    farmId: number;
    farmName: string;
    quantity: number;
    lossAmount: number;
    remarks: string;
    createdAt: string;
    damageType?: string;
    cause?: string;
}


const AdminDamageManagement = () => {
    const dispatch = useAppDispatch();
    const { damages, pagination: damagePagination, loading: damageLoading, damageStats } = useAppSelector((state) => state.damage);
    const { user } = useAppSelector((state) => state.auth);

    const [selectedRecord, setSelectedRecord] = useState<DamageRecord | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { productsForCombobox: products } = useAppSelector((state) => state.product);


    // Form state for both create and edit
    const [formData, setFormData] = useState({
        id: 0,
        productId: "",
        quantity: "",
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

    // Fetch damages when filters change
    useEffect(() => {
        dispatch(fetchDamages(filters));
    }, [filters, dispatch]);

    // Fetch damage stats
    useEffect(() => {
        dispatch(fetchDamageStats());
    }, [dispatch]);


    const handleSearch = () => {
        setFilters({ ...filters, search: localSearch, page: 1 });
    };

    const clearFilters = () => {
        setLocalSearch("");
        setFilters({ page: 1, limit: 10, search: "" });
    };

    const handleViewDetails = (record: DamageRecord) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setFormData({
            id: 0,
            productId: "",
            quantity: "",
            remarks: "",
        });
        setShowFormModal(true);
    };

    const handleEdit = (record: DamageRecord) => {
        setIsEditing(true);
        setFormData({
            id: record.id,
            productId: record.productId.toString(),
            quantity: record.quantity.toString(),
            remarks: record.remarks || "",
        });
        setShowFormModal(true);
    };

    const handleDeleteClick = (record: DamageRecord) => {
        setSelectedRecord(record);
        setShowDeleteConfirm(true);
    };

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

        const quantity = parseFloat(formData.quantity as string);

        if (!formData.productId || isNaN(quantity) || quantity <= 0) {
            toast.error("Please select a product and enter a valid quantity");
            return;
        }

        setIsSubmitting(true);
        try {

            const newRecord = {
                productId: parseInt(formData.productId),
                quantity: quantity,
                remarks: formData.remarks
            };
            await dispatch(createDamage(newRecord)).unwrap();
            toast.success("Damage record created successfully");

            setShowFormModal(false);
            setFormData({
                id: 0,
                productId: "",
                quantity: "",
                remarks: ""
            });
            dispatch(fetchDamages(filters));
        } catch (error) {
            toast.error(isEditing ? "Failed to update damage record" : "Failed to create damage record");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteDamages(selectedRecord.id)).unwrap();
            toast.success("Damage record deleted successfully");
            setShowDeleteConfirm(false);
            setSelectedRecord(null);
            dispatch(fetchDamages(filters));
            dispatch(fetchDamageStats());
        } catch (error) {
            toast.error("Failed to delete damage record");
        } finally {
            setIsDeleting(false);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= (damagePagination?.totalPages || 1)) {
            setFilters({ ...filters, page });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, limit: Number(e.target.value), page: 1 });
    };

    const getPageNumbers = () => {
        const totalPages = damagePagination?.totalPages || 1;
        const page = damagePagination?.page || 1;
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
                        <h1 className="text-3xl font-bold text-gray-900">Damage Management</h1>
                        <p className="text-gray-600 mt-2">Track and manage damaged inventory and losses</p>
                    </div>
                    {user?.role === "farmer" &&
                        <div className="flex gap-3">
                            <button
                                onClick={handleAdd}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Create Damage
                            </button>
                        </div>
                    }
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Damaged Items</p>
                                <p className="text-2xl font-bold text-green-600">{damageStats?.totalQuantity || 0} units</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Loss Value</p>
                                <p className="text-2xl font-bold text-green-600">Rs. {damageStats?.totalLossAmount || 0}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-green-600">Rs.</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Damage Reports</p>
                                <p className="text-2xl font-bold text-orange-600">{damageStats?.totalDamages || 0}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-orange-600" />
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
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-green-600 hover:bg-green-50 transition flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Damage Records Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Farm</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loss</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    {user?.role === "farmer" &&
                                        <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    }
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {damageLoading ? (
                                    [...Array(filters.limit)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={8} className="px-6 py-4">
                                                <div className="animate-pulse">
                                                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : !damages || damages.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">No damage records found</h3>
                                            <p className="text-gray-500 mt-1">Click "Create Damage" to create one</p>
                                        </td>
                                    </tr>
                                ) : (
                                    damages.map((record) => (
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
                                                <span className="font-semibold text-green-600">{record.quantity.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-gray-900">Rs. {record.lossAmount}</span>
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
                                                            onClick={() => handleDeleteClick(record)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
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
                    {(damagePagination?.total || 0) > 0 && (
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
                                    Showing {((damagePagination?.page || 1) - 1) * filters.limit + 1} to {Math.min((damagePagination?.page || 1) * filters.limit, damagePagination?.total || 0)} of {damagePagination?.total || 0} records
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(1)}
                                    disabled={damagePagination?.page === 1}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${damagePagination?.page === 1
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                        }`}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => goToPage((damagePagination?.page || 1) - 1)}
                                    disabled={damagePagination?.page === 1}
                                    className={`p-2 rounded-lg border transition ${damagePagination?.page === 1
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
                                        className={`px-3 py-1 rounded-lg transition text-sm ${damagePagination?.page === page
                                            ? "bg-green-600 text-white"
                                            : "text-gray-600 hover:bg-green-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage((damagePagination?.page || 1) + 1)}
                                    disabled={damagePagination?.page === damagePagination?.totalPages}
                                    className={`p-2 rounded-lg border transition ${damagePagination?.page === damagePagination?.totalPages
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                                        }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => goToPage(damagePagination?.totalPages || 1)}
                                    disabled={damagePagination?.page === damagePagination?.totalPages}
                                    className={`px-3 py-1 rounded-lg border transition text-sm ${damagePagination?.page === damagePagination?.totalPages
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
                                        <AlertTriangle className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {isEditing ? "Edit Damage Record" : "Create Damage"}
                                    </h2>
                                    <p className="text-white/90 text-sm">
                                        {isEditing ? "Update damage details" : "Enter damage details"}
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
                                    Product <span className="text-green-500">*</span>
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
                                    Quantity Damaged <span className="text-green-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter quantity"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    min="1"
                                    step="1"
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
                                    placeholder="Additional details about the damage..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                />
                            </div>

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
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Create Damage
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
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Delete Damage Record</h2>
                                    <p className="text-green-100 text-sm">This action cannot be undone</p>
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
                                Are you sure you want to delete the damage record for <strong>{selectedRecord.productName}</strong>?
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-green-800">
                                    <strong>Quantity:</strong> {selectedRecord.quantity.toLocaleString()} units<br />
                                    <strong>Total Loss:</strong> Rs. {(selectedRecord.quantity * selectedRecord.costPerUnit).toLocaleString()}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                This will permanently delete this damage record from the system.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
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

            {/* Damage Details Modal */}
            {showDetailsModal && selectedRecord && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Damage Details</h2>
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
                                        <p className="text-xs text-gray-500">Quantity Damaged</p>
                                        <p className="text-2xl font-bold text-green-600">{selectedRecord.quantity.toLocaleString()} units</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Total Loss</p>
                                        <p className="text-2xl font-bold text-green-600">Rs. {selectedRecord.lossAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Created Date</p>
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
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDamageManagement;