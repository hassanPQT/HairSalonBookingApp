/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { BiDetail } from "react-icons/bi";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Calendar, theme, Spin } from "antd";
import api from "../../../config/axios";
import "./ManagerCalculateSalary.scss";
import Swal from "sweetalert2";
import { Skeleton } from "@mui/material";

export default function ManagerCalculateSalary() {
  const [salaries, setSalaries] = useState([]);
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM"));
  const [manager, setManager] = useState({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    stylistId: 0,
    stylistName: "",
    bookingQuantity: 0,
    totalRevenue: 0,
    bonusPercent: 0,
  });

  const formatPrice = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const CalendarDropdown = () => {
    const { token } = theme.useToken();
    const wrapperStyle = {
      width: 330,
      borderRadius: token.borderRadiusLG,
      padding: "10px",
      backgroundColor: "#fff",
    };

    const onSelect = (value) => {
      const formattedDate = value.format("YYYY-MM");
      setSelectedDay(formattedDate);
    };

    const disabledDate = (current) => current && current < dayjs().startOf("day");

    return (
      <div style={wrapperStyle}>
        <Calendar
          fullscreen={false}
          onSelect={onSelect}
          value={dayjs(selectDay)}
          disabledDate={disabledDate}
          mode="year"
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
          setManager(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchManagerData();
  }, []);

  useEffect(() => {
    setBookingLoading(true);
    if (manager.salonId) {
      const fetchSalaries = async () => {
        try {
          const response = await api.get(`stylist/salaries/${manager.salonId}/${selectDay}`);
          const data = response.data.result;
          if (data) {
            setSalaries(data);
          }
        } catch (error) {
          console.log(error);
        }finally{
          setBookingLoading(false);
        }
      };

      fetchSalaries();
    }
  }, [manager, selectDay]);

  const calculateSalary = async () => {
    const salaryRecords = salaries.map(salary => ({
      bonusSalary: parseInt(salary.bonus || 0, 10),
      monthAndYear: selectDay,
      totalSalary: parseInt(salary.totalSalary || 0, 10),
      stylistId: salary.stylistId,
    }));

    try {
      setLoading(true);
      const response = await api.post("stylist/salaryRecords/save", salaryRecords);
      const data = response.data.result;
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Calculate salary successfully",
          showCloseButton: true,
          confirmButtonText: "OK",
          willClose: () => {
            navigate("/manager/salary");
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/manager/salary");
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (accountId) => {
    try {
      const response = await api.get(`stylist/stylists/${accountId}/revenue/${selectDay}`);
      const data = response.data.result;
      if (data) {
        setFormData((prev) => ({
          ...prev,
          stylistId: data.stylistId,
          stylistName: data.stylistName,
          bookingQuantity: data.bookingQuantity,
          totalRevenue: data.totalRevenue,
          bonusPercent: data.bonusPercent,
        }));
      }
    } catch (error) {
      
    }
  }

  const formatToPercentage = (value) => {
    if (typeof value !== 'number') {
      throw new Error('Input must be a number');
    }
  
    const percentage = value * 100;
  
    if (percentage >= 10000) {
      return percentage.toFixed(2) + '%';
    } else {
      return Math.round(percentage) + '%';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateSalary();
  };


  const toggleModal = async (accountId) => {
    if (accountId) {
      await fetchDetail(accountId);
    }
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="manager-calculate-salary__breadcrumb">
        <Link to="/manager/salary" className="manager-calculate-salary__breadcrumb-link">Salary</Link>
        &gt;
        <span className="manager-calculate-salary__breadcrumb-current">Calculate Salary</span>
      </div>

      <div className="manager-calculate-salary">
        <form onSubmit={handleSubmit}>
          <div className="manager-calculate-salary__header">
            <div className="manager-calculate-salary__header-searchBar">
            </div>
            <div className="manager-calculate-salary__header-filter">
              <Dropdown menu={{ items }} trigger={["hover"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {selectDay}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>

          <div className="manager-calculate-salary__content">
            <table className="manager-calculate-salary__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stylist</th>
                  <th>Base Salary</th>
                  <th>Bonus</th>
                  <th>Total Salary</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
              {bookingLoading ? (
                  Array.from(new Array(5)).map((_, index) => ( 
                    <tr key={index}>
                      <td><Skeleton variant="text" width="40px" /></td>
                      <td><Skeleton variant="text" width="120px" /></td>
                      <td><Skeleton variant="text" width="80px" /></td>
                      <td><Skeleton variant="text" width="80px" /></td>
                      <td><Skeleton variant="text" width="80px" /></td>
                      <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Skeleton
                              variant="circular"
                              width={43}
                              height={43}
                            />
                          </div>
                        </td>
                    </tr>
                  ))
                ) :
                ((salaries || []).map((salary, index) => (
                  <tr key={index}>
                    <td className="manager-calculate-salary__id">{salary.stylistId}</td>
                    <td>
                      <span className="manager-calculate-salary__stylist-name">{salary.stylistName}</span>
                    </td>
                    <td>
                      <input
                        className="manager-calculate-salary__input"
                        type="text"
                        defaultValue={salary.salary && formatPrice(salary.salary)}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        className="manager-calculate-salary__input"
                        type="text"
                        defaultValue={salary.bonus && formatPrice(salary.bonus)}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        className="manager-calculate-salary__input"
                        defaultValue={salary.totalSalary && formatPrice(salary.totalSalary)}
                        disabled
                      />
                    </td>
                    <td className="manager-calculate-salary__actions">
                      <button
                        className="manager-calculate-salary__action-button"
                        onClick={() => toggleModal(salary.stylistId)}
                        type="button"
                      >
                        <BiDetail />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
            <div className="manager-calculate-salary__button-container">
              <button
                type="submit"
                className="manager-calculate-salary__button"
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <>
          <div
            className="manager-calculate-salary-backdrop"
            onClick={toggleModal}
          >
            <div
              className="manager-calculate-salary-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form>
                <h2 className="manager-calculate-salary-modal__header">
                  Detail
                </h2>
                <div className="manager-calculate-salary-modal__form-section">
                  <div className="manager-calculate-salary-modal__form-grid">
                  <div
                      className="manager-calculate-salary-modal__form-grid
                  manager-calculate-salary-modal__form-grid--full-width"
                    >
                     <div className="manager-calculate-salary-modal__form-group">
                        <label
                          htmlFor="stylistName"
                          className="manager-calculate-salary-modal__label"
                        >
                          Stylist Name:
                        </label>
                        <input
                          type="text"
                          id="stylistName"
                          className="manager-calculate-salary-modal__input"
                          defaultValue={formData.stylistName}
                          placeholder="Stylist Name"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="manager-calculate-salary-modal__form-grid manager-calculate-salary-modal__form-grid--half-width">
                      <div className="manager-calculate-salary-modal__form-group">
                        <label
                          htmlFor="bookingQuantity"
                          className="manager-calculate-salary-modal__label"
                        >
                          Booking Quantity:
                        </label>
                        <input
                          type="text"
                          id="bookingQuantity"
                          className="manager-calculate-salary-modal__input"
                          placeholder="Booking Quantity"
                          defaultValue={formData.bookingQuantity}
                          disabled
                        />
                      </div>
                      <div className="manager-calculate-salary-modal__form-group">
                        <label
                          htmlFor="bonusPercent"
                          className="manager-calculate-salary-modal__label"
                        >
                          Bonus Percent:
                        </label>
                        <input
                          type="text"
                          id="bonusPercent"
                          className="manager-calculate-salary-modal__input"
                          placeholder="Bonus Percent"
                          defaultValue={formData.bonusPercent && formatToPercentage(formData.bonusPercent)}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="manager-calculate-salary-modal__form-grid
                  manager-calculate-salary-modal__form-grid--full-width">
                     <div className="manager-calculate-salary-modal__form-group">
                    <div className="manager-calculate-salary-modal__total-price">
                      <h3>
                        Total Revenue: {formData.totalRevenue && formatPrice(formData.totalRevenue)} VND
                      </h3>
                    </div>
                    </div>
                  </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
