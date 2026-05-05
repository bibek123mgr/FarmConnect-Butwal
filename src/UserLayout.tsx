import { Outlet } from "react-router-dom";
import Header from "./components/includes/Header";
import Footer from "./components/includes/Footer";
import BackToTop from "./components/includes/BackToTop";


const UserLayout = () => {
  return (
    <>
       <Header />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
};

export default UserLayout;