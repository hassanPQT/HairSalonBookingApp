import React, { useEffect, useState } from "react";
import "./AdminCreateManager.scss";
import { Spin } from "antd";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";

import { genders } from "../../../data/gender";
import Swal from "sweetalert2";

const AdminCreateManager = () => {
  const [loading, setLoading] = useState(false);
  const [salonLocations, setSalonLocations] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await api.get(endpoint);
        if (response.data) {
          setter(response.data.result);
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchData("salon", setSalonLocations);
  }, []);

  const createManagerData = async (e) => {
    e.preventDefault();
    const createValues = {
      fullName: e.target[0].value,
      email: e.target[1].value,
      phone: e.target[2].value,
      dob: e.target[3].value,
      gender: e.target[4].value,
      username: e.target[5].value,
      password: e.target[6].value,
      salonId: Number(e.target[7].value),
    };
    setLoading(true);
    try {
      const response = await api.post(`manager`, createValues);
      const data = response.data.result;
      if (data) {
        await Swal.fire({
          title: "Created!",
          text: "The Manager has been created.",
          icon: "success",
          timer: 2500,
        });
        navigate("/admin/manager");
      }
    } catch (err) {
      console.log(err);
      await Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    createManagerData(e);
  };

  return (
    <>
      <div className="admin-create-manager__breadcrumb">
        <Link
          to="/admin/manager"
          className="admin-create-manager__breadcrumb-link"
        >
          Manager
        </Link>{" "}
        &gt;
        <span className="admin-create-manager__breadcrumb-current">
          New Manager
        </span>
      </div>
      <div className="admin-create-manager">
        <div className="admin-create-manager__container">
          <form onSubmit={handleSubmit}>
            <h2 className="admin-create-manager__header">New Manager</h2>
            <div className="admin-create-manager__form-section">
              <div className="admin-create-manager__form-grid">
                <div className="admin-create-manager__form-grid admin-create-manager__form-grid--half-width">
                  <div className="admin-create-manager__form-group">
                    <label
                      htmlFor="fullname"
                      className="admin-create-manager__label"
                    >
                      Full Name:
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      className="admin-create-manager__input"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="admin-create-manager__form-group">
                    <label
                      htmlFor="email"
                      className="admin-create-manager__label"
                    >
                      Email:
                    </label>
                    <input
                      type="text"
                      id="email"
                      className="admin-create-manager__input"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div
                  className="admin-create-manager__form-grid
              admin-create-manager__form-grid--half-width"
                >
                  <div className="admin-create-manager__form-group">
                    <label
                      htmlFor="phone"
                      className="admin-create-manager__label"
                    >
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="admin-create-manager__input"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className="admin-create-manager__form-grid admin-create-manager__form-grid--half-width">
                    <div className="admin-create-manager__form-group">
                      <label
                        htmlFor="dob"
                        className="admin-create-manager__label"
                      >
                        Date of Birth:
                      </label>
                      <input
                        type="date"
                        id="dob"
                        className="admin-create-manager__input"
                        placeholder="Date of Birth"
                        required
                      />
                    </div>
                    <div className="admin-create-manager__form-group">
                      <label
                        htmlFor="gender"
                        className="admin-create-manager__label"
                      >
                        Gender:
                      </label>
                      <select
                        id="gender"
                        className="admin-create-manager__select"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        {genders.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="admin-create-manager__form-grid
                admin-create-manager__form-grid--half-width"
                >
                  <div className="admin-create-manager__form-group">
                    <label
                      htmlFor="username"
                      className="admin-create-manager__label"
                    >
                      Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="admin-create-manager__input"
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="admin-create-manager__form-group">
                    <label
                      htmlFor="password"
                      className="admin-create-manager__label"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="admin-create-manager__input"
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
                <div
                  className="admin-create-manager__form-grid
                admin-create-manager__form-grid--half-width"
                >
                  <div className="admin-create-manager__form-group admin-create-manager__form-group--full-width">
                    <label
                      htmlFor="salon"
                      className="admin-create-manager__label"
                    >
                      Select Salon:
                    </label>
                    <select
                      id="salon"
                      className="admin-create-manager__select"
                      defaultValue={0}
                      required
                    >
                      <option value={0} disabled>
                        Select Salon
                      </option>
                      {salonLocations.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-create-manager__button-container">
              <button
                type="submit"
                className="admin-create-manager__button"
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

export default AdminCreateManager;
