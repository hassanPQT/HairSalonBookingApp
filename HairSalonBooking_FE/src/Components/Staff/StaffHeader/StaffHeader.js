import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { collapse } from "../../../actions/Collapse";
import "./StaffHeader.scss";
import api from "../../../config/axios";
import loginUser from "../../../data/loginUser";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { logo, logo_blue_noBackground } from "../../../data/image";

const pageNames = {
  "/staff/booking/pending": "Pending Booking ",
  "/staff/booking/in-process": "In-Process Booking ",
  "/staff/booking/complete": "Complete Booking ",
  "/staff/customer/create": "New Customer",
  "/staff/customer": "Customer",
};

const StaffHeader = () => {
  const collapsed = useSelector((state) => state.collapseReducer);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [pageName, setPageName] = useState("");
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState([]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-staff__user-info")) {
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
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        if (data) {
          setStaffInfo(data);
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
    navigate("/staff/booking/pending");
  };

  function formatRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="header-staff">
      <div
        className={`header-staff__logo ${
          collapsed ? "header-staff__logo--collapsed" : ""
        }`}
      >
        <img
          onClick={handleGoback}
          src={collapsed ? logo_blue_noBackground : logo}
          alt={collapsed ? "Logo Fold" : "Logo"}
        />
      </div>
      <div className="header-staff__nav">
        <div className="header-staff__nav-left">
          <div className="header-staff__collapse" onClick={handleCollapse}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div className="header-staff__name-page">{pageName}</div>
        </div>
        <div className="header-staff__nav-right">
          <div className="header-staff__user-info" onClick={toggleDropdown}>
            <div className="header-staff__text">
              <div className="header-staff__name">{staffInfo.fullname}</div>
              <div className="header-staff__role">
                {staffInfo.role ? formatRole(staffInfo.role) : ""}
              </div>
            </div>
            <div className="header-staff__avatar">
              <img
                alt="User avatar"
                src={staffInfo.image || loginUser.avatar}
              />
            </div>
          </div>
          {dropdownOpen && (
            <div className="header-staff__dropdown">
              <div className="header-staff__dropdown--header">
                <img
                  height={60}
                  alt="User avatar"
                  src={staffInfo.image || loginUser.avatar}
                />
                <div>
                  <h2>{staffInfo.fullname}</h2>
                  <p>
                    {staffInfo.role
                      ? formatRole(staffInfo.role)
                      : ""}
                  </p>
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

export default StaffHeader;
