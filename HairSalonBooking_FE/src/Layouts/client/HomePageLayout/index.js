import Header from "../../../Components/client/Header/Header";
import Footer from "../../../Components/client/Footer/Footer";
import { Outlet } from "react-router-dom";

function HomePageLayout () {
    
    return(
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}

export default HomePageLayout;