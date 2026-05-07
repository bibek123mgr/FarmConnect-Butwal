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
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../features/product/productApi";
import { fetchCategories } from "../features/category/CategoryApi";
import ProductCardSkeleton from "../components/ProductCardSkleton";

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
  const { products, loading, pagination } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string>("all");
  const [localStockStatus, setLocalStockStatus] = useState<string>("all");
  const [localSortBy, setLocalSortBy] = useState<string>("name");
  const [localSortOrder, setLocalSortOrder] = useState<string>("asc");
  
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
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

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    outOfStock: 0,
    lowStock: 0,
    activeProducts: 0,
  });

  const fetchProductsWithFilters = () => {
    const filters: any = {
      page: currentPage,
      limit: limit,
      productname: searchTerm || "all",
      category: selectedCategory === "all" ? "all" : selectedCategory,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    if (stockStatus === "inStock") {
      filters.minStock = 1;
    } else if (stockStatus === "outOfStock") {
      filters.stock = 0;
    } else if (stockStatus === "lowStock") {
      filters.maxStock = 10;
      filters.minStock = 1;
    }

    dispatch(fetchProducts(filters));
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
    fetchProductsWithFilters();
  }, [dispatch, currentPage, limit, searchTerm, selectedCategory, stockStatus, sortBy, sortOrder]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      const totalProducts = products.length;
      const outOfStock = products.filter((p) => (p.quantity || 0) === 0).length;
      const lowStock = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length;
      const activeProducts = products.filter((p) => (p.quantity || 0) > 0).length;

      setStats({
        totalProducts,
        totalValue: 0,
        outOfStock,
        lowStock,
        activeProducts,
      });
    }
  }, [products]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.rate,
      categoryId: product.categoryId || "",
      openingStock: product.quantity || 0,
      unit: product.unit || "kg",
      description: product.description || "",
      image: product.image || "",
    });
    setPreviewImage(product.image || "");
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
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
        formDataToSend.append("id", editingProduct.id.toString());
        await dispatch(updateProduct(formDataToSend));
        toast.success("Product updated successfully");
        handleCancelEdit();
      } else {
        await dispatch(createProduct(formDataToSend));
        toast.success("Product created successfully");
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
      }
      
      fetchProductsWithFilters();
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
      fetchProductsWithFilters();
    }
  };

  const totalPages = pagination?.total || 1;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your store products inventory</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalProducts}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Inventory Value</p>
                <p className="text-xl font-bold text-green-600 mt-1">Rs. {stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">In Stock</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeProducts}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.lowStock}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[450px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden border border-gray-100">
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Organic Himalayan Apples"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    style={{ height: "44px" }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rs.</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ height: "44px" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    style={{ height: "44px" }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    name="openingStock"
                    value={formData.openingStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ height: "44px" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    style={{ height: "44px" }}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-green-50"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>

                  {previewImage && (
                    <div className="mt-3 relative group">
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
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

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-md text-sm"
                    style={{ height: "44px" }}
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
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition text-sm"
                      style={{ height: "44px" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ height: "42px" }}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm"
                    style={{ height: "42px" }}
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      style={{ height: "42px" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <select
                      value={localSelectedCategory}
                      onChange={(e) => setLocalSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      style={{ height: "44px" }}
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
                    <label className="block text-xs text-gray-500 mb-1">Stock Status</label>
                    <select
                      value={localStockStatus}
                      onChange={(e) => setLocalStockStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      style={{ height: "44px" }}
                    >
                      <option value="all">All Stock</option>
                      <option value="inStock">In Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                      <option value="lowStock">Low Stock (&lt;10)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Sort By</label>
                    <div className="flex gap-2">
                      <select
                        value={localSortBy}
                        onChange={(e) => setLocalSortBy(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        style={{ height: "44px" }}
                      >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="stock">Stock</option>
                        <option value="createdAt">Date Added</option>
                      </select>
                      <button
                        onClick={() => handleLocalSortChange(localSortBy)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                        style={{ height: "44px" }}
                      >
                        {localSortOrder === "asc" ? "↑" : "↓"}
                      </button>
                    </div>
                  </div>
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

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(limit)].map((_, index) => (
                        <tr key={index}>
                          <td colSpan={5} className="px-4 py-4">
                            <ProductCardSkeleton />
                          </td>
                        </tr>
                      ))
                    ) : products?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                          <p className="text-gray-500 text-sm">Try adjusting your filters or add a new product</p>
                        </td>
                      </tr>
                    ) : (
                      products?.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=50"}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <span className="font-medium text-gray-800 text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{product.categoryName}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-800">Rs. {formatPrice(product.rate)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}>
                              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;