import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { collapse } from "../../../actions/Collapse";
import "./StylistHeader.scss";
import api from "../../../config/axios";
import stylistInfo from "../../../data/loginUser";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { logo, logo_blue_noBackground } from "../../../data/image";

const pageNames = {
  "/stylist/schedule": "Schedule",
  "/stylist/salary": "Salary",
  "/stylist/dashboard": "Dashboard",
  "/stylist/feedback": "Feedback",
  "/stylist/shift": "Shift",
};

const StylistHeader = () => {
  const collapsed = useSelector((state) => state.collapseReducer);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [pageName, setPageName] = useState("");
  const navigate = useNavigate();
  const [stylistInfo, setStylishInfo] = useState([]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-stylist__user-info")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`stylist/profile`);
        const data = response.data.result;
        console.log(data);
        if (data) {
          setStylishInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchManagerData();
  }, []);

  useEffect(() => {
    setPageName(pageNames[location.pathname] || "");
  }, [location.pathname]);

  const handleCollapse = useCallback(() => {
    dispatch(collapse());
  }, [dispatch]);

  const handleGoback = () => {
    navigate("/stylist/dashboard");
  };

  function formatRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="header-stylist">
      <div
        className={`header-stylist__logo ${
          collapsed ? "header-stylist__logo--collapsed" : ""
        }`}
      >
        <img
          onClick={handleGoback}
          src={collapsed ? logo_blue_noBackground : logo}
          alt={collapsed ? "Logo Fold" : "Logo"}
        />
      </div>
      <div className="header-stylist__nav">
        <div className="header-stylist__nav-left">
          <div className="header-stylist__collapse" onClick={handleCollapse}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div className="header-stylist__name-page">{pageName}</div>
        </div>
        <div className="header-stylist__nav-right">
          <div className="header-stylist__user-info" onClick={toggleDropdown}>
            <div className="header-stylist__text">
              <div className="header-stylist__name">{stylistInfo.fullname}</div>
              <div className="header-stylist__role">
                {stylistInfo.role ? formatRole(stylistInfo.role) : ""}
              </div>
            </div>
            <div className="header-stylist__avatar">
              <img
                alt="User avatar"
                src={stylistInfo.image || stylistInfo.avatar}
              />
            </div>
          </div>
          {dropdownOpen && (
            <div className="header-stylist__dropdown">
              <div className="header-stylist__dropdown--header">
                <img
                  height={60}
                  alt="User avatar"
                  src={stylistInfo.image || stylistInfo.avatar}
                />
                <div>
                  <h2>{stylistInfo.fullname}</h2>
                  <p>{stylistInfo.role ? formatRole(stylistInfo.role) : ""}</p>
                </div>
              </div>
              <Link to="#">
                <i>
                  <CgProfile />
                </i>{" "}
                Edit Profile
              </Link>
              <Link to="/" onClick={handleLogout}>
                <i>
                  {" "}
                  <TbLogout />
                </i>{" "}
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StylistHeader;
