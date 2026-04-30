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
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
