import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Footer from "./components/includes/Footer"
import Header from "./components/includes/Header"
import Cart from "./pages/Cart"
import ProtectedRoute from "./ProtectedRoute"
import { getUserProfile } from "./features/auth/AuthApi"
import { useEffect } from "react"
import { useAppDispatch } from "./hooks/hooks"
import SingleProduct from "./pages/SingleProduct"
import BackToTop from "./components/includes/BackToTop"
import Checkout from "./pages/Checkout"
import Orders from "./pages/Orders"
import ProductsPage from "./pages/ProductPage"
function App() {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  )
}

export default App
