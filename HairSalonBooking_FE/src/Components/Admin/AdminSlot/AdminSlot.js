/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./AdminSlot.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { Spin } from "antd";
import { Skeleton } from "@mui/material";
import Swal from "sweetalert2";

const AdminSlot = () => {
  const [slot, setSlot] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeBetween, setTimeBetween] = useState("");

  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);

  const fetchSlots = async () => {
    setSlotLoading(true);
    try {
      const response = await api.get("slot/time/between");
      const data = response.data.result;

      if (data) {
        setSlot(data);
        setTimeBetween(data.timeBetween);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSlotLoading(false);
    }
  };
  useEffect(() => {
    fetchSlots();
  }, []);

  const updateSlotData = async (e) => {
    e.preventDefault();
    const updateValues = {
      time: timeBetween,
    };
    setLoading(true);
    try {
      const response = await api.post(`slot`, updateValues);
      const data = response.data.result;
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Update Slot successfully.",
          timer: 2500,
        });
        fetchSlots();
        toggleModal();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  function formatTime(time) {
    const [hours, minutes] = time.split(":");
    return `${hours}h${minutes}`;
  }

  function formatDuration(time) {
    const [hours, minutes, seconds] = time.split(":").map(Number);

    let result = "";

    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    }

    if (result === "") {
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    return result.trim();
  }

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e) => {
    updateSlotData(e);
  };

  return (
    <>
      <div className="admin-slot">
        <div className="admin-slot__header">
          <div className="admin-slot__header-searchBar">
            <BiSearchAlt className="searchBar-icon" />
            {/* <i class="fas fa-search"></i> */}
            <input placeholder="Search here..." type="text" />
          </div>
        </div>
        <div className="admin-slot__container">
          <div className="admin-slot__content">
            <table className="admin-slot__table">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Headway</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {slotLoading ? (
                  <tr>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Skeleton variant="circular" width={43} height={43} />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="admin-slot__code">
                      {" "}
                      {slot.timeStart && formatTime(slot.timeStart)}
                    </td>
                    <td>
                      <div className="admin-slot__name">
                        {slot.timeEnd && formatTime(slot.timeEnd)}
                      </div>
                    </td>
                    <td className="admin-slot__date">
                      {slot.timeBetween && formatDuration(slot.timeBetween)}
                    </td>
                    <td className="admin-slot__actions">
                      <button
                        className="admin-slot__action-button"
                        onClick={() => toggleModal(slot.id)}
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="admin-slot-backdrop" onClick={toggleModal}>
            <div
              className="admin-slot-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <h2 className="admin-slot-modal__header">Update Slot</h2>
                <div className="admin-slot-modal__form-section">
                  <div className="admin-slot-modal__form-grid">
                    <div
                      className="admin-slot-modal__form-grid
              admin-slot-modal__form-grid--half-width"
                    >
                      <div className="admin-slot-modal__form-group">
                        <label
                          htmlFor="headway"
                          className="admin-slot-modal__label"
                        >
                          Headway:
                        </label>
                        <select
                          id="headway"
                          className="admin-slot-modal__input"
                          value={timeBetween}
                          onChange={(e) => {
                            setTimeBetween(e.target.value);
                          }}
                        >
                          <option value="" disabled>Select headway</option>
                          <option value="01:00:00">1 hour</option>
                          <option value="00:30:00">30 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-slot-modal__button-container">
                  <button
                    type="submit"
                    className="admin-slot-modal__button"
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

export default AdminSlot;
