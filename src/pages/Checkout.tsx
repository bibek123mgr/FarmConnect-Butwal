import { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  Building2,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  ChevronRight,
  LocateFixed,
  Smartphone,
  HelpCircle,
  MessageCircle,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { createOrder, IPaymentMethod } from "../features/order/OrderApi";
import toast from "react-hot-toast";
import { clearMessage } from "../features/order/OrderSlice";
import { getMyCart, removeAllCart } from "../features/cart/cartApi";
import { clearCart } from "../features/cart/cartSlice";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>(IPaymentMethod.COD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const { cart: cartItems } = useAppSelector((state) => state.cart);


  // Form State with Butwal area addresses
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    city: "Butwal",
    postalCode: "32907",
    landmark: "",
    notes: "",
  });

  // Butwal areas for dropdown
  const butwalAreas = [
    "Select Area",
    "Traffic Chowk",
    "Golpark",
    "Shanti Nagar",
    "Devnagar",
    "Bhim Nagar",
    "Milijuli Nagar",
    "Sukha Nagar",
    "Kalikanagar",
    "Ramnagar",
    "Manigram",
    "Sainik Maidan",
    "Park Chowk",
    "Hospital Line",
    "Bhandari Tole",
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useAppDispatch();
  const { message, loading, error, success } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (loading) return;
    if (success) {
      toast.success(message);
      dispatch(clearMessage());
      dispatch(clearCart());
    }
    if (error) {
      toast.error(message);
      dispatch(clearMessage());
    }
  }, [success, error, loading, message, dispatch]);

  useEffect(() => {
    dispatch(getMyCart());
  }, []);

  const handlePlaceOrder = async () => {
    // if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.area || formData.area === "Select Area") {
    //   alert("Please fill in all required fields");
    //   return;
    // }

    // Place order
    dispatch(createOrder({
      paymentMethod: paymentMethod,
      address: formData.address,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        rate: item.price
      }))
    }))
  };



  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-2">Thank you for shopping with FarmeConnect</p>
            <p className="text-sm text-green-600 mb-6">Order confirmation sent to your email</p>
            <div className="flex gap-3">
              <Link
                to="/orders"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                View Orders
              </Link>
              <Link
                to="/products"
                className="flex-1 border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Header */}
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            Back to Cart
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Checkout</h1>
              <p className="text-gray-500 text-sm mt-1">Complete your order securely</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Step 1 Cart</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-green-600 font-medium">Step 2 Checkout</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Step 3 Payment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN - Billing Details & Payment */}
          <div className="flex-1 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm font-medium text-gray-800">Delivery</span>
                </div>
                <div className="flex-1 h-0.5 bg-green-200 mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm font-medium text-gray-800">Payment</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm text-gray-500">Confirm</span>
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Delivery Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g., Ram Prasad Sharma"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ram@example.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9800000000"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">✓ We deliver across Butwal city</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Locality <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 appearance-none bg-white"
                    >
                      {butwalAreas.map((area, idx) => (
                        <option key={idx} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="32907"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House/Flat No., Building Name, Street Name"
                      rows={2}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="e.g., Near Traffic Chowk, Opposite City Hall"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Gate code, floor number, or special delivery instructions"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="saveInfo" className="text-sm text-gray-600">
                  Save this information for next time
                </label>
              </div>
            </div>

            {/* Payment Method - Horizontal/Round Style */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Select Payment Method
              </h2>

              {/* Horizontal Payment Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === IPaymentMethod.COD
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={IPaymentMethod.COD}
                    checked={paymentMethod === IPaymentMethod.COD}
                    onChange={() => setPaymentMethod(IPaymentMethod.COD)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-orange-600" />

                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay on delivery</p>
                  </div>
                </label>

                <label
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === IPaymentMethod.KHALTI
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={IPaymentMethod.KHALTI}
                    checked={paymentMethod === IPaymentMethod.KHALTI}
                    onChange={() => setPaymentMethod(IPaymentMethod.KHALTI)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-sm">Khalti</p>
                    <p className="text-xs text-gray-500">Digital wallet</p>
                  </div>

                </label>

                {/* Esewa */}
                <label
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === IPaymentMethod.ESEWA
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={IPaymentMethod.ESEWA}
                    checked={paymentMethod === IPaymentMethod.ESEWA}
                    onChange={() => setPaymentMethod(IPaymentMethod.ESEWA)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-blue-600" />

                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-sm">eSewa</p>
                    <p className="text-xs text-gray-500">Digital wallet</p>
                  </div>

                </label>
              </div>

              {/* Payment Info Note */}
              {paymentMethod === "cod" && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <p className="text-xs text-orange-700">Pay directly to the delivery person when your order arrives. Please keep exact change ready.</p>
                </div>
              )}
              {(paymentMethod === IPaymentMethod.KHALTI || paymentMethod === IPaymentMethod.ESEWA) && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">You will be redirected to {paymentMethod === IPaymentMethod.KHALTI ? IPaymentMethod.KHALTI : IPaymentMethod.ESEWA} secure payment gateway after placing order.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-gray-400 font-normal">{cartItems.length} items</span>
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                    <img src="https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=100" alt={item.productName} className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Rs.{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">Rs.{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Delivery Fee
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="text-gray-800">Rs.{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    Discount
                  </span>
                  <span className="text-red-500">-Rs.{discount}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-xl text-green-600">Rs.{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes (GST 5%)</p>
                </div>
              </div>

              {/* Support Message */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-600">Need help? Call us at <span className="font-semibold">+977-985-7041234</span></p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    Place Order • Rs.{total}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Secure Payment Note */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                <Shield className="w-3 h-3" />
                Secure Payment
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                SSL Encrypted
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                100% Safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;