// Header.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                FarmeConnect <span className="text-green-600">Butwal</span>
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">
                Agro Marketplace
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm ml-2 w-full"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
            >
              <User className="w-3.5 h-3.5" />
              Login
            </Link>

            <Link
              to="/register"
              className="hidden sm:flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 text-sm font-medium px-4 py-1.5 rounded-lg transition"
            >
              Sign Up
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 mb-4">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm ml-2 w-full"
              />
            </div>

            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-gray-600 hover:text-green-600 transition text-sm font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-green-600 transition text-sm font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="text-gray-600 hover:text-green-600 transition text-sm font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-green-600 transition text-sm font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-green-600 transition text-sm font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <Link
                to="/login"
                className="flex-1 text-center bg-green-600 text-white text-sm font-medium py-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center border border-green-600 text-green-600 text-sm font-medium py-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;