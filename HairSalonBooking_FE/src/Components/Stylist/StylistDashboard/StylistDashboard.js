import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Calendar } from "antd";
import api from "../../../config/axios";
import dayjs from "dayjs";
import "./StylistDashboard.scss";

export default function StylistDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM"));
  const [stylistInfo, setStylistInfo] = useState(null);
  const [revenue, setRevenue] = useState({});
  const [feedback, setFeedback] = useState({});
  const [totalBooking, setTotalBooking] = useState(0);
  const CalendarDropdown = () => {
    const wrapperStyle = {
      width: 320,
      padding: "10px",
      backgroundColor: "#fff",
    };

    const onSelect = (value) => {
      const formattedDate = value.format("YYYY-MM");
      setSelectedDay(formattedDate);
    };

    return (
      <div style={wrapperStyle}>
        <Calendar
          fullscreen={false}
          onSelect={onSelect}
          value={dayjs(selectDay)}
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
    const fetchStylistData = async () => {
      try {
        const response = await api.get(`stylist/profile`);
        const data = response.data.result;
        if (data) {
          setStylistInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStylistData();
  }, []);

  useEffect(() => {
    if (stylistInfo) {
      const fetchRevenueData = async () => {
        try {
          const response = await api.get(
            `stylist/salaries/${stylistInfo.salonId}/${selectDay}/${stylistInfo.accountid}`
          );
          const data = response.data.result;
          setRevenue(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchRevenueData();
    }
  }, [selectDay, stylistInfo]);

  useEffect(() => {
    if (stylistInfo) {
      const fetchFeedbackData = async () => {
        try {
          const response = await api.get(
            `stylist/stylists/${stylistInfo.accountid}/feedBack/${selectDay}`
          );
          const data = response.data.result;
          console.log(data);
          setFeedback(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchFeedbackData();
    }
  }, [selectDay, stylistInfo]);

  useEffect(() => {
    if (stylistInfo) {
      const fetchTotalBooking = async () => {
        try {
          const response = await api.get(
            `stylist/stylists/${stylistInfo.accountid}/revenue/${selectDay}`
          );
          const data = response.data.result;
          console.log(data);
          setTotalBooking(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchTotalBooking();
    }
  }, [selectDay, stylistInfo]);

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  console.log(totalBooking);
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__calendar">
          <div className="dashboard__calendar-filter">
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
        <div className="dashboard__header">
          <div className="dashboard__header-card">
            <div className="icon-box green">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <div className="stat-number">
                {totalBooking.bookingQuantity || 0}
              </div>
              <div className="stat-label">Total Booking</div>
            </div>
          </div>

          <div className="dashboard__header-card">
            <div className="icon-box purple">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />

                <text
                  x="12"
                  y="16"
                  fontSize="10"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="100"
                  fontFamily="Arial"
                >
                  $
                </text>
              </svg>
            </div>
            <div>
              <div className="stat-number">
                {totalBooking.bonusPercent * 100 || 0} %
              </div>
              <div className="stat-label">Bonus Percent</div>
            </div>
          </div>
        </div>

        <div className="dashboard__container">
          <div className="dashboard__container-left">
            {stylistInfo && (
              <div className="profile-section">
                <img
                  className="profile-image"
                  src={stylistInfo.image}
                  alt={stylistInfo.fullname}
                />
                <div className="profile-name">{stylistInfo.fullname}</div>
                <div className="profile-title">{stylistInfo.email}</div>
                <div className="profile-title">
                  {dayjs(stylistInfo.dob).format("DD-MM-YYYY")}
                </div>
              </div>
            )}

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-value">
                  {formatCurrency(revenue.salary || 0)}
                </div>
                <div className="stat-text">Salary</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {formatCurrency(revenue.bonus || 0)}
                </div>
                <div className="stat-text">Bonus</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {formatCurrency(revenue.totalSalary || 0)}
                </div>
                <div className="stat-text">Total</div>
              </div>
            </div>
          </div>

          {/* <div className="dashboard__container-right">
            <div className="wfh-section">
              <div className="wfh-circle">
                <div className="wfh-icon"></div>
              </div>
              <div>70% of the employees are working from home today.</div>
            </div>

            <div className="chart-container">
              <div className="chart-item">
                <span className="chart-dot orange"></span>
                <span className="chart-label">User research</span>
                <span className="chart-value">20</span>
              </div>
              <div className="chart-item">
                <span className="chart-dot purple"></span>
                <span className="chart-label">Marketing</span>
                <span className="chart-value">12</span>
              </div>
              <div className="chart-item">
                <span className="chart-dot green"></span>
                <span className="chart-label">Product design</span>
                <span className="chart-value">8</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
