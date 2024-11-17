import React, { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import "./HeaderNormal.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../config/axios.js";
import loginUser from "../../../data/loginUser.js";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { logo_white_noBackground } from "../../../data/image.js";
import { CiCalendar } from "react-icons/ci";

export default function HeaderNormal() {
  const [active, setActive] = useState("header-normal");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem("token");
  const [userInfo, setUserInfo] = useState({});
  const isUpdate = useSelector((state) => state.updateUserReducer);

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

  // Toggle header-normal
  const showNav = () => setActive("header-normal header-normal-active");
  const removeNav = () => setActive("header-normal");

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
    <>
      <section className="header-normalSection">
        <div className="header-normalSection__header">
          <div className="header-normalSection__header-logo">
            <Link to={"/"} onClick={handleHomeClick}>
              <h1 className="flex">
                <img src={logo_white_noBackground} alt="logo" />
                F-Salon
              </h1>
            </Link>
          </div>
          <div
            className={`${active} ${isLoggedIn ? "logged-in" : "logged-out"}`}
          >
            <ul className="header-normal__lists flex">
              <li
                className={`header-normal__lists-items ${
                  isLoggedIn ? "logged-in" : ""
                }`}
              >
                <Link to={"/"} onClick={handleHomeClick}>
                  Home
                </Link>
              </li>
              <li
                className={`header-normal__lists-items ${
                  isLoggedIn ? "logged-in" : ""
                }`}
              >
                <Link to={"/aboutus"} onClick={handleHomeClick}>
                  About Us
                </Link>
              </li>
              <li
                className={`header-normal__lists-items ${
                  isLoggedIn ? "logged-in" : ""
                }`}
              >
                <Link to={"/services"} onClick={handleHomeClick}>
                  Service
                </Link>
              </li>
              <li
                className={`header-normal__lists-items ${
                  isLoggedIn ? "logged-in" : ""
                }`}
              >
                <Link to={"/contact"} onClick={handleHomeClick}>
                  Contact
                </Link>
              </li>

              <div className="header-normal__lists-infor flex">
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
                      <div className="header-normal__dropdown">
                        <div className="header-normal__dropdown--header">
                          <img
                            height={60}
                            alt="User avatar"
                            src={userInfo.image || loginUser.avatar}
                          />
                          <div>
                            <h2>{userInfo.fullname || ""}</h2>
                            <p>
                              {userInfo.role
                                ? formatRole(userInfo.role)
                                : "User"}
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
                       </Link>*/}
                        <Link to="/user/mybooking">
                          <i>
                            <CiCalendar />
                          </i>
                          My booking
                        </Link>
                        <Link to="#" onClick={handleLogout}>
                          <i>
                            {" "}
                            <TbLogout />
                          </i>
                          Logout
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <button className="btn">
                    <Link to={"/login"}>Login</Link>
                  </button>
                )}
              </div>
            </ul>
            <div onClick={removeNav} className="header-normal__close">
              <IoCloseCircleSharp className="icon" />
            </div>
          </div>

          <div onClick={showNav} className="header-normal__toggle">
            <CiGrid41 className="icon" />
            {loginUser && <img src={loginUser.avatar} alt="User-Avatar" />}
          </div>
        </div>
      </section>
    </>
  );
}
