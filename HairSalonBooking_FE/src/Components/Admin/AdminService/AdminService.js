/* eslint-disable react-hooks/exhaustive-deps */
import "./AdminService.scss";
import { React, useEffect, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { HiTrash } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import { Badge, Spin } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import service from "../../../data/service";
import uploadFile from "../../../utils/upload";
import { useDispatch, useSelector } from "react-redux";
import { updateService } from "../../../actions/Update";
import { IoCloseCircle } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import UploadImage from "./UploadImage";
import { Skeleton } from "@mui/material";

export default function AdminService() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState(services);
  const createService = () => {
    navigate("/admin/service/create");
  };

  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: 0,
    serviceName: "",
    price: 0,
    description: "",
    duration: "",
    image: service.image,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileObject, setSelectedFileObject] = useState(null);
  const dispatch = useDispatch();
  const isUpdate = useSelector((state) => state.updateServiceReducer);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [collectionImageFiles, setCollectionImageFiles] = useState([]);

  const handleCollectionImagesChange = (newFileList) => {
    setCollectionImageFiles(newFileList);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setSelectedFileObject(file);
    }
  };

  const handleClick = () => {
    setSearchValue("");
    inputRef.current.focus();
  };

  const fetchServices = async (page) => {
    setServicesLoading(true);
    try {
      const response = await api.get(`service/page?page=${page}&size=4`);
      const data = response.data.result.content;
      const total = response.data.result.totalPages;

      if (data) {
        setServices(data);
        setSearchResults(data);
        setTotalPages(total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults(services);
      return;
    }

    const fetchServices = async () => {
      const value = {
        name: searchValue,
      };
      try {
        const response = await api.post(`service/searchByName`, value);
        const data = response.data.result;
        if (data) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [searchValue]);

  useEffect(() => {
    fetchServices(currentPage);
  }, [isUpdate, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":").map(Number);

    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}`;
    } else if (hours === 1) {
      return `${hours} hour`;
    }else if (hours > 1) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const deleteServiceData = async (serviceId) => {
    try {
      const response = await api.delete(`service/delete/${serviceId}`);
      if (response.data) {
        Swal.fire({
          title: "Deleted!",
          text: "The service has been deleted.",
          icon: "success",
        });
        fetchServices(currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteModal = (serviceId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete this service!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteServiceData(serviceId);
        } catch (error) {}
      }
    });
  };

  const activeServiceData = async (serviceId) => {
    try {
      const response = await api.put(`service/active/${serviceId}`);
      if (response.data) {
        Swal.fire({
          title: "Active!",
          text: "The service has been active again.",
          icon: "success",
        });
        fetchServices(currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmActiveModal = (serviceId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to active this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, active this service!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await activeServiceData(serviceId);
          fetchServices();
        } catch (error) {}
      }
    });
  };

  const updateServiceData = async (e) => {
    e.preventDefault();
    const updateValues = {
      serviceName: e.target[1].value,
      price: Number(e.target[2].value),
      duration: e.target[3].value,
      description: e.target[9].value,
      image: null,
      collectionsImage: null,
    };


    if (collectionImageFiles.length > 0) {
      try {
        const existingImages = collectionImageFiles
          .filter((file) => file.url)
          .map((file) => file.url);
        const newFiles = collectionImageFiles.filter((file) => !file.url);

        const uploadPromises = newFiles.map((file) =>
          uploadFile(file.originFileObj)
        );
        const newFirebaseResponses = await Promise.all(uploadPromises);

        updateValues.collectionsImage = [
          ...existingImages,
          ...newFirebaseResponses.filter((url) => url),
        ];

        if (updateValues.collectionsImage.length === 0) {
          updateValues.collectionsImage = null;
        }
      } catch (error) {
        console.error("Error uploading collection images:", error);
        updateValues.collectionsImage = collectionImageFiles
          .filter((file) => file.url)
          .map((file) => file.url);
      }
    } else {
      updateValues.collectionsImage = formData.collectionsImage || null;
    }

    if (selectedFileObject) {
      const firebaseResponse = await uploadFile(selectedFileObject);
      updateValues.image = firebaseResponse;
    } else {
      updateValues.image = formData.image;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `service/update/${formData.serviceId}`,
        updateValues
      );
      const data = response.data;   
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Update Service successfully.",
          timer: 2500,
        });
        setFormData((prev) => ({
          ...prev,
          serviceName: data.id,
          price: data.price,
          description: data.description,
          duration: data.duration,
          image: selectedFileObject || prev.image,
        }));
        dispatch(updateService());
        toggleModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceData = async (serviceId) => {
    try {
      const response = await api.get(`service/${serviceId}`);
      const data = response.data.result;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          serviceId: serviceId,
          serviceName: data.serviceName,
          price: data.price,
          description: data.description,
          duration: data.duration,
          image: data.image,
          collectionsImage: data.collectionsImage,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (formData.serviceId) {
        fetchServiceData(formData.serviceId);
      }
    }
  }, [isModalOpen]);

  const toggleModal = async (serviceId) => {
    if (serviceId) {
      await fetchServiceData(serviceId);
    }
    setIsModalOpen(!isModalOpen);
    setSelectedFile(null);
  };

  const handleSubmit = (e) => {
    updateServiceData(e);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <div className="admin-service">
        <div className="admin-service__content">
          <div className="admin-service__header">
            <div className="admin-service__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />
              <input
                ref={inputRef}
                placeholder="Search here..."
                type="text"
                value={searchValue}
                onChange={handleChange}
              />
              {searchValue && (
                <IoCloseCircle className="close-icon" onClick={handleClick} />
              )}
            </div>
            <div className="admin-service__header-filter">
              <button onClick={createService}>New Service</button>
            </div>
          </div>
          <div className="service">
            {servicesLoading
              ? [...Array(4)].map((_, index) => (
                  <div key={index} className="service__card">
                    <div className="service__card-content">
                      <Skeleton
                        variant="rectangular"
                        width={180}
                        height={180}
                        style={{ borderRadius: "15px" }}
                      />
                      <div className="content-info">
                        <Skeleton variant="text" width={150} />
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={200} />
                      </div>
                    </div>
                    <div className="service-actions">
                      <Skeleton
                        className="btn"
                        variant="rectangular"
                        width={80}
                        height={40}
                      />
                      <Skeleton
                        className="btn"
                        variant="rectangular"
                        width={80}
                        height={40}
                      />
                    </div>
                  </div>
                ))
              : searchResults &&
                searchResults.map((service, index) => (
                  <div key={index} className="service__card">
                    <Badge.Ribbon
                      style={{ top: "-20px", right: "-25px" }}
                      text={service.delete ? "Un Active" : "Active"}
                      color={service.delete ? "gray" : "#0A7042"}
                    >
                      <div className="service__card-content">
                        <img alt="Service Img" src={service.image} />

                        <div className="content-info">
                          <h3>{service.serviceName}</h3>
                          <p>Price: {formatCurrency(service.price)}</p>
                          <p>Duration: {formatDuration(service.duration)}</p>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                service.description || ""
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </Badge.Ribbon>
                    <div className="service-actions">
                      {service.delete ? (
                        <button
                          className="active btn"
                          onClick={() => confirmActiveModal(service.id)}
                        >
                          <MdRestartAlt />
                        </button>
                      ) : (
                        <button
                          className="delete btn"
                          onClick={() => confirmDeleteModal(service.id)}
                        >
                          <HiTrash />
                        </button>
                      )}
                      <button
                        className="update btn"
                        onClick={() => toggleModal(service.id)}
                      >
                        <FaUserEdit />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {searchResults && searchResults.length > 0 && (
          <div className="admin-service__pagination">
            <div className="admin-service__pagination-pages">
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
          <div className="admin-service-backdrop" onClick={toggleModal}>
            <div
              className="admin-service-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="admin-service-modal__header">Update Service</h2>
                <div className="admin-service-modal__avatar-section">
                  <div className="admin-service-modal__avatar">
                    <img
                      src={selectedFile || formData.image}
                      alt={formData.fullname}
                    />
                  </div>
                  <div className="admin-service-modal__avatar-info">
                    <h3 className="admin-service-modal__avatar-title">
                      Change Image
                    </h3>
                    <p className="admin-service-modal__avatar-description">
                      Recommended Dimensions: 120x120 Max file size: 5MB
                    </p>
                    <label className="admin-service-modal__upload-btn">
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
                <div className="admin-service-modal__form-section">
                  <div className="admin-service-modal__form-grid">
                    <div className="admin-service-modal__form-grid admin-service-modal__form-grid--half-width">
                      <div className="admin-service-modal__form-group">
                        <label
                          htmlFor="serviceName"
                          className="admin-service-modal__label"
                        >
                          Service Name:
                        </label>
                        <input
                          type="text"
                          id="serviceName"
                          className="admin-service-modal__input"
                          placeholder="Service Name"
                          defaultValue={formData.serviceName}
                        />
                      </div>
                      <div className="admin-service-modal__form-group">
                        <label
                          htmlFor="price"
                          className="admin-service-modal__label"
                        >
                          Price:
                        </label>
                        <input
                          type="text"
                          id="price"
                          className="admin-service-modal__input"
                          placeholder="Price"
                          defaultValue={formData.price}
                        />
                      </div>
                    </div>
                    <div
                      className="admin-service-modal__form-grid
              admin-service-modal__form-grid--half-width"
                    >
                      <div className="admin-service-modal__form-group">
                        <label
                          htmlFor="duration"
                          className="admin-service-modal__label"
                        >
                          Duration:
                        </label>
                        <select
                      id="duration"
                      className="admin-create-service__select"
                      defaultValue={formData.duration}
                    >
                      <option value="" disabled>
                        Select Duration
                      </option>
                      <option value="00:30:00">30 minutes</option>
                      <option value="01:00:00">1 hour</option>
                      <option value="01:30:00">
                        1h30
                      </option>
                      <option value="02:00:00">2 hours</option>
                    </select>
                      </div>
                    </div>
                    <div
                      className="admin-service-modal__form-grid
              admin-service-modal__form-grid--full-width"
                    >
                      <div className="admin-service-modal__form-group">
                        <label
                          htmlFor="collectionImage"
                          className="admin-service-modal__label"
                        >
                          Collection Image:
                        </label>
                        <UploadImage
                          previewImage={formData.collectionsImage}
                          onChange={handleCollectionImagesChange}
                        />
                      </div>
                    </div>
                    <div className="admin-service-modal__form-grid">
                      <div className="admin-service-modal__form-group">
                        <label
                          htmlFor="description"
                          className="admin-service-modal__label"
                        >
                          Description:
                        </label>
                        <Editor
                          apiKey="t74owshbz6ridhxdhye1b1neth7xaxl46s6o9waysk4n48k6"
                          init={{
                            plugins: [
                              "anchor",
                              "autolink",
                              "charmap",
                              "codesample",
                              "emoticons",
                              "image",
                              "link",
                              "lists",
                              "media",
                              "searchreplace",
                              "table",
                              "visualblocks",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                            tinycomments_mode: "embedded",
                            tinycomments_author: "Author name",
                            mergetags_list: [
                              { value: "First.Name", title: "First Name" },
                              { value: "Email", title: "Email" },
                            ],
                            ai_request: (request, respondWith) =>
                              respondWith.string(() =>
                                Promise.reject(
                                  "See docs to implement AI Assistant"
                                )
                              ),
                          }}
                          initialValue={formData.description}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-service-modal__button-container">
                  <button
                    type="submit"
                    className="admin-service-modal__button"
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
