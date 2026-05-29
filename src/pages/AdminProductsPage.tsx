import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  Edit2,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Upload,
  RefreshCw,
  Eye,
  Plus,
  Filter,
  ChevronDown,
  Clock,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchProductsForAdmin, createProduct, updateProduct, deleteProduct } from "../features/product/productApi";
import { fetchCategories } from "../features/category/CategoryApi";

interface ProductFormData {
  id?: number;
  name: string;
  price: number;
  categoryId: number | string;
  openingStock: number;
  unit: string;
  description: string;
  image?: File | string;
}

const AdminProductsPage = () => {
  const dispatch = useAppDispatch();
  const { productsAdmin: products, loading, adminProductPagination: pagination } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [showFilters, setShowFilters] = useState(false);

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string>("all");
  const [localStockStatus, setLocalStockStatus] = useState<string>("all");
  const [localSortBy, setLocalSortBy] = useState<string>("name");
  const [localSortOrder, setLocalSortOrder] = useState<string>("asc");

  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    categoryId: "",
    openingStock: 0,
    unit: "kg",
    description: "",
    image: undefined,
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProductsForAdminWithFilters = () => {
    const filters = {
      page: currentPage,
      limit: limit,
      productname: searchTerm || "all",
      category: selectedCategory === "all" ? "all" : selectedCategory,
    };
    dispatch(fetchProductsForAdmin(filters));
  };

  const handleSearch = () => {
    setSearchTerm(localSearchTerm);
    setSelectedCategory(localSelectedCategory);
    setStockStatus(localStockStatus);
    setSortBy(localSortBy);
    setSortOrder(localSortOrder);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setLocalSearchTerm("");
    setLocalSelectedCategory("all");
    setLocalStockStatus("all");
    setLocalSortBy("name");
    setLocalSortOrder("asc");

    setSearchTerm("");
    setSelectedCategory("all");
    setStockStatus("all");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProductsForAdminWithFilters();
  }, [dispatch, currentPage, limit, searchTerm, selectedCategory]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.rate,
      categoryId: product.categoryId || "",
      openingStock: product.OpeningStock || 0,
      unit: product.unit || "kg",
      description: product.description || "",
      image: product.image || "",
    });
    setPreviewImage(`http://localhost:3000/image/${product.image}` || "");
    setSelectedFile(null);
    setShowProductModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      categoryId: "",
      openingStock: 0,
      unit: "kg",
      description: "",
      image: undefined,
    });
    setPreviewImage("");
    setSelectedFile(null);
    setShowProductModal(true);
  };

  const handleCancelEdit = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      categoryId: "",
      openingStock: 0,
      unit: "kg",
      description: "",
      image: undefined,
    });
    setPreviewImage("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setSelectedFile(null);
    setFormData({
      ...formData,
      image: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "openingStock"
        ? parseFloat(value) || 0
        : value,
    });
  };

  const formatPrice = (price: any) => {
    return parseFloat(price).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("rate", formData.price.toString());
    formDataToSend.append("categoryId", formData.categoryId.toString());
    formDataToSend.append("quantity", formData.openingStock.toString());
    formDataToSend.append("unit", formData.unit);
    formDataToSend.append("description", formData.description || "");

    if (selectedFile) {
      formDataToSend.append("image", selectedFile);
    }

    try {
      if (editingProduct && editingProduct.id) {
        await dispatch(updateProduct({ payload: formDataToSend, id: editingProduct.id }));
        toast.success("Product updated successfully");
        handleCancelEdit();
      } else {
        await dispatch(createProduct(formDataToSend));
        toast.success("Product created successfully");
        handleCancelEdit();
      }

      fetchProductsForAdminWithFilters();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProduct(productId));
      toast.success("Product deleted successfully");
      fetchProductsForAdminWithFilters();
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalProducts = pagination?.total || 0;

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

  const handleLocalSortChange = (field: string) => {
    if (localSortBy === field) {
      setLocalSortOrder(localSortOrder === "asc" ? "desc" : "asc");
    } else {
      setLocalSortBy(field);
      setLocalSortOrder("asc");
    }
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

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all" || stockStatus !== "all";

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return { text: "Out of Stock", color: "bg-red-100 text-red-800", icon: AlertTriangle };
    } else if (quantity < 10) {
      return { text: `Low Stock (${quantity})`, color: "bg-orange-100 text-orange-800", icon: AlertTriangle };
    } else {
      return { text: `${quantity} in stock`, color: "bg-green-100 text-green-800", icon: CheckCircle };
    }
  };

  // Calculate stats from API data
  const inStockCount = products?.filter(p => (p.quantity || 0) > 0).length || 0;
  const outOfStockCount = products?.filter(p => (p.quantity || 0) === 0).length || 0;
  const lowStockCount = products?.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length || 0;
  const totalValue = products?.reduce((sum, p) => sum + ((parseFloat(p.rate) || 0) * (p.quantity || 0)), 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your store products inventory</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Products", value: totalProducts, color: "purple", icon: Package },
            { label: "Opening Stock", value: inStockCount, color: "green", icon: TrendingUp },
            { label: "Out of Stock", value: outOfStockCount, color: "yellow", icon: TrendingDown },
            { label: "Low Stock", value: lowStockCount, color: "red", icon: AlertTriangle },
            { label: "Inventory Value", value: formatCurrency(totalValue), color: "blue", icon: DollarSign },
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

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products by name..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={localSelectedCategory}
                    onChange={(e) => setLocalSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                  <select
                    value={localStockStatus}
                    onChange={(e) => setLocalStockStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Stock</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                    <option value="lowStock">Low Stock (&lt;10)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <select
                      value={localSortBy}
                      onChange={(e) => setLocalSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="stock">Stock</option>
                      <option value="createdAt">Date Added</option>
                    </select>
                    <button
                      onClick={() => handleLocalSortChange(localSortBy)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                      {localSortOrder === "asc" ? "↑" : "↓"}
                    </button>
                  </div>
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
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                    Category: {categories?.find(c => c.id.toString() === selectedCategory)?.name}
                    <button onClick={() => {
                      setLocalSelectedCategory("all");
                      setSelectedCategory("all");
                      setCurrentPage(1);
                    }} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {stockStatus !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs">
                    Stock: {stockStatus === "inStock" ? "In Stock" : stockStatus === "outOfStock" ? "Out of Stock" : "Low Stock"}
                    <button onClick={() => {
                      setLocalStockStatus("all");
                      setStockStatus("all");
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

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                ) : products?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                      <p className="text-gray-500 mt-1">Try adjusting your filters or add a new product</p>
                    </td>
                  </tr>
                ) : (
                  products?.map((product) => {
                    const stockBadge = getStockBadge(Number(product.quantity || 0));
                    const StockIcon = stockBadge.icon;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`http://localhost:3000/image/${product.image}`}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=No+Image";
                              }}
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">ID: #{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                            <Tag className="w-3 h-3" />
                            {product.categoryName || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">₹{formatPrice(product.rate)}</span>
                          <p className="text-xs text-gray-500">per {product.unit}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{product.quantity || 0} {product.unit}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stockBadge.color}`}>
                            <StockIcon className="w-3.5 h-3.5" />
                            {stockBadge.text}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(product.cre)}
                          </div>
                        </td> */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalProducts > 0 && (
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
                  Showing {products?.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
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

      {/* Add/Edit Product Modal - Same as before */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-green-100 text-sm">
                    {editingProduct ? `Editing: ${editingProduct.name}` : "Fill in the product details"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Organic Apples"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Stock</label>
                  <input
                    type="number"
                    name="openingStock"
                    value={formData.openingStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition bg-gray-50 hover:bg-green-50"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>

                  {previewImage && (
                    <div className="mt-3 relative group">
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingProduct ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;