import { Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Clock,
  Truck,
  Shield,
  RefreshCw,
  Heart,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                FarmeConnect <span className="text-green-500">Butwal</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Connecting local farmers directly with consumers. Fresh,
              organic, and farm-fresh products delivered to your doorstep.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-500 transition inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-green-500 transition inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-green-500 transition inline-block"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-green-500 transition inline-block"
                >
                  Today's Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-green-500 transition inline-block"
                >
                  Farmer's Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-green-500 transition inline-block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-green-500 transition inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-green-500 transition inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-green-500 transition inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-green-500 transition inline-block"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-green-500 transition inline-block"
                >
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                <span>
                  Butwal-11, Devinagar, <br />
                  Rupandehi, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500" />
                <span>+977-985-7041234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-500" />
                <span>info@farmeconnect.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Mon - Sat: 8:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-white text-sm font-medium">Free Delivery</p>
              <p className="text-xs text-gray-500">On orders over Rs. 100</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-white text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-500">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-white text-sm font-medium">Same Day Delivery</p>
              <p className="text-xs text-gray-500">Order before 11 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-white text-sm font-medium">Fresh Guarantee</p>
              <p className="text-xs text-gray-500">Farm fresh products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} FarmeConnect Butwal. All rights
              reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" />{" "}
              for local farmers & community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;