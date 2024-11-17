/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./StaffCustomer.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import loginUser from "../../../data/loginUser";
import { Skeleton } from "@mui/material";
import { FolderOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const StaffCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [customersLoading, setCustomersLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = async (currentPage) => {
    setCustomersLoading(true);
    try {
      const response = await api.get(`account/page?page=${currentPage}&size=7`);
      const data = response.data.result.content;
      const total = response.data.result.totalPages;
      if (data) {
        setCustomers(data);
        setOriginalCustomers(data);
        setTotalPages(total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCustomersLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const sortBy = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    let sortedVouchers;

    if (direction === null) {
      sortedVouchers = [...originalCustomers];
    } else {
      sortedVouchers = [...customers].sort((a, b) => {
        if (key === "discountAmount") {
          return direction === "ascending"
            ? parseFloat(a[key]) - parseFloat(b[key])
            : parseFloat(b[key]) - parseFloat(a[key]);
        }
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setCustomers(sortedVouchers);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") return " ▲";
      if (sortConfig.direction === "descending") return " ▼";
    }
    return "";
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const createCustomer = () => {
    navigate("/staff/customer/create");
  };

  return (
    <>
      <div className="staff-customer">
        <div className="staff-customer__header">
          <div className="staff-customer__header-searchBar">
            <BiSearchAlt className="searchBar-icon" />
            {/* <i class="fas fa-search"></i> */}
            <input placeholder="Search here..." type="text" />
          </div>
          <div className="staff-booking-pending__header-filter">
            <button onClick={createCustomer}>New Customer</button>
          </div>
        </div>
        <div className="staff-customer__container">
          <div className="staff-customer__content">
            <table className="staff-customer__table">
              <thead>
                <tr>
                  <th onClick={() => sortBy("id")}>
                    ID{getSortIndicator("id")}
                  </th>
                  <th onClick={() => sortBy("fullname")}>
                    Full Name{getSortIndicator("fullname")}
                  </th>
                  <th onClick={() => sortBy("email")}>
                    Email{getSortIndicator("email")}
                  </th>
                  <th onClick={() => sortBy("dob")}>
                    Date of Birth{getSortIndicator("dob")}
                  </th>
                  <th onClick={() => sortBy("phone")}>
                    Phone{getSortIndicator("phone")}
                  </th>
                  <th>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {customersLoading
                  ? [...Array(6)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <Skeleton width={40} />
                        </td>
                        <td style={{ display: "flex", alignItems: "center" }}>
                          <Skeleton variant="circular" width={36} height={36} />
                          <Skeleton width={120} style={{ marginLeft: "8px" }} />
                        </td>
                        <td>
                          <Skeleton width={150} />
                        </td>
                        <td>
                          <Skeleton width={120} />
                        </td>
                        <td>
                          <Skeleton width={80} />
                        </td>
                        <td>
                          <Skeleton width={80} />
                        </td>
                      </tr>
                    ))
                  : customers.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="staff-customer__notValid">
                          <FolderOutlined className="notValid--icon" />
                          <p>Currently, there are no customers</p>
                        </div>
                      </td>
                    </tr>
                  ) : 
                  (customers.map((customer) => (
                      <tr key={customer.accountId}>
                        <td className="staff-customer__id">
                          {customer.accountId}
                        </td>
                        <td>
                          <div className="staff-customer__customer">
                            <img
                              src={customer.image || loginUser.avatar}
                              alt={customer.fullName}
                              className="staff-customer__customer-image"
                            />
                            <span className="staff-customer__customer-name">
                              {customer.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="staff-customer__date">
                          {customer.email}
                        </td>
                        <td className="staff-customer__discountAmount">
                          {formatDateString(customer.dob)}
                        </td>
                        <td>
                          <span className={`staff-customer__quantity`}>
                            {customer.phone}
                          </span>
                        </td>
                        <td>
                          <span className={`staff-customer__quantity`}>
                            {customer.delete ?  "Un Active" : "Active"}
                          </span>
                        </td>
                      </tr>
                    )))}
              </tbody>
            </table>
          </div>
        </div>

        {customers && customers.length > 0 && (
          <div className="staff-customer__pagination">
            <div className="staff-customer__pagination-pages">
              <span
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 0 ? "disabled" : ""}
              >
                <FaAngleLeft className="pagination-icon" />
              </span>
              {[...Array(totalPages)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={currentPage === index ? "active" : ""}
                >
                  {index + 1}
                </span>
              ))}
              <span
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages - 1 ? "disabled" : ""}
              >
                <FaChevronRight className="pagination-icon" />
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StaffCustomer;
