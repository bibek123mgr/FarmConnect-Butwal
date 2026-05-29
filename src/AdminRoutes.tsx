import { Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard"
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminCategoriesPage from "./pages/AdminCategoryPage";
import AdminUsersPage from "./AdminUsersPage";
import AdminShipping from "./pages/AdminShipping";
import AdminOrderManagement from "./pages/AdminOrderManagement";
import AdminStoreSettings from "./pages/AdminStoreSetting";
import AdminVendorManagement from "./AdminVendorManagement";
// import AdminProducts from "./components/admin/Products";
// import AdminOrders from "./components/admin/Orders";
// import AdminUsers from "./components/admin/Users";
// import AdminCategories from "./components/admin/Categories";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrderManagement/>} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} /> 
          <Route path="shipping" element={<AdminShipping />} />
          <Route path="/settings" element={<AdminStoreSettings />} />
          <Route path="/vendors" element={<AdminVendorManagement />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;