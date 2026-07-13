import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SingleProduct from "./pages/SingleProduct";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ProductsPage from "./pages/ProductPage";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "./UserLayout";
import Cart from "./pages/Cart";
import SignUp from "./pages/SignUp";
import PaymentSuccess from "./pages/PaymentSuccess";
import BecomeSeller from "./pages/BecomeSeller";
import Wishlist from "./pages/Wishlist";
import UserProfile from "./pages/UserProfile";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/register-seller" element={<BecomeSeller />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;