/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { React, useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { HiTrash } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import "./ManagerStaff.scss";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import loginUser from "../../../data/loginUser";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import uploadFile from "../../../utils/upload";
import { updateStaff } from "../../../actions/Update";
import Swal from "sweetalert2";
import {genders} from "../../../data/gender";
import { Skeleton } from "@mui/material";

export default function ManagerStaff({ buttonLabel }) {
  const [staffs, setStaffs] = useState([]);
  const [manager, setManager] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [salonLocations, setSalonLocations] = useState([]);
  const [formData, setFormData] = useState({
    accountid: 0,
    fullName: "",
    email: "",
    username: "",
    phone: "",
    dob: "",
    gender: "",
    salonId: 0,
    image: loginUser.avatar,
  });
  const [loading, setLoading] = useState(false);
  const [staffsLoading, setStaffsLoading] = useState(true);
  const dispatch = useDispatch();
  const isUpdate = useSelector((state) => state.updateStaffReducer);
  const [selectedFileObject, setSelectedFileObject] = useState(null);

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
          setManager(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
    fetchManagerData();
  }, []);


  useEffect(() => {
    if (manager.salonId !== undefined) {
      fetchStaffsData();
    }
  }, [isUpdate, manager]);

  const fetchStaffsData = async () => {
    setStaffsLoading(true);
    try {
      const response = await api.get(`staff/salon/${manager.salonId}`);
      const data = response.data.result;
      console.log(data)
      if (data) {
        setStaffs(data);
      }
    } catch (err) {
      console.error(err);
    }finally{
      setStaffsLoading(false);
    }
  };

  const fetchStaffData = async (accountid) => {
    try {
      const response = await api.get(`staff/${accountid}`);
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

  const deleteStaffData = async (accountid) => {
    try {
      const response = await api.delete(`staff/${accountid}`);
      if (response.data) {
        Swal.fire({
          title: "Deleted!",
          text: "The staff has been deleted.",
          icon: "success",
        });
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
      confirmButtonText: "Yes, delete this staff!",
    }).then(async (result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await deleteStaffData(accountid);
          fetchStaffData();
        } catch (error) {}
      }
    });
  };

  const updateStaffData = async (e) => {
    e.preventDefault();
    const updateValues = {
      fullName: e.target[1].value,
      email: e.target[2].value,
      phone: e.target[3].value,
      dob: e.target[4].value,
      gender: e.target[5].value,
      salonId: Number(e.target[6].value),
      image: null,
    };

    if (selectedFileObject) {
      const firebaseResponse = await uploadFile(selectedFileObject);
      updateValues.image = firebaseResponse;
    } else {
      updateValues.image = formData.image;
    }
    console.log(updateValues);

    setLoading(true);
    try {
      const response = await api.put(
        `staff/${formData.accountid}`,
        updateValues
      );
      const data = response.data.result;

      if (data) {
        const foundSalon = salonLocations.find(
          (item) => item.address === data.salonAddress
        );
        const salonId = foundSalon ? foundSalon.id : null;

        setFormData((prev) => ({
          ...prev,
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          gender: data.gender || "",
          salonId: salonId,
          image: selectedFile || prev.image,
        }));
        dispatch(updateStaff());
        toggleModal();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (formData.accountid) {
        fetchStaffData(formData.accountid);
      }
    }
  }, [isModalOpen]);

  const toggleModal = async (accountid) => {
    if (accountid) {
      await fetchStaffData(accountid);
    }

    setIsModalOpen(!isModalOpen);
    setSelectedFile(null);
  };

  const createStaff = () => {
    navigate("/manager/staff/create");
  };

  const handleSubmit = (e) => {
    updateStaffData(e);
  };

  return (
    <>
      <div className="manager-staff">
        <div className="admin-service__content">
          <div className="manager-staff__header">
            <div className="manager-staff__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />
              <input placeholder="Search here..." type="text" />
            </div>
            <div className="manager-staff__header-filter">
              <button onClick={createStaff}> {buttonLabel}</button>
            </div>
          </div>
          <div className="container">
          {staffsLoading
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
            ((staffs || []).map((staff) => (
              <div key={staff.accountid} className="container__card">
                <img
                  alt="manager-staff picture"
                  height="50"
                  src={staff.image ? staff.image : loginUser.avatar}
                  width="50"
                />
                <h3>{staff.fullName}</h3>
                <p>
                  User Name: <b>{staff.username}</b>
                </p>
                <div className="container__card-info">
                  <p>
                    <FaLocationDot />
                    {staff.salonAddress}
                  </p>
                  <p>
                    <FaPhone /> {staff.phone}
                  </p>
                  <p>
                    <IoMail />
                    {staff.email}
                  </p>
                </div>
                <div className="container__card-actions">
                  <button
                    className="delete btn"
                    onClick={() => confirmDeleteModal(staff.accountid)}
                  >
                    <HiTrash />
                  </button>
                  <button
                    className="update btn"
                    onClick={() => toggleModal(staff.accountid)}
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
          <div className="manager-staff-backdrop" onClick={toggleModal}>
            <div
              className="manager-staff-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="manager-staff-modal__header">Update Stylist</h2>
                <div className="manager-staff-modal__avatar-section">
                  <div className="manager-staff-modal__avatar">
                    <img
                      src={selectedFile || formData.image}
                      alt={formData.fullName}
                    />
                  </div>
                  <div className="manager-staff-modal__avatar-info">
                    <h3 className="manager-staff-modal__avatar-title">
                      Change Avatar
                    </h3>
                    <p className="manager-staff-modal__avatar-description">
                      Recommended Dimensions: 120x120 Max file size: 5MB
                    </p>
                    <label className="manager-staff-modal__upload-btn">
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
                <div className="manager-staff-modal__form-section">
                  <div className="manager-staff-modal__form-grid">
                    <div className="manager-staff-modal__form-grid manager-staff-modal__form-grid--half-width">
                      <div className="manager-staff-modal__form-group">
                        <label
                          htmlFor="fullName"
                          className="manager-staff-modal__label"
                        >
                          Full Name:
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          className="manager-staff-modal__input"
                          placeholder="Full Name"
                          defaultValue={formData.fullName}
                        />
                      </div>
                      <div className="manager-staff-modal__form-group">
                        <label
                          htmlFor="email"
                          className="manager-staff-modal__label"
                        >
                          Email:
                        </label>
                        <input
                          type="text"
                          id="email"
                          className="manager-staff-modal__input"
                          placeholder="Email"
                          defaultValue={formData.email}
                        />
                      </div>
                    </div>
                    <div
                      className="manager-staff-modal__form-grid
              manager-staff-modal__form-grid--half-width"
                    >
                      <div className="manager-staff-modal__form-group">
                        <label
                          htmlFor="phone"
                          className="manager-staff-modal__label"
                        >
                          Phone Number:
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className="manager-staff-modal__input"
                          placeholder="Phone Number"
                          defaultValue={formData.phone}
                        />
                      </div>
                      <div className="manager-staff-modal__form-grid manager-staff-modal__form-grid--half-width">
                        <div className="manager-staff-modal__form-group">
                          <label
                            htmlFor="dob"
                            className="manager-staff-modal__label"
                          >
                            Date of Birth:
                          </label>
                          <input
                            type="date"
                            id="dob"
                            className="manager-staff-modal__input"
                            placeholder="Date of Birth"
                            defaultValue={formData.dob}
                          />
                        </div>
                        <div className="manager-staff-modal__form-group">
                          <label
                            htmlFor="gender"
                            className="manager-staff-modal__label"
                          >
                            Gender:
                          </label>
                          <select
                            id="gender"
                            className="manager-staff-modal__select"
                            defaultValue={
                              formData.gender ? formData.gender : ""
                            }
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
                      className="manager-staff-modal__form-grid
                manager-staff-modal__form-grid--half-width"
                    >
                      <div className="manager-staff-modal__form-group manager-staff-modal__form-group--full-width">
                        <label
                          htmlFor="salon"
                          className="manager-staff-modal__label"
                        >
                          Select Salon:
                        </label>
                        <select
                          id="salon"
                          className="manager-staff-modal__select"
                          defaultValue={formData.salonId ? formData.salonId : 0}
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
                <div className="manager-staff-modal__button-container">
                  <button
                    type="submit"
                    className="manager-staff-modal__button"
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
