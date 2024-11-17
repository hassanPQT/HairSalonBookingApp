import Slides from "../../Components/client/Slides/Slides";
import Personnel from "../../Components/client/Personnel/Personnel";
import PopularService from "../../Components/client/PopularService/PopularService";
import AboutUs from "../../Components/client/AboutUs/AboutUs";

function HomePage () {
    
    return(
        <>
            <Slides/>
            <Personnel/>
            <PopularService/>
            <AboutUs/>
        </>
    )
}

export default HomePage;