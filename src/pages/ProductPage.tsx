import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkleton";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import toast from "react-hot-toast";
import { clearMessage } from "../features/cart/cartSlice";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  Filter,
  Star,
  Truck,
  Leaf,
  Clock,
} from "lucide-react";
import { fetchProducts } from "../features/product/productApi";
import { fetchCategories } from "../features/category/CategoryApi";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get data directly from store - NO UNWRAPPING
  const { products, loading: productLoading, pagination } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  const { loading, success, error, message } = useAppSelector((state) => state.cart);

  // State for infinite scroll - using products from store
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const prevProductsLengthRef = useRef(0);

  const [searchTerm, setSearchTerm] = useState(() => {
    const productname = searchParams.get("productname");
    return productname && productname !== "all" ? productname : "";
  });
  const [selectedCategory, setSelectedCategory] = useState<string | number>(() => {
    const category = searchParams.get("category");
    return category || "all";
  });
  const [selectedStore, setSelectedStore] = useState<string | number>(() => {
    const store = searchParams.get("store");
    return store || "all";
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const searchDebounceRef = useRef<number | null>(null);

  // Reset all products when filters change
  const resetProducts = useCallback(() => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    isFetchingRef.current = false;
    prevProductsLengthRef.current = 0;
  }, []);

  const updateURL = useCallback((updates: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "" && value !== 0 && value !== "default") {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });

    if (!newParams.has("productname")) {
      newParams.set("productname", "all");
    }
    if (!newParams.has("limit")) {
      newParams.set("limit", "20");
    }
    if (!newParams.has("page")) {
      newParams.set("page", "1");
    }
    if (!newParams.has("store")) {
      newParams.set("store", "all");
    }
    if (!newParams.has("category")) {
      newParams.set("category", "all");
    }

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Sync store from URL to state
  useEffect(() => {
    const store = searchParams.get("store");
    if (store) {
      setSelectedStore(store);
    } else if (!store && selectedStore !== "all") {
      setSelectedStore("all");
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      const updates: any = {
        productname: value || "all",
        page: 1,
      };
      updateURL(updates);
      resetProducts();
    }, 500);
  };

  const handleSearchBlur = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const updates: any = {
      productname: searchTerm || "all",
      page: 1,
    };
    updateURL(updates);
    resetProducts();
  };

  // Fetch products - dispatches action to update store
  const fetchProductsData = useCallback(async (page: number) => {
    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    const productname = searchParams.get("productname") || "all";
    const category = searchParams.get("category") || "all";
    const pricerangeFrom = searchParams.get("pricerangeFrom") || "0";
    const pricerangeTo = searchParams.get("pricerangeTo") || "max";
    const store = searchParams.get("store") || "all";

    const filters = {
      page: page,
      limit: 20,
      productname: productname,
      category: category,
      pricerangeFrom: parseInt(pricerangeFrom),
      pricerangeTo: pricerangeTo,
      store: store
    };

    try {
      // Just dispatch - data will be in store
      await dispatch(fetchProducts({ ...filters })).unwrap();
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [dispatch, searchParams]);

  // Update allProducts when products from store changes (CONCATENATE)
  useEffect(() => {
    if (products && products.length > 0) {
      // Check if this is a new page or append
      const currentPageFromStore = pagination?.currentPage || 1;

      if (currentPageFromStore === 1) {
        // First page - replace
        setAllProducts(products);
        prevProductsLengthRef.current = products.length;
      } else if (currentPageFromStore > 1) {
        // Subsequent pages - concatenate (avoid duplicates)
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = products.filter(p => !existingIds.has(p.id));
          const concatenated = [...prev, ...newProducts];
          prevProductsLengthRef.current = concatenated.length;
          return concatenated;
        });
      }
    }
  }, [products, pagination]);


  // Update hasMore when pagination changes
  useEffect(() => {
    if (pagination) {
      const totalProducts = pagination.totalProducts || 0;
      const currentPageData = pagination.currentPage || 1;
      const limit = pagination.limit || 20;
      const totalPages = Math.ceil(totalProducts / limit);
      setHasMore(currentPageData < totalPages);
    }
  }, [pagination]);

  // Initial load - when searchParams change (filters change)
  useEffect(() => {
    resetProducts();
    fetchProductsData(1);
  }, [searchParams]);

  // Load categories - only once
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Cart messages
  useEffect(() => {
    if (loading) return;
    if (success) {
      toast.success(message);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(message);
      dispatch(clearMessage());
    }
  }, [success, error, loading, dispatch, message]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !productLoading && !isFetchingRef.current) {
          const nextPage = currentPage + 1;
          fetchProductsData(nextPage);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, productLoading, currentPage]);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStore("all");
    setSelectedCategory("all");
    setPriceRange([0, 10000]);
    setSelectedRating(0);
    setSortBy("default");
    resetProducts();

    setSearchParams({
      page: "1",
      limit: "20",
      productname: "all",
      category: "all",
      pricerangeFrom: "0",
      pricerangeTo: "max",
      store: "all",
    });

    setCurrentPage(1);

    dispatch(
      fetchProducts({
        page: 1,
        limit: 20,
        productname: "all",
        category: "all",
        pricerangeFrom: 0, // number, not "0" — matches fetchProductsData's parseInt(...) usage
        pricerangeTo: "max", // stays a string per your filters shape
        store: "all",
      })
    )
      .unwrap()
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      });
  };

  const handleFilterChange = (key: string, value: any) => {
    const updates: any = { [key]: value, page: 1 };

    if (key === "productname") {
      updates.productname = value || "all";
    }
    if (key === "category") {
      updates.category = value;
    }
    if (key === "pricerangeFrom") {
      updates.pricerangeFrom = value;
    }
    if (key === "pricerangeTo") {
      updates.pricerangeTo = value === 10000 ? "max" : value;
    }

    updateURL(updates);
    resetProducts();
  };

  const hasActiveFilters = () => {
    const productname = searchParams.get("productname");
    const category = searchParams.get("category");
    const pricerangeFrom = searchParams.get("pricerangeFrom");
    const pricerangeTo = searchParams.get("pricerangeTo");

    return (productname && productname !== "all") ||
      (category && category !== "all") ||
      (pricerangeFrom && parseInt(pricerangeFrom) > 0) ||
      (pricerangeTo && pricerangeTo !== "max");
  };

  const currentProductName = searchParams.get("productname") || "all";
  const currentCategory = searchParams.get("category") || "all";
  const currentPriceFrom = parseInt(searchParams.get("pricerangeFrom") || "0");
  const currentPriceTo = searchParams.get("pricerangeTo") || "max";

  // Get values from store
  const totalProducts = pagination?.totalProducts || 0;
  const allProductsLength = allProducts?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1">Browse our fresh and organic products</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onBlur={handleSearchBlur}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-green-500 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                          resetProducts();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${sortBy === option.value ? "text-green-600 bg-green-50" : "text-gray-700"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active Filters:</span>
            {currentProductName !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Search: {currentProductName}
                <button onClick={() => {
                  setSearchTerm("");
                  handleFilterChange("productname", "all");
                }} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Category
                <button onClick={() => handleFilterChange("category", "all")} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentPriceFrom > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Min: ₹{currentPriceFrom}
                <button onClick={() => handleFilterChange("pricerangeFrom", 0)} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentPriceTo !== "max" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Max: ₹{currentPriceTo}
                <button onClick={() => handleFilterChange("pricerangeTo", 10000)} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-5">
                <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={currentCategory === "all"}
                      onChange={() => handleFilterChange("category", "all")}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600 capitalize">
                      All Categories
                    </span>
                  </label>
                  {categories?.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={currentCategory === String(category.id)}
                        onChange={() => handleFilterChange("category", category.id)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Min (₹)</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPriceRange([val, priceRange[1]]);
                          handleFilterChange("pricerangeFrom", val);
                        }}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Max (₹)</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPriceRange([priceRange[0], val]);
                          handleFilterChange("pricerangeTo", val);
                        }}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>Free Delivery on ₹1000+</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span>100% Organic</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Same Day Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter */}
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsFilterOpen(false)} />
              <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 p-5 overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <h3 className="font-semibold text-gray-800">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-5">
                  <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category-mobile"
                        checked={currentCategory === "all"}
                        onChange={() => {
                          handleFilterChange("category", "all");
                          setIsFilterOpen(false);
                        }}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        All Categories
                      </span>
                    </label>
                    {categories?.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category-mobile"
                          checked={currentCategory === String(category.id)}
                          onChange={() => {
                            handleFilterChange("category", category.id);
                            setIsFilterOpen(false);
                          }}
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-600 capitalize">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Min (₹)</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPriceRange([val, priceRange[1]]);
                            handleFilterChange("pricerangeFrom", val);
                          }}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Max (₹)</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPriceRange([priceRange[0], val]);
                            handleFilterChange("pricerangeTo", val);
                          }}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg mt-4"
                >
                  Apply Filters
                </button>
              </div>
            </>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-500">
              Showing {allProductsLength} of {totalProducts} products
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {productLoading && allProductsLength === 0 ? (
                [...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : allProductsLength === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}

              {/* Loading more skeletons */}
              {isLoadingMore && (
                [...Array(4)].map((_, index) => (
                  <ProductCardSkeleton key={`loading-${index}`} />
                ))
              )}
            </div>

            {/* Intersection Observer target */}
            {hasMore && allProductsLength > 0 && (
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {!isLoadingMore && (
                  <span className="text-sm text-gray-400">Scroll for more</span>
                )}
                {isLoadingMore && (
                  <span className="text-sm text-gray-400">Loading more...</span>
                )}
              </div>
            )}

            {/* No more products message */}
            {!hasMore && allProductsLength > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">You've reached the end of the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;