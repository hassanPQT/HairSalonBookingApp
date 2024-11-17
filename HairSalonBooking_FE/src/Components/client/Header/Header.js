/* eslint-disable jsx-a11y/anchor-is-valid */
import "./Header.scss";
import { IoCloseCircleSharp } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loginUser from "../../../data/loginUser.js";
import api from "../../../config/axios.js";
import { useSelector } from "react-redux";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { logo_white_noBackground } from "../../../data/image.js";
import { CiCalendar } from "react-icons/ci";

export default function Header() {
  const [active, setActive] = useState("navBar");
  const [transparent, setTransparent] = useState("navBarSection__header");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const isUpdate = useSelector((state) => state.updateUserReducer);

  const showNav = () => {
    setActive("navBar navBar-active");
  };

  const removeNav = () => {
    setActive("navBar");
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate]);

  const fetchUserData = async () => {
    try {
      const response = await api.get("customer/profile");
      const data = response.data.result;
      if (data) {
        setUserInfo(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Code to add background color to header

  const addBg = () => {
    if (window.scrollY >= 10) {
      setTransparent("navBarSection__header navBarSection__header-active");
    } else {
      setTransparent("navBarSection__header");
    }
  };
  window.addEventListener("scroll", addBg);

  const isLoggedIn = !!sessionStorage.getItem("token");

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".content")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleHomeClick = (e) => {
    // if (location.pathname === "/") {
    // e.preventDefault(); // Prevent navigation
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
    // }
  };

  function formatRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }


  return (
    <section className="navBarSection">
      {/* navBarSection__header navBarSection__header-active */}
      <div className={transparent}>
        <div className="navBarSection__header-logo">
          <Link to="/" onClick={handleHomeClick}>
            <h1 className="flex">
              <img src={logo_white_noBackground} alt="logo" />
              F-Salon
            </h1>
          </Link>
        </div>
        {/* navBar navBar-active */}
        {/* `${active} ${isLoggedIn ? " logged-in" : " logged-out"}` */}
        <div className={active}>
          <ul className="navBar__lists flex">
            <li className="navBar__lists-items">
              <Link to="/" onClick={handleHomeClick}>
                {" "}
                Home
              </Link>
            </li>
            <li className="navBar__lists-items">
              <Link to={"/aboutus"} onClick={handleHomeClick}>
                {" "}
                About Us
              </Link>
            </li>
            <li className="navBar__lists-items">
              <Link to={"/services"} onClick={handleHomeClick}>
                {" "}
                Service
              </Link>
            </li>
            <li className="navBar__lists-items">
              <Link to={"/contact"} onClick={handleHomeClick}>
                Contact
              </Link>
            </li>
            <div className="navBar__lists-infor flex">
              {isLoggedIn ? (
                <>
                  <div className="content" onClick={toggleDropdown}>
                    <div className="content__infor">
                      <div>
                        <h3>{userInfo.fullname || ""}</h3>
                        <p>
                          {userInfo.role ? formatRole(userInfo.role) : "User"}
                        </p>
                      </div>
                      <div>
                        <img
                          src={userInfo.image || loginUser.avatar}
                          alt="User-Avatar"
                        />
                      </div>
                    </div>
                  </div>
                  {dropdownOpen && (
                    <div className="navBar__dropdown">
                      <div className="navBar__dropdown--header">
                        <img
                          height={60}
                          alt="User avatar"
                          src={userInfo.image || loginUser.avatar}
                        />
                        <div>
                          <h2>{userInfo.fullname || ""}</h2>
                          <p>
                            {userInfo.role ? formatRole(userInfo.role) : "User"}
                          </p>
                        </div>
                      </div>
                      <Link to="/user/profile">
                        <i>
                          <CgProfile />
                        </i>
                        Profile
                      </Link>
                      {/* <Link to="#">
                      <i className="fas fa-cog"></i>
                      Account Setting
                    </Link> */}
                    <Link to="/user/mybooking">
                     <i>
                     <CiCalendar />
                     </i>
                     My booking
                    </Link>
                      <Link to="#" onClick={handleLogout}>
                        <i>
                          <TbLogout />
                        </i>
                        Logout
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button className="btn">
                    <Link to={"/login"}>Login</Link>
                  </button>
                </>
              )}
            </div>
          </ul>
          <div onClick={removeNav} className="navBar__close">
            <IoCloseCircleSharp className="icon" />
          </div>
        </div>

        <div onClick={showNav} className="Header__toggle">
          <CiGrid41 className="icon" />
          <img src={loginUser.avatar} alt="User-Avatar" />
        </div>
      </div>
    </section>
  );
}
