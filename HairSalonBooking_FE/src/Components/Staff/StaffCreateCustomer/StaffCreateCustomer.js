import React, { useState } from "react";
import "./StaffCreateCustomer.scss";
import { Spin } from "antd";
import api from "../../../config/axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const StaffCreateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const newCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    const customerValues = {
      fullName,
      phone,
    };

    try {
      const response = await api.post("staff/customer", customerValues);
      const data = response.data.result;

      if (data) {
        Swal.fire({
          icon: "success",
          title: "Create new customer successfully",
          showCloseButton: true,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            setFullName("");
            setPhone("");
          }
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    newCustomer(e);
  };

  return (
    <>
     <div className="staff-create-customer__breadcrumb">
        <Link
          to="/staff/customer"
          className="staff-create-customer__breadcrumb-link"
        >
          Customer
        </Link>{" "}
        &gt;
        <span className="staff-create-customer__breadcrumb-current">
          New Customer
        </span>
      </div>
      <div className="staff-create-customer">
        <div className="staff-create-customer__container">
          <form onSubmit={handleSubmit}>
            <h2 className="staff-create-customer__header">New Customer</h2>
            <div className="staff-create-customer__form-section">
              <div className="staff-create-customer__form-grid">
                <div className="staff-create-customer__form-grid staff-create-customer__form-grid--half-width">
                  <div className="staff-create-customer__form-group">
                    <label
                      htmlFor="fullName"
                      className="staff-create-customer__label"
                    >
                      Full Name:
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="staff-create-customer__input"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="staff-create-customer__form-group">
                    <label
                      htmlFor="phone"
                      className="staff-create-customer__label"
                    >
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="staff-create-customer__input"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="staff-create-customer__button-container">
              <button
                type="submit"
                className="staff-create-customer__button"
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StaffCreateCustomer;
