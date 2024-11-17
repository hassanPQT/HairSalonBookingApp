/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./AdminVoucher.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateVoucher } from "../../../actions/Update";
import { Skeleton } from "@mui/material";
import { FolderOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const AdminVoucher = ({ buttonLabel }) => {
  const [vouchers, setVouchers] = useState([]);
  const [originalVouchers, setOriginalVouchers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const isUpdate = useSelector(state => state.updateVoucherReducer);
  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    expiryDate: "",
    discountAmount: 0,
    quantity: 0,
  });

  const [loading, setLoading] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);

  useEffect(() => {
    setVoucherLoading(true);
    const fetchVouchers = async () => {
      try {
        const response = await api.get("vouchers");
        const data = response.data.result;

        if (data) {
          setVouchers(data);
          setOriginalVouchers(data);
        }
      } catch (error) {
        console.log(error)
      }finally{
        setVoucherLoading(false);
      }
    };

    fetchVouchers();
  }, [isUpdate]);

  const fetchVoucherData = async (code) => {
    try {
      const response = await api.get(`voucher/${code}`);
      const data = response.data.result;
      if (data) {
        setFormData((prev) => ({
          ...prev,
          id: data.id,
          code: data.code || "",
          name: data.name || "",
          expiryDate: data.expiryDate || "",
          discountAmount: data.discountAmount || 0,
          quantity: data.quantity || 0,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (formData.serviceId) {
        fetchVoucherData(formData.serviceId);
      }
    }
  }, [isModalOpen]);

  const updateServiceData = async (e) => {
    e.preventDefault();
    const updateValues = {
      code: e.target[0].value,
      name: e.target[1].value,
      expiryDate: e.target[2].value,
      discountAmount: Number(e.target[3].value),
      quantity: Number(e.target[4].value),
    };
    setLoading(true);
    try {
      const response = await api.put(
        `voucher/${formData.id}`,
        updateValues
      );
      const data = response.data.result;
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Update Voucher successfully.",
          timer: 2500,
        });
        setFormData((prev) => ({
          ...prev,
          code: data.code || "",
          name: data.name || "",
          expiryDate: data.expiryDate || "",
          discountAmount: data.discountAmount || 0,
          quantity: data.quantity || 0,
        }));
         dispatch(updateVoucher());
        toggleModal();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

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
      sortedVouchers = [...originalVouchers];
    } else {
      sortedVouchers = [...vouchers].sort((a, b) => {
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

    setVouchers(sortedVouchers);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") return " ▲";
      if (sortConfig.direction === "descending") return " ▼";
    }
    return "";
  };

  const createVoucher = () => {
    navigate("/admin/voucher/create");
  };

  const toggleModal = async (code) => {
    if (code) {
      await fetchVoucherData(code);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e) => {
      updateServiceData(e)
  };

  return (
    <>
      <div className="admin-voucher">
        <div className="admin-voucher__header">
          <div className="admin-voucher__header-searchBar">
            <BiSearchAlt className="searchBar-icon" />
            {/* <i class="fas fa-search"></i> */}
            <input placeholder="Search here..." type="text" />
          </div>
          <div className="admin-voucher__header-filter">
            <button onClick={createVoucher}> {buttonLabel}</button>
          </div>
        </div>
        <div className="admin-voucher__container">
          <div className="admin-voucher__content">
            <table className="admin-voucher__table">
              <thead>
                <tr>
                  <th onClick={() => sortBy("id")}>
                    ID{getSortIndicator("id")}
                  </th>
                  <th onClick={() => sortBy("code")}>
                    Code{getSortIndicator("code")}
                  </th>
                  <th onClick={() => sortBy("name")}>
                    Name{getSortIndicator("name")}
                  </th>
                  <th onClick={() => sortBy("expiryDate")}>
                    Expiry Date{getSortIndicator("expiryDate")}
                  </th>
                  <th onClick={() => sortBy("discountAmount")}>
                    Discount Amount{getSortIndicator("discountAmount")}
                  </th>
                  <th onClick={() => sortBy("quantity")}>
                    Quantity{getSortIndicator("quantity")}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
              {voucherLoading
                  ? [...Array(6)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <Skeleton width={40} />
                        </td>
                        <td>
                          <Skeleton width={120} />
                        </td>
                        <td>
                          <Skeleton width={150} />
                        </td>
                        <td>
                          <Skeleton width={120} />
                        </td>
                        <td>
                          <Skeleton width={120} />
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
                  : vouchers.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="admin-voucher__notValid">
                          <FolderOutlined className="notValid--icon" />
                          <p>Currently, there are no vouchers</p>
                        </div>
                      </td>
                    </tr>
                  ) :
                (vouchers.map((voucher) => (
                  <tr key={voucher.id}>
                    <td className="admin-voucher__id">{voucher.id}</td>
                    <td className="admin-voucher__code">{voucher.code}</td>
                    <td>
                      <div className="admin-voucher__name">{voucher.name}</div>
                    </td>
                    <td className="admin-voucher__date">
                      {formatDateString(voucher.expiryDate)}
                    </td>
                    <td className="admin-voucher__discountAmount">
                      {voucher.discountAmount}%
                    </td>
                    <td>
                      <span
                        className={`admin-voucher__quantity admin-voucher__quantity--${voucher.quantity}`}
                      >
                        {voucher.quantity}
                      </span>
                    </td>
                    <td className="admin-voucher__actions">
                      <button
                        className="admin-voucher__action-button"
                        onClick={() => toggleModal(voucher.code)}
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="admin-voucher-backdrop" onClick={toggleModal}>
            <div
              className="admin-voucher-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="admin-voucher-modal__header">Update Voucher</h2>
                <div className="admin-voucher-modal__form-section">
                  <div className="admin-voucher-modal__form-grid">
                    <div className="admin-voucher-modal__form-grid admin-voucher-modal__form-grid--half-width">
                      <div className="admin-voucher-modal__form-group">
                        <label
                          htmlFor="voucherCode"
                          className="admin-voucher-modal__label"
                        >
                          Voucher code:
                        </label>
                        <input
                          type="text"
                          id="voucherCode"
                          className="admin-voucher-modal__input"
                          placeholder="Service Name"
                          defaultValue={formData.code}
                        />
                      </div>
                      <div className="admin-voucher-modal__form-group">
                        <label
                          htmlFor="name"
                          className="admin-voucher-modal__label"
                        >
                          Name:
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="admin-voucher-modal__input"
                          placeholder="Name"
                          defaultValue={formData.name}
                        />
                      </div>
                    </div>
                    <div
                      className="admin-voucher-modal__form-grid
              admin-voucher-modal__form-grid--half-width"
                    >
                      <div className="admin-voucher-modal__form-group">
                        <label
                          htmlFor="expiryDate"
                          className="admin-voucher-modal__label"
                        >
                          Expiry Date:
                        </label>
                        <input
                          type="date"
                          id="expiryDate"
                          className="admin-voucher-modal__input"
                          defaultValue={formData.expiryDate}
                        />
                      </div>
                      <div
                        className="admin-voucher-modal__form-grid
              admin-voucher-modal__form-grid--half-width"
                      >
                        <div className="admin-voucher-modal__form-group">
                          <label
                            htmlFor="discountAmount"
                            className="admin-voucher-modal__label"
                          >
                            Discount Amount:
                          </label>
                          <input
                            type="text"
                            id="discountAmount"
                            className="admin-voucher-modal__input"
                            placeholder="Discount Amount"
                            defaultValue={formData.discountAmount}
                          />
                        </div>
                        <div className="admin-voucher-modal__form-group">
                          <label
                            htmlFor="quantity"
                            className="admin-voucher-modal__label"
                          >
                            Quantity:
                          </label>
                          <input
                            type="text"
                            id="quantity"
                            className="admin-voucher-modal__input"
                            placeholder="Quantity"
                            defaultValue={formData.quantity}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-voucher-modal__button-container">
                  <button
                    type="submit"
                    className="admin-voucher-modal__button"
                    disabled={loading}
                  >
                    {loading ? <Spin size="small" /> : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminVoucher;
