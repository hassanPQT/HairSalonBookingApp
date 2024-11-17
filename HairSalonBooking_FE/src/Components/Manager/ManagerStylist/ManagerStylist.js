/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { React, useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { HiTrash } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import "./ManagerStylist.scss";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import loginUser from "../../../data/loginUser";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import uploadFile from "../../../utils/upload";
import { updateStylist } from "../../../actions/Update";
import Swal from "sweetalert2";
import { genders } from "../../../data/gender";
import { Skeleton } from "@mui/material";

export default function ManagerStylist({ buttonLabel }) {
  const [stylists, setStylists] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [salonLocations, setSalonLocations] = useState([]);
  const [levels, setLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [managerInfo, setManagerInfo] = useState([]);
  const [formData, setFormData] = useState({
    accountid: 0,
    fullname: "",
    email: "",
    username: "",
    phone: "",
    dob: "",
    gender: "",
    salonId: 0,
    skillId: [],
    levelId: 0,
    image: loginUser.avatar,
  });
  const [loading, setLoading] = useState(false);
  const [stylistsLoading, setStylistsLoading] = useState(true);
  const dispatch = useDispatch();
  const isUpdate = useSelector((state) => state.updateStylistReducer);
  const [selectedFileObject, setSelectedFileObject] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setSelectedFileObject(file);
    }
  };
  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        console.log(data);
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
    fetchData("levels", setLevels);
    fetchData("skills", setSkills);
  }, []);

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prevSelected) => {
      if (prevSelected.includes(skillId)) {
        return prevSelected.filter((id) => id !== skillId);
      } else {
        return [...prevSelected, skillId];
      }
    });
  };

  useEffect(() => {
    if (managerInfo.salonId !== undefined) {
      fetchStylistsData(currentPage);
    }
  }, [isUpdate, currentPage, managerInfo]);

  const fetchStylistsData = async (page) => {
    setStylistsLoading(true);
    try {
      const response = await api.get(
        `stylist/page/${managerInfo.salonId}?page=${page}&size=4`
      );
      const data = response.data.result.content;
      const total = response.data.result.totalPages;
      console.log(data);
      if (data) {
        setStylists(data);
        setTotalPages(total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStylistsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchStylistData = async (accountid) => {
    try {
      const response = await api.get(`stylist/read/${accountid}`);
      const data = response.data.result;

      if (data) {
        const foundSalon = salonLocations.find(
          (item) => item.address === data.salonAddress
        );
        const salonId = foundSalon ? foundSalon.id : null;

        const foundLevel = levels.find((item) => item.name === data.levelName);
        const levelId = foundLevel ? foundLevel.id : null;

        const foundSkills = skills.filter((skill) =>
          data.skillName.includes(skill.name)
        );
        const skillIds = foundSkills.map((skill) => skill.id);

        setFormData((prev) => ({
          ...prev,
          accountid: accountid,
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          username: data.username || "",
          dob: data.dob || "",
          gender: data.gender || "",
          salonId: salonId || 0,
          skillId: skillIds || [],
          levelId: levelId || 0,
          image: data.image || prev.image,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStylistData = async (accountid) => {
    try {
      const response = await api.delete(`stylist/${accountid}`);
      if (response.data) {
        Swal.fire({
          title: "Deleted!",
          text: "The stylist has been deleted.",
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
      confirmButtonText: "Yes, delete this stylist!",
    }).then(async (result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await deleteStylistData(accountid);
          fetchStylistsData();
        } catch (error) {}
      }
    });
  };

  const updateStylistData = async (e) => {
    e.preventDefault();
    const selectedSkillsId = selectedSkills.map(Number);
    const numberOfSkillId = skills.reduce((total, item) => {
      if (item) {
        total++;
      }
      return total;
    }, 0);
    const updateValues = {
      fullname: e.target[1].value,
      email: e.target[2].value,
      phone: e.target[3].value,
      dob: e.target[4].value,
      gender: e.target[5].value,
      skillId: selectedSkillsId,
      levelId: Number(e.target[5 + numberOfSkillId + 1].value),
      salonId: Number(e.target[5 + numberOfSkillId + 2].value),
      image: null,
    };

    if (selectedFileObject) {
      const firebaseResponse = await uploadFile(selectedFileObject);
      updateValues.image = firebaseResponse;
    } else {
      updateValues.image = formData.image;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `stylist/${formData.accountid}`,
        updateValues
      );
      const data = response.data.result;

      dispatch(updateStylist());
      toggleModal();

      if (data) {
        const foundSalon = salonLocations.find(
          (item) => item.address === data.salonAddress
        );
        const salonId = foundSalon ? foundSalon.id : null;

        const foundLevel = levels.find((item) => item.name === data.levelName);
        const levelId = foundLevel ? foundLevel.id : null;

        const foundSkill = skills.find(
          (item) => item.name === data[0].skillName
        );
        const skillId = foundSkill ? foundSkill.id : null;

        setFormData((prev) => ({
          ...prev,
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          levelId: levelId,
          salonId: salonId,
          skillId: skillId,
          image: selectedFile || prev.image,
        }));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (formData.accountid) {
        fetchStylistData(formData.accountid);
      }
      setSelectedSkills(formData.skillId);
    }
  }, [isModalOpen]);

  const toggleModal = async (accountid) => {
    if (accountid) {
      await fetchStylistData(accountid);
    }

    setSelectedSkills(formData.skillId);

    setIsModalOpen(!isModalOpen);
    console.log(isModalOpen);
    setSelectedFile(null);
  };

  const createStylist = () => {
    navigate("/manager/stylist/create");
  };

  const handleSubmit = (e) => {
    updateStylistData(e);
  };

  return (
    <>
      <div className="manager-stylist">
        <div className="manager-stylist__content">
          <div className="manager-stylist__header">
            <div className="manager-stylist__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />

              <input placeholder="Search here..." type="text" />
            </div>
            <div className="manager-stylist__header-filter">
              <button onClick={createStylist}> {buttonLabel}</button>
            </div>
          </div>
          <div className="container">
            {stylistsLoading
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
              : (stylists || []).map((stylist) => (
                  <div key={stylist.accountid} className="container__card">
                    <img
                      className="container__card--img"
                      alt="manager-stylist picture"
                      height="50"
                      src={stylist.image ? stylist.image : loginUser.avatar}
                      width="50"
                    />
                    <h3>{stylist.fullname}</h3>
                    <p>
                      User Name: <b>{stylist.username}</b>
                    </p>
                    <p>
                      Level: <b>{stylist.levelName}</b>
                    </p>
                    <div className="container__card-info">
                      <p>
                        <FaLocationDot />
                        {stylist.getAddress}
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
                ))}
          </div>
        </div>

        {stylists && stylists.length > 0 && (
          <div className="manager-stylist__pagination">
            <div className="manager-stylist__pagination-pages">
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

      {isModalOpen && (
        <>
          <div className="manager-stylist-backdrop" onClick={toggleModal}>
            <div
              className="manager-stylist-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="manager-stylist-modal__header">
                  Update Stylist
                </h2>
                <div className="manager-stylist-modal__avatar-section">
                  <div className="manager-stylist-modal__avatar">
                    <img
                      src={selectedFile || formData.image}
                      alt={formData.fullname}
                    />
                  </div>
                  <div className="manager-stylist-modal__avatar-info">
                    <h3 className="manager-stylist-modal__avatar-title">
                      Change Avatar
                    </h3>
                    <p className="manager-stylist-modal__avatar-description">
                      Recommended Dimensions: 120x120 Max file size: 5MB
                    </p>
                    <label className="manager-stylist-modal__upload-btn">
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
                <div className="manager-stylist-modal__form-section">
                  <div className="manager-stylist-modal__form-grid">
                    <div className="manager-stylist-modal__form-grid manager-stylist-modal__form-grid--half-width">
                      <div className="manager-stylist-modal__form-group">
                        <label
                          htmlFor="fullname"
                          className="manager-stylist-modal__label"
                        >
                          Full Name:
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          className="manager-stylist-modal__input"
                          placeholder="Full Name"
                          defaultValue={formData.fullname}
                        />
                      </div>
                      <div className="manager-stylist-modal__form-group">
                        <label
                          htmlFor="email"
                          className="manager-stylist-modal__label"
                        >
                          Email:
                        </label>
                        <input
                          type="text"
                          id="email"
                          className="manager-stylist-modal__input"
                          placeholder="Email"
                          defaultValue={formData.email}
                        />
                      </div>
                    </div>
                    <div
                      className="manager-stylist-modal__form-grid
              manager-stylist-modal__form-grid--half-width"
                    >
                      <div className="manager-stylist-modal__form-group">
                        <label
                          htmlFor="phone"
                          className="manager-stylist-modal__label"
                        >
                          Phone Number:
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className="manager-stylist-modal__input"
                          placeholder="Phone Number"
                          defaultValue={formData.phone}
                        />
                      </div>
                      <div className="manager-stylist-modal__form-grid manager-stylist-modal__form-grid--half-width">
                        <div className="manager-stylist-modal__form-group">
                          <label
                            htmlFor="dob"
                            className="manager-stylist-modal__label"
                          >
                            Date of Birth:
                          </label>
                          <input
                            type="date"
                            id="dob"
                            className="manager-stylist-modal__input"
                            placeholder="Date of Birth"
                            defaultValue={formData.dob}
                          />
                        </div>
                        <div className="manager-stylist-modal__form-group">
                          <label
                            htmlFor="gender"
                            className="manager-stylist-modal__label"
                          >
                            Gender:
                          </label>
                          <select
                            id="gender"
                            className="manager-stylist-modal__select"
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
                      className="manager-stylist-modal__form-grid
                manager-stylist-modal__form-grid--half-width"
                    >
                      <div className="manager-stylist-modal__form-group">
                        <label
                          htmlFor="skill"
                          className="manager-stylist-modal__label"
                        >
                          Select Skill:
                        </label>
                        <div className="manager-stylist-modal__skills-list">
                          {skills.map((skill) => (
                            <label
                              key={skill.id}
                              className="manager-stylist-modal__option"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSkills.includes(skill.id)}
                                onChange={() => handleSkillToggle(skill.id)}
                                className="manager-stylist-modal__checkbox"
                              />
                              <span>{skill.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="manager-stylist-modal__form-group">
                        <label
                          htmlFor="level"
                          className="manager-stylist-modal__label"
                        >
                          Select Level:
                        </label>
                        <select
                          id="level"
                          className="manager-stylist-modal__select"
                          defaultValue={formData.levelId ? formData.levelId : 0}
                        >
                          <option value={0} disabled>
                            Select level
                          </option>
                          {levels.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="manager-stylist-modal__form-group manager-stylist-modal__form-group--full-width">
                        <label
                          htmlFor="salon"
                          className="manager-stylist-modal__label"
                        >
                          Select Salon:
                        </label>
                        <select
                          id="salon"
                          className="manager-stylist-modal__select"
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
                <div className="manager-stylist-modal__button-container">
                  <button
                    type="submit"
                    className="manager-stylist-modal__button"
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
