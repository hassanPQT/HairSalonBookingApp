import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { collapse } from "../../../actions/Collapse";
import "./AdminHeader.scss";
import api from "../../../config/axios";
import loginUser from "../../../data/loginUser";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { logo, logo_blue_noBackground } from "../../../data/image";

const pageNames = {
  "/admin/dashboard": "Dashboard",
  "/admin/booking": "Booking",
  "/admin/service": "Service",
  "/admin/service/create": "New Service",
  "/admin/customer": "Customer",
  "/admin/voucher": "Voucher",
  "/admin/voucher/create": "New Voucher",
  "/admin/manager": "Manager",
  "/admin/manager/create": "New Manager",
  "/admin/branch": "Branch",
  "/admin/branch/create": "New Branch",
  "/admin/slot": "Slot",
  "/admin/kpi": "KPI",
};

const AdminHeader = () => {
  const collapsed = useSelector((state) => state.collapseReducer);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [pageName, setPageName] = useState("");
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState([]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-admin__user-info")) {
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
        const response = await api.get(`customer/profile`);
        const data = response.data.result;
        console.log(data);
        if (data) {
          setAdminInfo(data);
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
    navigate("/admin/dashboard");
  };

  function formatRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="header-admin">
      <div
        className={`header-admin__logo ${
          collapsed ? "header-admin__logo--collapsed" : ""
        }`}
      >
        <img
          onClick={handleGoback}
          src={collapsed ? logo_blue_noBackground : logo}
          alt={collapsed ? "Logo Fold" : "Logo"}
        />
      </div>
      <div className="header-admin__nav">
        <div className="header-admin__nav-left">
          <div className="header-admin__collapse" onClick={handleCollapse}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div className="header-admin__name-page">{pageName}</div>
        </div>
        <div className="header-admin__nav-right">
          <div className="header-admin__user-info" onClick={toggleDropdown}>
            <div className="header-admin__text">
              <div className="header-admin__name">{adminInfo.fullname}</div>
              <div className="header-admin__role">
                {adminInfo.role ? formatRole(adminInfo.role) : ""}
              </div>
            </div>
            <div className="header-admin__avatar">
              <img
                alt="User avatar"
                src={adminInfo.image || loginUser.avatar}
              />
            </div>
          </div>
          {dropdownOpen && (
            <div className="header-admin__dropdown">
              <div className="header-admin__dropdown--header">
                <img
                  height={60}
                  alt="User avatar"
                  src={adminInfo.image || loginUser.avatar}
                />
                <div>
                  <h2>{adminInfo.fullname}</h2>
                  <p>{adminInfo.role ? formatRole(adminInfo.role) : ""}</p>
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

export default AdminHeader;
