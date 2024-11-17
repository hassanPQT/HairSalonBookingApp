/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./AdminBranch.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Swal from "sweetalert2";
import { Skeleton } from "@mui/material";
import { FolderOutlined } from "@ant-design/icons";

const AdminBranch = ({ buttonLabel }) => {
  const [branchs, setBranchs] = useState([]);
  const [originalBranchs, setOriginalBranchs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: 0,
    address: "",
    hotline: "",
  });

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  const fetchBranchs = async () => {
    setBranchLoading(true);
    try {
      const response = await api.get("salons");
      const data = response.data.result;
      console.log(data)
      if (data) {
        setBranchs(data);
        setOriginalBranchs(data);
      }
    } catch (error) {
      console.log(error)
    }finally{
      setBranchLoading(false);
    }
  };


  useEffect(() => {
    fetchBranchs();
  }, []);

  const fetchBranchData = async (address) => {
    try {
      const response = await api.get(`salon/${address}`);
      const data = response.data.result;
      if (data) {
        setFormData((prev) => ({
          ...prev,
          id: data.salonId,
          address: data.address || "",
          hotline: data.hotline || "",
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };


  const updateBranchData = async (e) => {
    e.preventDefault();
    const updateValues = {
      address: e.target[0].value,
      hotline: e.target[1].value
    };
    console.log(formData.id)
    setLoading(true);
    try {
      const response = await api.put(
        `salon/${formData.id}`,
        updateValues
      );
      const data = response.data.result;
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Update Branch successfully.",
          timer: 2500,
        });
        fetchBranchs();
        toggleModal();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  const sortBy = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    let sortedSlots;

    if (direction === null) {
      sortedSlots = [...originalBranchs];
    } else {
      sortedSlots = [...branchs].sort((a, b) => {
        if (key === "discountAmount") {
          return direction === "ascending"
            ? parseFloat(a[key]) - parseFloat(b[key])
            : parseFloat(b[key]) - parseFloat(a[key]);
        }
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setBranchs(sortedSlots);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") return " ▲";
      if (sortConfig.direction === "descending") return " ▼";
    }
    return "";
  };

  const createBranch = () => {
    navigate("/admin/branch/create");
  };

  const toggleModal = async (address) => {
    if (address) {
      await fetchBranchData(address);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e) => {
      updateBranchData(e)
  };

  const deleteBranchData = async (id) => {
    try {
      const response = await api.delete(`salon/${id}`);
      if (response.data) {
        Swal.fire({
          title: "Deleted!",
          text: "The branch has been deleted.",
          icon: "success",
          timer: 2500
        });
        fetchBranchs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteModal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete this branch!",
    }).then(async (result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await deleteBranchData(id);
          fetchBranchs();
        } catch (error) {}
      }
    });
  };

  return (
    <>
      <div className="admin-branch">
        <div className="admin-branch__header">
          <div className="admin-branch__header-searchBar">
            <BiSearchAlt className="searchBar-icon" />
            {/* <i class="fas fa-search"></i> */}
            <input placeholder="Search here..." type="text" />
          </div>
          <div className="admin-branch__header-filter">
            <button onClick={createBranch}> {buttonLabel}</button>
          </div>
        </div>
        <div className="admin-branch__container">
          <div className="admin-branch__content">
            <table className="admin-branch__table">
              <thead>
                <tr>
                  <th onClick={() => sortBy("id")}>
                    ID{getSortIndicator("id")}
                  </th>
                  <th onClick={() => sortBy("address")}>
                    Adress{getSortIndicator("address")}
                  </th>
                  <th>
                    Hotline
                  </th>
                  <th>
                    Status
                  </th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
              {branchLoading
                  ? [...Array(6)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <Skeleton width={40} />
                        </td>
                        <td>
                          <Skeleton width={380} />
                        </td>
                        <td>
                          <Skeleton width={120} />
                        </td>
                        <td>
                          <Skeleton width={80} />
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Skeleton
                              variant="circular"
                              width={43}
                              height={43}
                            />
                             <Skeleton
                              variant="circular"
                              width={43}
                              height={43}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  : branchs.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="admin-branch__notValid">
                          <FolderOutlined className="notValid--icon" />
                          <p>Currently, there are no branchs</p>
                        </div>
                      </td>
                    </tr>
                  ) :
                (branchs && branchs.map((branch) => (
                  <tr key={branch.id}>
                    <td className="admin-branch__id">{branch.id}</td>
                    <td>
                      <div className="admin-branch__name">{branch.address}</div>
                    </td> 
                    <td>
                      <div className="admin-branch__date">{branch.hotline}</div>
                    </td> 
                    <td>
                      <div className="admin-branch__date">{branch.delete ? "Un Active" : "Active"}</div>
                    </td> 
                    <td className="admin-branch__actions">
                      <button
                        className="admin-branch__action-button"
                        onClick={() => toggleModal(branch.address)}
                      >
                        ✎
                      </button>
                      <button
                        className="admin-branch__action-button"
                        onClick={() => confirmDeleteModal(branch.id)}
                      >
                         🗑
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="admin-branch-backdrop" onClick={toggleModal}>
            <div
              className="admin-branch-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="admin-branch-modal__header">Update Slot</h2>
                <div className="admin-branch-modal__form-section">
                  <div className="admin-branch-modal__form-grid">
                    <div className="admin-branch-modal__form-grid admin-branch-modal__form-grid--half-width">
                      <div className="admin-branch-modal__form-group">
                        <label
                          htmlFor="address"
                          className="admin-branch-modal__label"
                        >
                          Address:
                        </label>
                        <input
                          type="text"
                          id="address"
                          className="admin-branch-modal__input"
                          placeholder="Address"
                          defaultValue={formData.address}
                        />
                      </div>      
                      <div className="admin-branch-modal__form-group">
                        <label
                          htmlFor="hotline"
                          className="admin-branch-modal__label"
                        >
                          Hotline:
                        </label>
                        <input
                          type="text"
                          id="hotline"
                          className="admin-branch-modal__input"
                          placeholder="Hotline"
                          defaultValue={formData.hotline}
                        />
                      </div>                
                    </div>
                  </div>
                </div>
                <div className="admin-branch-modal__button-container">
                  <button
                    type="submit"
                    className="admin-branch-modal__button"
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
};

export default AdminBranch;
