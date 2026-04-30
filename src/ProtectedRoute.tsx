import { useAppSelector } from "./hooks/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { isInitialized, user } = useAppSelector(state => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;