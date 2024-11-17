/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./ManagerCreateStaff.scss";
import { Spin } from "antd";
import loginUser from "../../../data/loginUser";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import {genders} from "../../../data/gender";

const ManagerCreateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [salonLocations, setSalonLocations] = useState([]);
  const [selectedFileObject, setSelectedFileObject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    image: loginUser.avatar,
  });
  const navigate = useNavigate();
  const [managerInfo, setManagerInfo] = useState([]);
  const [salonAddress, setSalonAddress] = useState("");


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setSelectedFileObject(file);
    }
  };

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

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        if (data) {
          setManagerInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchManagerData();
  }, []);

    useEffect(() => {
      if (managerInfo.salonId !== undefined && salonLocations.length > 0) {
        const salon = salonLocations.find(salon => salon.id === managerInfo.salonId);
        setSalonAddress(salon ? salon.address : "Salon not found");
      }
    }, [managerInfo, salonLocations])

  const createStylishData = async (e) => {
    e.preventDefault();
    const createValues = {
      fullName: e.target[1].value,
      email: e.target[2].value,
      phone: e.target[3].value,
      dob: e.target[4].value,
      gender: e.target[5].value,
      username: e.target[6].value,
      password: e.target[7].value,
      salonId: Number(e.target[8].value),
      // image: null,
    };

    // if (selectedFileObject) {
    //   const firebaseResponse = await uploadFile(selectedFileObject);
    //   createValues.image = firebaseResponse;
    // } else {
    //   createValues.image = formData.image;
    // }

    console.log(createValues);
    setLoading(true);
    try {
      const response = await api.post(`staff`, createValues);
      const data = response.data.result;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          image: selectedFile || prev.image,
        }));
        navigate("/manager/staff");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    createStylishData(e);
  };

  return (
    <>
      <div className="manager-create-staff__breadcrumb">
        <Link
          to="/manager/staff"
          className="manager-create-staff__breadcrumb-link"
        >
          Staff
        </Link>{" "}
        &gt;
        <span className="manager-create-staff__breadcrumb-current">
          New Staff
        </span>
      </div>
      <div className="manager-create-staff">
        <div className="manager-create-staff__container">
          <form onSubmit={handleSubmit}>
            <h2 className="manager-create-staff__header">New Staff</h2>
            <div className="manager-create-staff__avatar-section">
              <div className="manager-create-staff__avatar">
                <img
                  src={selectedFile || formData.image}
                  alt={formData.fullname}
                />
              </div>
              <div className="manager-create-staff__avatar-info">
                <h3 className="manager-create-staff__avatar-title">
                  Change Avatar
                </h3>
                <p className="manager-create-staff__avatar-description">
                  Recommended Dimensions: 120x120 Max file size: 5MB
                </p>
                <label className="manager-create-staff__upload-btn">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
            <div className="manager-create-staff__form-section">
              <div className="manager-create-staff__form-grid">
                <div className="manager-create-staff__form-grid manager-create-staff__form-grid--half-width">
                  <div className="manager-create-staff__form-group">
                    <label
                      htmlFor="fullname"
                      className="manager-create-staff__label"
                    >
                      Full Name:
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      className="manager-create-staff__input"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="manager-create-staff__form-group">
                    <label
                      htmlFor="email"
                      className="manager-create-staff__label"
                    >
                      Email:
                    </label>
                    <input
                      type="text"
                      id="email"
                      className="manager-create-staff__input"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div
                  className="manager-create-staff__form-grid
              manager-create-staff__form-grid--half-width"
                >
                  <div className="manager-create-staff__form-group">
                    <label
                      htmlFor="phone"
                      className="manager-create-staff__label"
                    >
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="manager-create-staff__input"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="manager-create-staff__form-grid manager-create-staff__form-grid--half-width">
                    <div className="manager-create-staff__form-group">
                      <label
                        htmlFor="dob"
                        className="manager-create-staff__label"
                      >
                        Date of Birth:
                      </label>
                      <input
                        type="date"
                        id="dob"
                        className="manager-create-staff__input"
                        placeholder="Date of Birth"
                      />
                    </div>
                    <div className="manager-create-staff__form-group">
                      <label
                        htmlFor="gender"
                        className="manager-create-staff__label"
                      >
                        Gender:
                      </label>
                      <select
                        id="gender"
                        className="manager-create-staff__select"
                        defaultValue=""
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
                  className="manager-create-staff__form-grid
                manager-create-staff__form-grid--half-width"
                >
                  <div className="manager-create-staff__form-group">
                    <label
                      htmlFor="username"
                      className="manager-create-staff__label"
                    >
                      Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="manager-create-staff__input"
                      placeholder="Username"
                    />
                  </div>
                  <div className="manager-create-staff__form-group">
                    <label
                      htmlFor="password"
                      className="manager-create-staff__label"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="manager-create-staff__input"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div
                  className="manager-create-staff__form-grid
                manager-create-staff__form-grid--half-width"
                >
                  <div className="manager-create-staff__form-group manager-create-staff__form-group--full-width">
                    <label
                      htmlFor="salon"
                      className="manager-create-staff__label"
                    >
                      Select Salon:
                    </label>
                    <input
                      type="text"
                      id="salon"
                      className="manager-create-staff__input"
                      value={salonAddress}
                      disabled
                      placeholder="Loading salon address..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="manager-create-staff__button-container">
              <button
                type="submit"
                className="manager-create-staff__button"
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

export default ManagerCreateStaff;
