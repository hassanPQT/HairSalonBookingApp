import React, { useState } from "react";
import "./AdminCreateBranch.scss";
import { Spin } from "antd";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminCreateBranch = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createBranchData = async (e) => {
    e.preventDefault();
    const createValues = {
      address: e.target[0].value,
      hotline: e.target[1].value,
    };
    console.log(createValues)
    setLoading(true);
    try {
      const response = await api.post(`salon`, createValues);
      const data = response.data.result;
      if (data) {
        await Swal.fire({
          title: "Created!",
          text: "The Branch has been created.",
          icon: "success",
          timer: 2500
        });
        navigate("/admin/branch");
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    createBranchData(e);
  };

  return (
    <>
      <div className="admin-create-branch__breadcrumb">
        <Link
          to="/admin/branch"
          className="admin-create-branch__breadcrumb-link"
        >
          Branch
        </Link>{" "}
        &gt;
        <span className="admin-create-branch__breadcrumb-current">
          New Branch
        </span>
      </div>
      <div className="admin-create-branch">
        <div className="admin-create-branch__container">
          <form onSubmit={handleSubmit}>
            <h2 className="admin-create-branch__header">New Branch</h2>
            <div className="admin-create-branch__form-section">
              <div className="admin-create-branch__form-grid">
                <div
                  className="admin-create-branch__form-grid
              admin-create-branch__form-grid--half-width"
                >
                   <div className="admin-create-branch__form-group">
                    <label
                      htmlFor="address"
                      className="admin-create-branch__label"
                    >
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="admin-create-branch__input"
                      placeholder="Address"
                    />
                  </div>
                  <div className="admin-create-branch__form-group">
                    <label
                      htmlFor="hotline"
                      className="admin-create-branch__label"
                    >
                      Hotline:
                    </label>
                    <input
                      type="text"
                      id="hotline"
                      className="admin-create-branch__input"
                      placeholder="Hotline"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-create-branch__button-container">
                <button
                  type="submit"
                  className="admin-create-branch__button"
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

export default AdminCreateBranch;
