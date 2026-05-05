// AdminCategoriesPage.tsx
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
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  FileText,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../features/category/CategoryApi";
import CategoryCardSkeleton from "../components/CategoryCardSkeleton";

interface CategoryFormData {
  id?: number;
  name: string;
  description: string;
  image: string;
}

const AdminCategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, pagination } = useAppSelector((state) => state.category);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  
  // Local filter states (for form inputs before search)
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSortBy, setLocalSortBy] = useState<string>("name");
  const [localSortOrder, setLocalSortOrder] = useState<string>("asc");
  
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
  });

  // Function to fetch categories with current filters
  const fetchCategoriesWithFilters = () => {
    const filters: any = {
      page: currentPage,
      limit: limit,
      name: searchTerm || "all",
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    dispatch(fetchCategories(filters));
  };

  // Handle search button click
  const handleSearch = () => {
    setSearchTerm(localSearchTerm);
    setSortBy(localSortBy);
    setSortOrder(localSortOrder);
    setCurrentPage(1);
  };

  // Handle clear filters
  const clearFilters = () => {
    setLocalSearchTerm("");
    setLocalSortBy("name");
    setLocalSortOrder("asc");
    
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // Fetch categories when search params, page, or limit changes
  useEffect(() => {
    fetchCategoriesWithFilters();
  }, [dispatch, currentPage, limit, searchTerm, sortBy, sortOrder]);

  // Update stats when categories change
  useEffect(() => {
    if (categories) {
      setStats({
        totalCategories: pagination?.total || categories.length,
        activeCategories: categories.length,
      });
    }
  }, [categories, pagination]);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setPreviewImage(category.image || "");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({
        ...formData,
        image: imageUrl,
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFormData({
      ...formData,
      image: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please fill in category name");
      return;
    }

    setIsSubmitting(true);

    const categoryData = {
      name: formData.name,
      description: formData.description,
      image: previewImage || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
    };

    if (editingCategory) {
      await dispatch(updateCategory({ id: editingCategory.id, ...categoryData }));
      toast.success("Category updated successfully");
      handleCancelEdit();
    } else {
      await dispatch(createCategory(categoryData));
      toast.success("Category created successfully");
      setFormData({
        name: "",
        description: "",
        image: "",
      });
      setPreviewImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    setIsSubmitting(false);
    fetchCategoriesWithFilters();
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category? Products in this category will be affected.")) {
      await dispatch(deleteCategory(categoryId));
      toast.success("Category deleted successfully");
      fetchCategoriesWithFilters();
    }
  };

  const totalPages = pagination?.totalPages || Math.ceil((pagination?.total || 0) / limit) || 1;
  const totalCategories = pagination?.total || 0;

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

  const hasActiveFilters = searchTerm !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your store product categories</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Categories</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCategories}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Active Categories</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeCategories}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Form Sidebar */}
          <div className="lg:w-[450px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden border border-gray-100">
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Fruits, Vegetables, Dairy"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    style={{ height: "44px" }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Category description..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
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
                    <p className="text-xs text-gray-500">Click to upload category image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>

                  {previewImage && (
                    <div className="mt-3 relative group inline-block">
                      <img
                        src={previewImage}
                        alt="Category preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
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
                        {editingCategory ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {editingCategory ? "Update Category" : "Create Category"}
                      </>
                    )}
                  </button>
                  {editingCategory && (
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

          {/* Categories List Section */}
          <div className="flex-1">
            {/* Search and Filter Bar - Always Visible */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col gap-4">
                {/* Search Input and Buttons Row */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
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



                {/* Active Filters Display */}
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
                  </div>
                )}
              </div>
            </div>

            {/* Categories Table - Matching Products Page Style */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(limit)].map((_, index) => (
                        <tr key={index}>
                          <td colSpan={3} className="px-4 py-4">
                            <CategoryCardSkeleton />
                          </td>
                        </tr>
                      ))
                    ) : categories?.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-12">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">No categories found</h3>
                          <p className="text-gray-500 text-sm">Add your first category using the form</p>
                        </td>
                      </tr>
                    ) : (
                      categories?.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {category.image ? (
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <span className="font-medium text-gray-800 text-sm">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {category.description || "No description"}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
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

              {/* Pagination - Matching Products Page Style */}
              {categories?.length > 0 && (
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
                      Showing {categories?.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalCategories)} of {totalCategories} categories
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg border transition text-sm ${
                        currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                      }`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition ${
                        currentPage === 1
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
                        className={`px-3 py-1 rounded-lg transition text-sm ${
                          currentPage === page
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
                      className={`p-2 rounded-lg border transition ${
                        currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg border transition text-sm ${
                        currentPage === totalPages
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
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;