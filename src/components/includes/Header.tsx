// Header.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  LogOut,
  Heart,
  Package,
  UserCircle,
  Store,
  Grid3x3,
  Store as StoreIcon,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { LogoutUser } from "../../features/auth/AuthApi";
import toast from "react-hot-toast";
import { clearMessage } from "../../features/auth/AuthSlice";
import axios from "axios";
import { baseUrl } from "../../config/config";
import { fetchAllFarm } from "../../features/farm/farmApi";

// Define types
interface SearchSuggestion {
  id?: string;
  name: string;
  category?: string;
  price?: number;
  image?: string;
  distance?: number;
}

interface SearchProduct {
  id: number;
  name: string;
  image: string;
  distance: number;
}

interface SearchResponse {
  success: boolean;
  data: SearchProduct[];
}

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isShopsOpen, setIsShopsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, isInitialized, message, error, success, loading } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.category);
  const { allFarmsForHeader } = useAppSelector((state) => state.store);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [didYouMean, setDidYouMean] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const shopsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const cartCount = 0;
  const wishlistCount = 0;

  const handleLogout = () => {
    dispatch(LogoutUser());
    setIsProfileOpen(false);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    dispatch(fetchAllFarm());
  }, [dispatch]);

  // Search autocomplete function
  const fetchSearchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setDidYouMean([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const API_URL = baseUrl;
      const response = await axios.get<SearchResponse>(`${API_URL}/products/autocorrect-search`, {
        params: { keyword: query }
      });

      if (response.data.success && response.data.data) {
        const products = response.data.data;

        setSearchSuggestions(products.map(p => ({
          id: p.id.toString(),
          name: p.name,
          image: p.image,
          distance: p.distance
        })));

        const exactMatches = products.filter(p => p.distance === 0);
        if (exactMatches.length === 0 && products.length > 0) {
          const closestMatch = products.reduce((prev, curr) =>
            prev.distance < curr.distance ? prev : curr
          );
          setDidYouMean([closestMatch.name]);
        } else {
          setDidYouMean([]);
        }

        setIsSearchOpen(true);
      } else {
        setSearchSuggestions([]);
        setDidYouMean([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchSuggestions([]);
      setDidYouMean([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search input handler
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 300);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      setSearchSuggestions([]);
      setDidYouMean([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion | string) => {
    if (typeof suggestion === 'string') {
      setSearchQuery(suggestion);
      navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    } else {
      setSearchQuery(suggestion.name);
      if (suggestion.id) {
        navigate(`/products/${suggestion.id}`);
      } else {
        navigate(`/products?search=${encodeURIComponent(suggestion.name)}`);
      }
    }
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchSuggestions([]);
    setDidYouMean([]);
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (shopsRef.current && !shopsRef.current.contains(event.target as Node)) {
        setIsShopsOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Handle auth messages
  useEffect(() => {
    if (!loading && message) {
      if (error) {
        toast.error(message);
      } else if (success) {
        toast.success(message);
      }
      dispatch(clearMessage());
    }
  }, [loading, message, error, success, dispatch]);

  const HeaderSkeleton = () => (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="hidden sm:block">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-28 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </nav>
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="w-full h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-9 bg-gray-200 rounded-full animate-pulse hidden sm:block"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse md:hidden"></div>
          </div>
        </div>
      </div>
    </header>
  );

  if (!isInitialized) {
    return <HeaderSkeleton />;
  }

  // Common component for rendering shops list
  const renderShopsList = () => {
    if (!allFarmsForHeader || allFarmsForHeader.length === 0) {
      return (
        <div className="col-span-full text-center py-4 text-gray-500 text-sm">
          No shops available
        </div>
      );
    }

    return allFarmsForHeader.map((shop) => (
      <Link
        key={shop.id}
        to={`/products?page=1&limit=20&productname=all&category=all&pricerangeFrom=0&pricerangeTo=max&store=${shop.id}`}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition group border border-gray-100 hover:border-green-200"
        onClick={() => {
          setIsShopsOpen(false);
          setIsMenuOpen(false);
        }}
      >
        {shop.logo ? (
          <img
            src={shop.logo}
            alt={shop.farmName}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            🌿
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 group-hover:text-green-600 truncate">{shop.farmName}</p>
          <p className="text-[10px] text-gray-400">{shop.productCount || 0} products</p>
        </div>
      </Link>
    ));
  };

  // Common component for rendering categories list
  const renderCategoriesList = () => {
    if (!categories || categories.length === 0) {
      return (
        <div className="col-span-full text-center py-4 text-gray-500 text-sm">
          No categories available
        </div>
      );
    }

    return categories.map((category) => (
      <Link
        key={category.id}
        to={`/products?page=1&limit=20&productname=all&category=${category.id}&pricerangeFrom=0&pricerangeTo=max&store=all`}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition group border border-gray-100 hover:border-green-200"
        onClick={() => {
          setIsCategoriesOpen(false);
          setIsMenuOpen(false);
        }}
      >
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            📦
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 group-hover:text-green-600 truncate">{category.name}</p>
          <p className="text-[10px] text-gray-400">{category.productCount || 0} products</p>
        </div>
      </Link>
    ));
  };

  // Common "View All" button component
  const ViewAllButton = ({ to, text }: { to: string; text: string }) => (
    <Link
      to={to}
      className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200"
      onClick={() => {
        setIsShopsOpen(false);
        setIsCategoriesOpen(false);
        setIsMenuOpen(false);
      }}
    >
      {text} <ChevronRight className="w-3 h-3" />
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 group flex-shrink-0 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FarmeConnect <span className="text-green-600">Butwal</span>
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight">
                Agro Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Navigation with Mega Menus */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Shops Mega Menu */}
            <div
              className="relative"
              ref={shopsRef}
              onMouseEnter={() => setIsShopsOpen(true)}
              onMouseLeave={() => setIsShopsOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition text-sm font-medium relative group py-2">
                Shops
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isShopsOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </button>

              {isShopsOpen && (
                <div className="absolute top-full left-0 mt-1 w-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Shops</h3>
                      <ViewAllButton to="/shops" text="View All Shops" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {renderShopsList()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Categories Mega Menu */}
            <div
              className="relative"
              ref={categoriesRef}
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition text-sm font-medium relative group py-2">
                Categories
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
                      <ViewAllButton to="/products" text="View All Categories" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {renderCategoriesList()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-green-500 focus-within:shadow-md transition-all duration-300 flex items-center">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => {
                    if (searchQuery.trim() && (searchSuggestions.length > 0 || didYouMean.length > 0)) {
                      setIsSearchOpen(true);
                    }
                  }}
                  placeholder="Search fresh products..."
                  className="bg-transparent outline-none text-sm ml-2 w-full"
                  autoComplete="off"
                />
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin ml-2"></div>
                )}
              </div>
            </form>

            {/* Search Suggestions Dropdown - Desktop */}
            {isSearchOpen && searchQuery.trim() && (
              <>
                {searchSuggestions.length > 0 || didYouMean.length > 0 ? (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden max-h-96 overflow-y-auto">
                    <div className="py-2">
                      {searchSuggestions.length > 0 && (
                        <>
                          <div className="px-4 py-2 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Suggested Products</p>
                          </div>
                          {searchSuggestions.map((product, index) => (
                            <button
                              key={product.id || index}
                              onClick={() => handleSuggestionClick(product)}
                              className="w-full text-left px-4 py-2 hover:bg-green-50 transition flex items-center gap-3"
                            >
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 font-medium">{product.name}</p>
                                {product.category && (
                                  <p className="text-xs text-gray-500">{product.category}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </>
                      )}

                      {didYouMean.length > 0 && (
                        <>
                          {searchSuggestions.length > 0 && <div className="border-t border-gray-100 mt-2"></div>}
                          <div className="px-4 py-2 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Did you mean?</p>
                          </div>
                          {didYouMean.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-4 py-2 hover:bg-green-50 transition flex items-center gap-3"
                            >
                              <Search className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">{suggestion}</span>
                            </button>
                          ))}
                        </>
                      )}

                      <div className="border-t border-gray-100 mt-2">
                        <button
                          onClick={() => {
                            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                            setIsSearchOpen(false);
                          }}
                          className="w-full text-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition font-medium"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  !isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No products found for "{searchQuery}"</p>
                        <p className="text-xs text-gray-400 mt-1">Try searching with different keywords</p>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle Button */}
            {!isMobileSearchOpen && (
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Close Search Button */}
            {isMobileSearchOpen && (
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery('');
                  setSearchSuggestions([]);
                  setDidYouMean([]);
                  setIsSearchOpen(false);
                }}
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-2 hover:bg-gray-100 rounded-full transition group ${isMobileSearchOpen ? 'hidden sm:flex' : 'flex'}`}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-2 hover:bg-gray-100 rounded-full transition group ${isMobileSearchOpen ? 'hidden sm:flex' : 'flex'}`}
            >
              <Heart className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className={`${isMobileSearchOpen ? 'hidden sm:block' : 'block'}`}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition border border-green-200"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user.name?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserCircle className="w-4 h-4" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </Link>
                          {
                            user.role === "user" &&
                            <Link
                              to="/register-seller"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Store className="w-4 h-4" />
                              Become a Seller
                            </Link>
                          }
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 text-green-600 hover:bg-green-50 px-4 py-1.5 rounded-lg transition text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-1.5 rounded-lg transition text-sm font-medium shadow-sm"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 hover:bg-gray-100 rounded-full transition ${isMobileSearchOpen ? 'hidden' : 'flex'}`}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 animate-slide-down">
            <div className="relative" ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="bg-gray-50 rounded-full px-4 py-3 border border-gray-200 focus-within:border-green-500 focus-within:shadow-md transition-all duration-300 flex items-center">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Search fresh products..."
                    className="bg-transparent outline-none text-sm ml-3 w-full"
                    autoComplete="off"
                    autoFocus
                  />
                  {isSearching && (
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin ml-2 flex-shrink-0"></div>
                  )}
                  {searchQuery && !isSearching && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchSuggestions([]);
                        setDidYouMean([]);
                        setIsSearchOpen(false);
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full transition flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </form>

              {/* Mobile Search Suggestions */}
              {searchQuery.trim() && (
                <>
                  {searchSuggestions.length > 0 || didYouMean.length > 0 ? (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto">
                      <div className="py-2">
                        {searchSuggestions.length > 0 && (
                          <>
                            <div className="px-4 py-2 bg-gray-50">
                              <p className="text-xs font-semibold text-gray-500 uppercase">Suggestions</p>
                            </div>
                            {searchSuggestions.map((product, index) => (
                              <button
                                key={product.id || index}
                                onClick={() => handleSuggestionClick(product)}
                                className="w-full text-left px-4 py-2 hover:bg-green-50 transition flex items-center gap-3"
                              >
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 font-medium">{product.name}</p>
                                </div>
                              </button>
                            ))}
                          </>
                        )}

                        {didYouMean.length > 0 && (
                          <>
                            {searchSuggestions.length > 0 && <div className="border-t border-gray-100 mt-2"></div>}
                            <div className="px-4 py-2 bg-gray-50">
                              <p className="text-xs font-semibold text-gray-500 uppercase">Did you mean?</p>
                            </div>
                            {didYouMean.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-green-50 transition flex items-center gap-3"
                              >
                                <Search className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-700 font-medium">{suggestion}</span>
                              </button>
                            ))}
                          </>
                        )}

                        <div className="border-t border-gray-100 mt-2">
                          <button
                            onClick={() => {
                              navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                              setIsMobileSearchOpen(false);
                              setIsSearchOpen(false);
                              setSearchSuggestions([]);
                              setDidYouMean([]);
                            }}
                            className="w-full text-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition font-medium"
                          >
                            View all results
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    !isSearching && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="text-center py-6">
                          <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No products found</p>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-slide-down">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {/* Shops - Mobile (Same design as desktop) */}
              <div className="py-2 px-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Shops
                  </p>
                  <ViewAllButton to="/shops" text="View All Shops" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {renderShopsList()}
                </div>
              </div>

              {/* Categories - Mobile (Same design as desktop) */}
              <div className="py-2 px-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Categories
                  </p>
                  <ViewAllButton to="/products" text="View All Categories" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {renderCategoriesList()}
                </div>
              </div>
            </nav>

            {!user && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/login"
                  className="flex-1 text-center border border-green-600 text-green-600 text-sm font-medium py-2 rounded-lg hover:bg-green-50 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-medium py-2 rounded-lg shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;