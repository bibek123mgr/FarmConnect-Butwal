import { BrowserRouter, Route, Routes } from "react-router-dom"
import { getUserProfile } from "./features/auth/AuthApi"
import { useEffect } from "react"
import { useAppDispatch } from "./hooks/hooks"
import UserRoutes from "./UserRoutes"
import AdminRoutes from "./AdminRoutes"
import ScrollToTop from "./components/ScrollToTop"
function App() {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
