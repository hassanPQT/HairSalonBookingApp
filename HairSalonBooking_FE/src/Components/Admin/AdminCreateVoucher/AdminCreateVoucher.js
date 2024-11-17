import React, { useState } from "react";
import "./AdminCreateVoucher.scss";
import { Spin } from "antd";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminCreateService = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createServiceData = async (e) => {
    e.preventDefault();
    const createValues = {
      code: e.target[0].value,
      name: e.target[1].value,
      expiryDate: e.target[2].value,
      discountAmount: Number(e.target[3].value),
      quantity: Number(e.target[4].value),
    };

    console.log(createValues);

    setLoading(true);
    try {
      const response = await api.post(`voucher`, createValues);
      const data = response.data.result;


      if (data) {
        await Swal.fire({
          title: "Created!",
          text: "The Voucher has been created.",
          icon: "success",
          timer: 2500
        });
        navigate("/admin/voucher");
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    createServiceData(e);
  };

  return (
    <>
      <div className="admin-create-voucher__breadcrumb">
        <Link
          to="/admin/voucher"
          className="admin-create-voucher__breadcrumb-link"
        >
          Voucher
        </Link>{" "}
        &gt;
        <span className="admin-create-voucher__breadcrumb-current">
          New Voucher
        </span>
      </div>
      <div className="admin-create-voucher">
        <div className="admin-create-voucher__container">
          <form onSubmit={handleSubmit}>
            <h2 className="admin-create-voucher__header">New Voucher</h2>
            <div className="admin-create-voucher__form-section">
              <div className="admin-create-voucher__form-grid">
                <div className="admin-create-voucher__form-grid admin-create-voucher__form-grid--half-width">
                  <div className="admin-create-voucher__form-group">
                    <label
                      htmlFor="voucherCode"
                      className="admin-create-voucher__label"
                    >
                      Voucher code:
                    </label>
                    <input
                      type="text"
                      id="voucherCode"
                      className="admin-create-voucher__input"
                      placeholder="Voucher code"
                    />
                  </div>
                  <div className="admin-create-voucher__form-group">
                    <label
                      htmlFor="name"
                      className="admin-create-voucher__label"
                    >
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="admin-create-voucher__input"
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div
                  className="admin-create-voucher__form-grid
              admin-create-voucher__form-grid--half-width"
                >
                  <div className="admin-create-voucher__form-group">
                    <label
                      htmlFor="expiryDate"
                      className="admin-create-voucher__label"
                    >
                      Expiry Date:
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      className="admin-create-voucher__input"
                      placeholder="Expiry Date"
                    />
                  </div>
                  <div
                  className="admin-create-voucher__form-grid
              admin-create-voucher__form-grid--half-width"
                >
                    <div className="admin-create-voucher__form-group">
                    <label
                      htmlFor="discountAmount"
                      className="admin-create-voucher__label"
                    >
                      Discount Amount:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="admin-create-voucher__input"
                      placeholder="discountAmount"
                    />
                  </div>
                  <div className="admin-create-voucher__form-group">
                    <label
                      htmlFor="quantity"
                      className="admin-create-voucher__label"
                    >
                      Quantity:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="admin-create-voucher__input"
                      placeholder="quantity"
                    />
                  </div>
                
                  </div>
                </div>
              </div>

              <div className="admin-create-voucher__button-container">
                <button
                  type="submit"
                  className="admin-create-voucher__button"
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreateService;
