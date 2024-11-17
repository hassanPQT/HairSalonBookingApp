/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { React, useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { HiTrash } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import "./AdminManager.scss";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import loginUser from "../../../data/loginUser";
import { Spin } from "antd";
import Swal from "sweetalert2";

import { genders } from "../../../data/gender";
import { Skeleton } from "@mui/material";

export default function AdminManager({ buttonLabel }) {
  const [stylists, setStylists] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salonLocations, setSalonLocations] = useState([]);
  const [formData, setFormData] = useState({
    accountid: 0,
    fullName: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    salonId: 0,
    image: loginUser.avatar,
  });
  const [loading, setLoading] = useState(false);
  const [managersLoading, setManagersLoading] = useState(true);

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
    fetchManagersData();
  }, []);

  const fetchManagersData = async () => {
    setManagersLoading(true);
    try {
      const response = await api.get(`managers`);
      const data = response.data.result;
      if (data) {
        setStylists(data);
      }
    } catch (err) {
      console.error(err);
    }finally{
      setManagersLoading(false);
    }
  };

  const fetchManagerData = async (accountid) => {
    try {
      const response = await api.get(`manager/${accountid}`);
      const data = response.data.result;

      if (data) {
        const foundSalon = salonLocations.find(
          (item) => item.address === data.salonAddress
        );
        const salonId = foundSalon ? foundSalon.id : null;

        setFormData((prev) => ({
          ...prev,
          accountid: accountid,
          fullName: data.fullName || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          gender: data.gender || "",
          salonId: salonId || 0,
          image: data.image || prev.image,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStylistData = async (accountid) => {
    try {
      const response = await api.delete(`manager/${accountid}`);
      if (response.data) {
        Swal.fire({
          title: "Deleted!",
          text: "The Manager has been deleted.",
          icon: "success",
        });
        fetchManagersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteModal = (accountid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete this Manager!",
    }).then(async (result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await deleteStylistData(accountid);
          fetchManagersData();
        } catch (error) {}
      }
    });
  };

  const updateStylistData = async (e) => {
    e.preventDefault();
    const updateValues = {
      fullName: e.target[0].value,
      email: e.target[1].value,
      phone: e.target[2].value,
      dob: e.target[3].value,
      gender: e.target[4].value,
      salonId: Number(e.target[5].value),
    }
    setLoading(true);
    try {
      const response = await api.put(
        `manager/${formData.accountid}`,
        updateValues
      );
      const data = response.data.result;
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Update Manager successfully.",
          timer: 2500,
        });
        fetchManagersData();
        toggleModal();
      }
    } catch (err) {
      console.log(err)
      Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = async (accountid) => {
    if (accountid) {
      await fetchManagerData(accountid);
    }
    setIsModalOpen(!isModalOpen);
  };

  const createStylist = () => {
    navigate("/admin/manager/create");
  };

  const handleSubmit = (e) => {
    updateStylistData(e);
  };

  return (
    <>
      <div className="admin-manager">
        <div className="admin-service__content">
          <div className="admin-manager__header">
            <div className="admin-manager__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />
              {/* <i class="fas fa-search"></i> */}
              <input placeholder="Search here..." type="text" />
            </div>
            <div className="admin-manager__header-filter">
              <button onClick={createStylist}> {buttonLabel}</button>
            </div>
          </div>
          <div className="container">
          {managersLoading
              ?
                [...Array(4)].map((_, index) => (
                  <div key={index} className="container__card">
                    <Skeleton
                      variant="circular"
                      width={150}
                      height={150}
                      className="container__card--img"
                      style={{ margin: "0 auto 10px" }}
                    />
                    <Skeleton
                      variant="text"
                      width="70%"
                      style={{ margin: "10px auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      style={{ margin: "5px auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width="50%"
                      style={{ margin: "5px auto" }}
                    />
                    <div className="container__card-info">
                      <Skeleton
                        variant="text"
                        width="80%"
                        style={{ margin: "5px auto" }}
                      />
                      <Skeleton
                        variant="text"
                        width="70%"
                        style={{ margin: "5px auto" }}
                      />
                      <Skeleton
                        variant="text"
                        width="75%"
                        style={{ margin: "5px auto" }}
                      />
                    </div>
                    <div className="container__card-actions">
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        height={35}
                        style={{ borderRadius: "25px" }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        height={35}
                        style={{ borderRadius: "25px" }}
                      />
                    </div>
                  </div>
                ))
              :
            ((stylists || []).map((stylist) => (
              <div key={stylist.accountid} className="container__card">
                <img
                  alt="admin-manager picture"
                  height="50"
                  src={stylist.image ? stylist.image : loginUser.avatar}
                  width="50"
                />
                <h3>{stylist.fullName}</h3>
                <p>
                  User Name: <b>{stylist.username}</b>
                </p>
                <div className="container__card-info">
                  <p>
                    <FaLocationDot />
                    {stylist.salonAddress}
                  </p>
                  <p>
                    <FaPhone /> {stylist.phone}
                  </p>
                  <p>
                    <IoMail />
                    {stylist.email}
                  </p>
                </div>
                <div className="container__card-actions">
                  <button
                    className="delete btn"
                    onClick={() => confirmDeleteModal(stylist.accountid)}
                  >
                    <HiTrash />
                  </button>
                  <button
                    className="update btn"
                    onClick={() => toggleModal(stylist.accountid)}
                  >
                    <FaUserEdit />
                  </button>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="admin-manager-backdrop" onClick={toggleModal}>
            <div
              className="admin-manager-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="admin-manager-modal__header">Update Stylist</h2>
                <div className="admin-manager-modal__form-section">
                  <div className="manager-create-stylist__form-grid">
                    <div className="manager-create-stylist__form-grid manager-create-stylist__form-grid--half-width">
                      <div className="manager-create-stylist__form-group">
                        <label
                          htmlFor="fullName"
                          className="manager-create-stylist__label"
                        >
                          Full Name:
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          className="manager-create-stylist__input"
                          placeholder="Full Name"
                          defaultValue={formData.fullName}
                          required
                        />
                      </div>
                      <div className="manager-create-stylist__form-group">
                        <label
                          htmlFor="email"
                          className="manager-create-stylist__label"
                        >
                          Email:
                        </label>
                        <input
                          type="text"
                          id="email"
                          className="manager-create-stylist__input"
                          placeholder="Email"
                          defaultValue={formData.email}
                          required
                        />
                      </div>
                    </div>
                    <div
                      className="manager-create-stylist__form-grid
              manager-create-stylist__form-grid--half-width"
                    >
                      <div className="manager-create-stylist__form-group">
                        <label
                          htmlFor="phone"
                          className="manager-create-stylist__label"
                        >
                          Phone Number:
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className="manager-create-stylist__input"
                          placeholder="Phone Number"
                          defaultValue={formData.phone}
                          required
                        />
                      </div>
                      <div className="manager-create-stylist__form-grid manager-create-stylist__form-grid--half-width">
                        <div className="manager-create-stylist__form-group">
                          <label
                            htmlFor="dob"
                            className="manager-create-stylist__label"
                          >
                            Date of Birth:
                          </label>
                          <input
                            type="date"
                            id="dob"
                            className="manager-create-stylist__input"
                            placeholder="Date of Birth"
                            defaultValue={formData.dob}
                            required
                          />
                        </div>
                        <div className="manager-create-stylist__form-group">
                          <label
                            htmlFor="gender"
                            className="manager-create-stylist__label"
                          >
                            Gender:
                          </label>
                          <select
                            id="gender"
                            className="manager-create-stylist__select"
                            defaultValue={
                              formData.gender ? formData.gender : ""
                            }
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
                      className="manager-create-stylist__form-grid
                manager-create-stylist__form-grid--half-width"
                    >
                      <div className="manager-create-stylist__form-group manager-create-stylist__form-group--full-width">
                        <label
                          htmlFor="salon"
                          className="manager-create-stylist__label"
                        >
                          Select Salon:
                        </label>
                        <select
                          id="salon"
                          className="manager-create-stylist__select"
                          defaultValue={formData.salonId ? formData.salonId : 0}
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
                <div className="admin-manager-modal__button-container">
                  <button
                    type="submit"
                    className="admin-manager-modal__button"
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
}
