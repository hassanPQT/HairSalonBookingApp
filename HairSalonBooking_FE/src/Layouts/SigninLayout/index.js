import { Outlet } from "react-router-dom";
import HeaderNormal from "../../Components/client/HeaderNormal/HeaderNormal";
import Footer from "../../Components/client/Footer/Footer";
function SigninLayout() {
  return (
    <>
      <HeaderNormal/>
      <Outlet />
      <Footer/>
    </>
  );
}

export default SigninLayout;
