/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { BiSearchAlt } from "react-icons/bi";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Calendar, Spin, Select } from "antd";
import { Skeleton } from "@mui/material";
import { FolderOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "./ManagerShift.scss";

import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { updateShift } from "../../../actions/Update";

export default function ManagerShift() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);
  const navigate = useNavigate();
  const [salonId, setSalonId] = useState(0);
  const [stylistsData, setStylistsData] = useState();
  const [stylists, setStylists] = useState([]);
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));

  const [bookingLoading, setBookingLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    stylistName: "",
    stylistId: 0,
    workingDate: "",
    shiftId: [],
  });
  const [changedShifts, setChangedShifts] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState({});
  const CalendarDropdown = () => {
    const wrapperStyle = {
      width: 320,
      padding: "10px",
      backgroundColor: "#fff",
    };

    const onSelect = (value) => {
      const formattedDate = value.format("YYYY-MM-DD");
      setSelectedDay(formattedDate);
      // setStylists([]);
    };

    return (
      <div style={wrapperStyle}>
        <Calendar
          fullscreen={false}
          onSelect={onSelect}
          value={dayjs(selectDay)}
        />
      </div>
    );
  };

  const items = [
    {
      key: "1",
      label: <CalendarDropdown />,
    },
  ];

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        if (data) {
          setSalonId(data.salonId);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchManagerData();
  }, []);

  useEffect(() => {
    fetchStylistsData();
  }, []);
  const fetchStylistsData = async () => {
    try {
      const response = await api.get(`stylist/read`);
      // const data = response.data.result;
      // const response = await api.get(`stylist-salon`);
      const data = response.data.result;
      if (!data) return;
      if (data) {
        setStylistsData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShiftData();
  }, [selectDay, stylistsData]);

  const fetchBookingBusy = async () => {
    try {
      const response = await api.get(`manager/booking/stylist/busy`);
      const data = response.data.result;
      console.log(data);
      if (data.length > 0) {
        navigate("/manager/shift/update");
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const refreshData = () => {
    fetchShiftData();
  };

  const fetchShiftData = async () => {
    setBookingLoading(true);
    if (salonId) {
      try {
        const response = await api.get(
          `stylist/schedule/${selectDay}/${salonId}`
        );
        const data = response.data.result;
        if (data) {
          // tìm stylist id
          const enrichedData = data.map((shift) => {
            const stylist = stylistsData.find(
              (stylist) => stylist.fullname === shift.stylistName
            );

            return {
              ...shift,
              stylistId: stylist ? stylist.id : null,
              image: stylist ? stylist.image : null,
            };
          });
          if (JSON.stringify(stylists) !== JSON.stringify(enrichedData)) {
            setStylists(enrichedData);
            console.log(stylists);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setBookingLoading(false);
      }
    }
  };

  // lấy chi tiết 1 stylist
  const fetchStylistData = async (stylist) => {
    try {
      const response = await api.get(`stylist/schedule/${stylist.id}`);
      const data = response.data.result;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          id: data.id || 0,
          stylistName: data.stylistName || "",
          stylistId: data.stylistId || 0,
          workingDate: data.workingDate || "",
          shiftId: data.shiftId || [],
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStylistData = async (e) => {
    e.preventDefault();
    const updateValues = {
      stylistId: formData.stylistId,
      workingDate: formData.workingDate,
      shiftId: selectedShift,
    };
    setLoading(true);
    try {
      const response = await api.put(
        `stylist/schedule/${formData.id}`,
        updateValues
      );
      const data = response.data.result;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          id: data.id || 0,
          stylistName: data.stylistName || "",
          stylistId: data.stylistId || 0,
          workingDate: data.workingDate || "",
          shiftId: data.shiftId || [],
        }));
        dispatch(updateShift());
        setIsModalOpen(!isModalOpen);
        setChangedShifts([]);

        Swal.fire({
          title: "Updated!",
          text: "The booking has been update.",
          icon: "success",
          confirmButtonText: "OK",
        });
        await fetchBookingBusy();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const checkShift = (array, num) => {
    return array.some((item) => item === num);
  };

  const toggleModal = async (shiftId) => {
    if (shiftId) {
      await fetchStylistData(shiftId);
      setSelectedShift(shiftId.shiftId);
    }

    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e) => {
    await updateStylistData(e);
    refreshData();
  };

  const handleSkillToggle = (shift) => {
    setSelectedShift((prevSelected) => {
      const isShiftSelected = prevSelected.includes(shift);
      const newSelectedShift = isShiftSelected
        ? prevSelected.filter((id) => id !== shift)
        : [...prevSelected, shift];

      setChangedShifts((prevChanges) => {
        const isShiftChanged = prevChanges.includes(shift);

        if (
          !isShiftChanged &&
          formData.shiftId.includes(shift) !== newSelectedShift.includes(shift)
        ) {
          return [...prevChanges, shift];
        } else if (
          isShiftChanged &&
          formData.shiftId.includes(shift) === newSelectedShift.includes(shift)
        ) {
          return prevChanges.filter((id) => id !== shift);
        }
        return prevChanges;
      });

      return newSelectedShift;
    });
  };

  const updateBooking = () => {
    navigate("/manager/shift/update");
  };

  return (
    <>
      <div className="managerShift">
        <div className="managerShift__header">
          <div className="managerShift__header-searchBar"></div>

          <div className="managerShift__header-filter">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["hover"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {selectDay}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
            <div className="managerShift__header-btn">
              <button onClick={updateBooking}> Update Booking</button>
            </div>
          </div>
        </div>

        <div className="managerShift__content">
          <table className="managerShift__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Stylist</th>
                <th>Shift 1</th>
                <th>Shift 2</th>
                <th>Shift 3</th>
                <th>Action</th>
              </tr>
            </thead>
            {bookingLoading ? (
              [...Array(6)].map((_, index) => (
                <tbody>
                  <tr key={index}>
                    <td>
                      <Skeleton width={40} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={80} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Skeleton variant="circular" width={43} height={43} />
                        <Skeleton variant="circular" width={43} height={43} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))
            ) : stylists.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <div className="manager-create-shift__notValid">
                      <FolderOutlined className="notValid--icon" />
                      <p>Please Choose Another Date</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {(stylists || []).map((stylist, index) => (
                  <tr key={index}>
                    <td className="managerShift__id">{stylist.id}</td>
                    <td>
                      <div className="managerShift__stylist">
                        <img
                          src={stylist.image}
                          alt={stylist.stylistName}
                          className="manager-customer__customer-image"
                        />
                        <span className="managerShift__stylist-name">
                          {stylist.stylistName}
                        </span>
                      </div>
                    </td>
                    {[1, 2, 3].map((shift) => (
                      <td
                        key={shift}
                        className={`managerShift__status managerShift__status-${
                          checkShift(stylist.shiftId, shift)
                            ? "Scheduled"
                            : "Available"
                        }`}
                      >
                        {checkShift(stylist.shiftId, shift)
                          ? "Scheduled"
                          : "Available"}
                      </td>
                    ))}

                    <td className="managerShift__actions">
                      <button
                        onClick={() => {
                          toggleModal(stylist);
                          setSelectedStylist(stylist);
                        }}
                        className="managerShift__action-button"
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      {isModalOpen && (
        <>
          <div className="manager-stylist-backdrop" onClick={toggleModal}>
            <div
              className="manager-stylist-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <table className="managerShift__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Stylist</th>
                      <th>Shift 1</th>
                      <th>Shift 2</th>
                      <th>Shift 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="managerShift__id">{formData.stylistId}</td>
                      <td>
                        <div className="managerShift__stylist">
                          <span className="managerShift__stylist-name">
                            {formData.stylistName}
                          </span>
                        </div>
                      </td>
                      {[1, 2, 3].map((shift) => (
                        <td key={shift}>
                          <Select
                            onChange={() => handleSkillToggle(shift)}
                            labelInValue
                            defaultValue={{
                              value: checkShift(formData.shiftId, shift)
                                ? "Scheduled"
                                : "Available",
                              label: checkShift(formData.shiftId, shift)
                                ? "Scheduled"
                                : "Available",
                            }}
                            style={{
                              width: 120,
                            }}
                            // onChange={(e) => handleChange(e, shift)}
                            options={[
                              {
                                value: "Scheduled",
                                label: "Scheduled",
                              },
                              {
                                value: "Available",
                                label: "Available",
                              },
                            ]}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
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
