import { Outlet } from "react-router-dom";
import HeaderNormal from "../../../Components/client/HeaderNormal/HeaderNormal";
import Footer from "../../../Components/client/Footer/Footer";

export default function BookingLayout() {
  return (
    <>
    
      <HeaderNormal />
      <Outlet />
      <Footer />
    </>
  );
}
