
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Truck,
  Shield,
  Tag,

} from "lucide-react";
import { decrementCart, deleteCart, getMyCart, increnmentCart } from "../features/cart/cartApi";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { DecreaseQuantity, IncreaseQuantity, removeFromCart } from "../features/cart/cartSlice";
import { useEffect } from "react";

const Cart = () => {


  const dispatch = useAppDispatch();
  const { cart: cartItems } = useAppSelector((state) => state.cart);

  const handleIncrement = async (id: number) => {
    const result = await dispatch(increnmentCart(id));
    if (increnmentCart.fulfilled.match(result)) {
      dispatch(IncreaseQuantity(id));
    }
  };

  const handleDecrement = async (id: number) => {
    const result = await dispatch(decrementCart(id));
    if (decrementCart.fulfilled.match(result)) {
      dispatch(DecreaseQuantity(id));
    }
  };

  const handleRemove = async (id: number) => {
    const result = await dispatch(deleteCart(id));
    if (deleteCart.fulfilled.match(result)) {
      dispatch(removeFromCart(id));
    }
  };


  useEffect(() => {
    dispatch(getMyCart());
  }, [dispatch]);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 0);
  }, 0);

  const deliveryFee = 0;
  const discount = 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-green-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-1">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 border-b">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems?.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      <div className="flex gap-3 md:col-span-6 mb-3 md:mb-0">
                        <img
                          src={item.image || "https://www.freepnglogos.com/uploads/vegetables-png/vegetables-download-vegetable-photos-png-image-pngimg-3.png"}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium text-gray-800 hover:text-green-600 transition"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Fruits
                          </p>
                          <p className="text-xs text-gray-400">
                            Unit: Kg
                          </p>
                          {/* {item.originalPrice && (
                            <p className="text-xs text-green-600 mt-1">
                              Save Rs.{(item.originalPrice - item.price) * item.quantity}
                            </p>
                          )} */}
                        </div>
                      </div>

                      <div className="md:col-span-2 mb-2 md:mb-0">
                        <div className="flex items-center justify-between md:justify-center">
                          <span className="text-sm text-gray-500 md:hidden">
                            Price:
                          </span>
                          <div>
                            <span className="font-medium text-gray-800">
                              Rs.{item.price}
                            </span>
                            {item.price && (
                              <span className="text-xs text-gray-400 line-through ml-1">
                                Rs.{item.price}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 ml-1">
                              /kg
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 mb-2 md:mb-0">
                        <div className="flex items-center justify-between md:justify-center">
                          <span className="text-sm text-gray-500 md:hidden">
                            Qty:
                          </span>
                          <div className="flex items-center gap-2">
                            <button className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition"
                              onClick={() => handleDecrement(item.id)}>
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition"
                              onClick={() => handleIncrement(item.id)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-1 mb-2 md:mb-0">
                        <div className="flex items-center justify-between md:justify-center">
                          <span className="text-sm text-gray-500 md:hidden">
                            Total:
                          </span>
                          <span className="font-semibold text-gray-800">
                            Rs.{item.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-1 flex justify-end">
                        <button className="text-gray-400 hover:text-red-500 transition p-1"
                          onClick={() => handleRemove(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
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
                    <Tag className="w-3.5 h-3.5" />
                    Discount
                  </span>
                  <span className="text-red-500">-Rs.{discount}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span className="text-xl text-green-600">Rs.{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Free Delivery!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your order qualifies for free delivery
                </p>
              </div>

              <Link
                to={cartItems.length === 0 ? "#" : "/checkout"}
                className={`${cartItems.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-green-700"} w-full bg-green-600 text-white font-medium py-3 rounded-lg transition mt-4 flex items-center justify-center gap-2`}
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
              </Link>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                Secure Payment Gateway
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

export default Cart;