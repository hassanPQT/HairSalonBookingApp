/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./AdminCustomer.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import Swal from "sweetalert2";
import loginUser from "../../../data/loginUser";
import { Skeleton } from "@mui/material";
import { FolderOutlined } from "@ant-design/icons";

const AdminCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [customersLoading, setCustomersLoading] = useState(false);

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

  const deleteCustomerData = async (accountId) => {
    try {
      const response = await api.delete(`customer/${accountId}`);
      if (response.data) {
        Swal.fire({
          title: "Deleted!",
          text: "The customer has been deleted.",
          icon: "success",
          timer: 2500
        });
        fetchCustomers(currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteModal = (accountId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete this customer!",
    }).then(async (result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await deleteCustomerData(accountId);
          fetchCustomers();
        } catch (error) {}
      }
    });
  };

  const activeCustomerData = async (accountId) => {
    try {
      const response = await api.put(`customer/active/${accountId}`);
      if (response.data) {
        Swal.fire({
          title: "Active!",
          text: "The customer has been active again.",
          icon: "success",
          timer: 2500
        });
        fetchCustomers(currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmActiveModal = (accountId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to active this customer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, active this service!",
    }).then(async (result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await activeCustomerData(accountId);
          fetchCustomers();
        } catch (error) {}
      }
    });
  };

  return (
    <>
      <div className="admin-customer">
        <div className="admin-customer__header">
          <div className="admin-customer__header-searchBar">
            <BiSearchAlt className="searchBar-icon" />
            {/* <i class="fas fa-search"></i> */}
            <input placeholder="Search here..." type="text" />
          </div>
        </div>
        <div className="admin-customer__container">
          <div className="admin-customer__content">
            <table className="admin-customer__table">
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
                  <th>Action</th>
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
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Skeleton
                              variant="circular"
                              width={43}
                              height={43}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  : customers.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="admin-customer__notValid">
                          <FolderOutlined className="notValid--icon" />
                          <p>Currently, there are no customers</p>
                        </div>
                      </td>
                    </tr>
                  ) : 
                  (customers.map((customer) => (
                      <tr key={customer.accountId}>
                        <td className="admin-customer__id">
                          {customer.accountId}
                        </td>
                        <td>
                          <div className="admin-customer__customer">
                            <img
                              src={customer.image || loginUser.avatar}
                              alt={customer.fullName}
                              className="admin-customer__customer-image"
                            />
                            <span className="admin-customer__customer-name">
                              {customer.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="admin-customer__date">
                          {customer.email}
                        </td>
                        <td className="admin-customer__discountAmount">
                          {formatDateString(customer.dob)}
                        </td>
                        <td>
                          <span className={`admin-customer__quantity`}>
                            {customer.phone}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-customer__quantity`}>
                            {customer.delete ?  "Un Active" : "Active"}
                          </span>
                        </td>
                        <td className="admin-customer__actions">
                          {customer.delete ? (
                            <button
                              className="admin-customer__action-button"
                              onClick={() =>
                                confirmActiveModal(customer.accountId)
                              }
                            >
                              <MdRestartAlt />
                            </button>
                          ) : (
                            <button
                              className="admin-customer__action-button"
                              onClick={() =>
                                confirmDeleteModal(customer.accountId)
                              }
                            >
                              🗑
                            </button>
                          )}
                        </td>
                      </tr>
                    )))}
              </tbody>
            </table>
          </div>
        </div>

        {customers && customers.length > 0 && (
          <div className="admin-customer__pagination">
            <div className="admin-customer__pagination-pages">
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

export default AdminCustomer;
