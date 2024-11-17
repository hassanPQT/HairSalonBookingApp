import React, { useEffect, useState } from "react";
import "./AdminCreateService.scss";
import { Spin } from "antd";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../../utils/upload";
import { Editor } from "@tinymce/tinymce-react";
import service from "../../../data/service";
import UploadImage from "../AdminService/UploadImage";
import Swal from "sweetalert2";

const AdminCreateService = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFileObject, setSelectedFileObject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    image: service.image,
  });
  const navigate = useNavigate();
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

    fetchData("skills", setSkills);
  }, []);

  const createServiceData = async (e) => {
    e.preventDefault();
    const createValues = {
      serviceName: e.target[1].value,
      price: Number(e.target[2].value),
      duration: e.target[3].value,
      skillId: Number(e.target[4].value),
      description: e.target[9].value,
      image: null,
      collectionsImage: null,
    };

    if (selectedFileObject) {
      const firebaseResponse = await uploadFile(selectedFileObject);
      createValues.image = firebaseResponse;
    } else {
      createValues.image = formData.image;
    }

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

        createValues.collectionsImage = [
          ...existingImages,
          ...newFirebaseResponses.filter((url) => url),
        ];

        if (createValues.collectionsImage.length === 0) {
          createValues.collectionsImage = null;
        }
      } catch (error) {
        console.error("Error uploading collection images:", error);
        createValues.collectionsImage = collectionImageFiles
          .filter((file) => file.url)
          .map((file) => file.url);
      }
    } else {
      createValues.collectionsImage = formData.collectionsImage || null;
    }

    setLoading(true);
    try {
      const response = await api.post(`service`, createValues);
      const data = response.data.result;

      if (data) {
        await Swal.fire({
          title: "Created!",
          text: "The Service has been created.",
          icon: "success",
          timer: 2500
        });
        setFormData((prev) => ({
          ...prev,
          image: selectedFile || prev.image,
        }));
        navigate("/admin/service");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    createServiceData(e);
  };

  return (
    <>
      <div className="admin-create-service__breadcrumb">
        <Link
          to="/admin/service"
          className="admin-create-service__breadcrumb-link"
        >
          Service
        </Link>{" "}
        &gt;
        <span className="admin-create-service__breadcrumb-current">
          New Service
        </span>
      </div>
      <div className="admin-create-service">
        <div className="admin-create-service__container">
          <form onSubmit={handleSubmit}>
            <h2 className="admin-create-service__header">New Service</h2>
            <div className="admin-create-service__avatar-section">
              <div className="admin-create-service__avatar">
                <img
                  src={selectedFile || formData.image}
                  alt={formData.serviceName}
                />
              </div>
              <div className="admin-create-service__avatar-info">
                <h3 className="admin-create-service__avatar-title">
                  Change Image
                </h3>
                <p className="admin-create-service__avatar-description">
                  Recommended Dimensions: 120x120 Max file size: 5MB
                </p>
                <label className="admin-create-service__upload-btn">
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
            <div className="admin-create-service__form-section">
              <div className="admin-create-service__form-grid">
                <div className="admin-create-service__form-grid admin-create-service__form-grid--half-width">
                  <div className="admin-create-service__form-group">
                    <label
                      htmlFor="serviceName"
                      className="admin-create-service__label"
                    >
                      Service Name:
                    </label>
                    <input
                      type="text"
                      id="serviceName"
                      className="admin-create-service__input"
                      placeholder="Service Name"
                      required
                    />
                  </div>
                  <div className="admin-create-service__form-group">
                    <label
                      htmlFor="price"
                      className="admin-create-service__label"
                    >
                      Price:
                    </label>
                    <input
                      type="text"
                      id="price"
                      className="admin-create-service__input"
                      placeholder="Price"
                      required
                    />
                  </div>
                </div>
                <div
                  className="admin-create-service__form-grid
              admin-create-service__form-grid--half-width"
                >
                  <div className="admin-create-service__form-group">
                    <label
                      htmlFor="duration"
                      className="admin-create-service__label"
                    >
                      Duration:
                    </label>
                    <select
                      id="duration"
                      className="admin-create-service__select"
                      defaultValue=""
                      required
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
                  <div className="admin-create-service__form-group">
                    <label
                      htmlFor="skill"
                      className="admin-create-service__label"
                    >
                      Skill:
                    </label>
                    <select
                      id="skill"
                      className="admin-create-service__select"
                      defaultValue={0}
                      required
                    >
                      <option value={0} disabled>
                        Select Skill
                      </option>
                      {skills.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="admin-create-service__form-grid">
                  <div className="admin-create-service__form-group">
                    <label
                      htmlFor="collectionImage"
                      className="admin-create-service__label"
                    >
                      Collection Image:
                    </label>
                    <UploadImage
                      previewImage={formData.collectionsImage}
                      onChange={handleCollectionImagesChange}
                    />
                  </div>
                </div>
                <div className="admin-create-service__form-grid">
                  <div className="admin-create-service__form-group">
                    <label
                      htmlFor="description"
                      className="admin-create-service__label"
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
                            Promise.reject("See docs to implement AI Assistant")
                          ),
                      }}
                      initialValue=""
                    />
                  </div>
                </div>
              </div>

              <div className="admin-create-service__button-container">
                <button
                  type="submit"
                  className="admin-create-service__button"
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
