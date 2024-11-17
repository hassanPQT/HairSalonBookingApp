import { useEffect, useState } from "react";
import loginUser from "../../../data/loginUser";
import "./UserInfor.scss";
import api from "../../../config/axios";
import { FaEdit } from "react-icons/fa";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../actions/Update";
import uploadFile from "../../../utils/upload";
import Swal from "sweetalert2";

export default function UserInfor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    accountid: 0,
    fullname: "",
    email: "",
    dob: "",
    phone: "",
    avatarFile: loginUser.avatar,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isUpdate = useSelector((state) => state.updateUserReducer);
  const [selectedFileObject, setSelectedFileObject] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setSelectedFileObject(file);
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

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`customer/profile`);
      const data = response.data.result;

      if (data) {
        setFormData({
          accountid: data.accountid,
          fullname: data.fullname || "",
          email: data.email || "",
          dob: data.dob ? formatDateForInput(data.dob) : "",
          phone: data.phone || "",
          avatarFile: data.image || loginUser.avatar,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (e) => {
    e.preventDefault();
    const updateValues = {
      fullname: e.target[1].value,
      email: e.target[2].value,
      phone: e.target[3].value,
      dob: e.target[4].value,
      image: null,
    };
    if (selectedFileObject) {
      const firebaseResponse = await uploadFile(selectedFileObject);
      updateValues.image = firebaseResponse;
    } else {
      updateValues.image = formData.avatarFile;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `customer/${formData.accountid}`,
        updateValues
      );
      const data = response.data.result;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          fullname: data.fullname || "",
          email: data.email || "",
          dob: data.dob ? formatDateForInput(data.dob) : "",
          phone: data.phone || "",
          avatarFile: selectedFile || prev.avatarFile,
        }));
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User information updated successfully!",
          timer: 2500,
        });
        dispatch(updateUser());
        toggleModal();
      }
    } catch (err) {
      console.error(err);
       Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    updateUserData(e);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="main">
        <div className="profile">
          <div className="profile__left">
            <h1>Your Profile</h1>
            <img
              alt="User-Avatar"
              className="profile__left-pic"
              height="100"
              src={formData.avatarFile}
              width="100"
            />
          </div>
          <div className="profile__right">
            <div className="update-button">
              <button onClick={toggleModal}>
                <FaEdit />
              </button>
            </div>

            <div className="description">
              <div className="description__details">
                <span>Name </span>
                <p>{formData.fullname}</p>
              </div>
              <div className="description__details">
                <span>Phone </span>
                <p>{formData.phone}</p>
              </div>
              <div className="description__details">
                <span>Email </span>
                <p>{formData.email}</p>
              </div>
              <div className="description__details">
                <span>Birthday </span>
                <p>{formatDateString(formData.dob)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="profile-backdrop" onClick={toggleModal}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit}>
                <h2 className="profile-modal__header">Update Profile</h2>
                <div className="profile-modal__avatar-section">
                  <div className="profile-modal__avatar">
                    <img
                      src={selectedFile || formData.avatarFile}
                      alt={formData.fullname}
                    />
                  </div>
                  <div className="profile-modal__avatar-info">
                    <h3 className="profile-modal__avatar-title">
                      Change Avatar
                    </h3>
                    <p className="profile-modal__avatar-description">
                      Recommended Dimensions: 120x120 Max file size: 5MB
                    </p>
                    <label className="profile-modal__upload-btn">
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
                <div className="profile-modal__form-section">
                  <div className="profile-modal__form-grid">
                    <div className="profile-modal__form-group profile-modal__form-group--full-width">
                      <label
                        htmlFor="fullname"
                        className="profile-modal__label"
                      >
                        Full Name:
                      </label>
                      <input
                        type="text"
                        id="fullname"
                        className="profile-modal__input"
                        placeholder="Full Name"
                        defaultValue={formData.fullname}
                      />
                    </div>
                    <div className="profile-modal__form-group profile-modal__form-group--full-width">
                      <label htmlFor="email" className="profile-modal__label">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="profile-modal__input"
                        placeholder="Email"
                        defaultValue={formData.email}
                      />
                    </div>
                    <div className="profile-modal__form-group">
                      <label htmlFor="phone" className="profile-modal__label">
                        Phone:
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="profile-modal__input"
                        placeholder="Phone"
                        defaultValue={formData.phone}
                      />
                    </div>
                    <div className="profile-modal__form-group">
                      <label htmlFor="dob" className="profile-modal__label">
                        Date of Birth:
                      </label>
                      <input
                        type="date"
                        id="dob"
                        className="profile-modal__input"
                        placeholder="Date of Birth"
                        defaultValue={formData.dob}
                      />
                    </div>
                  </div>
                </div>
                <div className="profile-modal__button-container">
                  <button
                    type="submit"
                    className="profile-modal__button"
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
