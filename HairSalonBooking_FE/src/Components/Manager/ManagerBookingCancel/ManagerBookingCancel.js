/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./ManagerBookingCancel.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { DownOutlined, FolderOutlined } from "@ant-design/icons";
import { BiDetail } from "react-icons/bi";  
import { Calendar, Dropdown, Space } from "antd";
import dayjs from "dayjs";

const ManagerBookingCancel = () => {
  const [bookings, setBookings] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salonLocations, setSalonLocations] = useState([]);
  const [allStylist, setAllStylists] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [bookingLoading, setBookingLoading] = useState(false);

  const [slots, setSlots] = useState([]);

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    bookingId: 0,
    customerId: 0,
    voucherId: 0,
    slotId: 0,
    bookingDate: "",
    stylistId: 0,
    serviceId: [],
    salonId: 0,
    time: "",
    serviceName: [],
  });
  const [manager, setManager] = useState([]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const handleDateChange = (event) => {
    setFormData((prev) => ({ ...prev, date: event.target.value }));
  };

  const handleTimeChange = (event) => {
    setFormData((prev) => ({ ...prev, time: event.target.value }));
  };

  useEffect(() => {
    if (formData.serviceId) {
      setSelectedServices(formData.serviceId);
    }
  }, [formData.serviceId]);
  
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
  
      fetchData("salons", setSalonLocations);
      fetchData("vouchers", setVouchers);
      fetchData("service", setServices);
      fetchData("stylist/read", setAllStylists);
      fetchData("slot/read", setSlots);
    }, []);

  
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
      setBookingLoading(true)
      if (manager.salonId !== undefined) {
      const fetchBookings = async (page) => {
        try {
          const response = await api.get(
            `manager/stylists/booking/cancel/${page}/7/${manager.salonId}/${selectedDate}`
          );
         
          const data = response.data.result.content;
          const total = response.data.result.totalPages;
          if (data) {
            setBookings(data);
            setOriginalBookings(data);
            setTotalPages(total);
          }
        } catch (error) {
          console.log(error);
        }finally{
          setBookingLoading(false);
        }
      };
  
      fetchBookings(currentPage);
       }
       
    }, [ manager, selectedDate, currentPage]);
  
    const fetchBookingData = async (bookingId) => {
      try {
        const response = await api.get(`booking/${bookingId}`);
        const data = response.data.result;
        console.log(data);
        if (data) {
          const foundSalon = salonLocations.find(
            (item) => item.address === data.salonName
          );
          const salonId = foundSalon ? foundSalon.id : null;
  
          const foundVoucher = vouchers.find(
            (item) => item.code === data.voucherCode
          );
          const voucherId = foundVoucher ? foundVoucher.id : null;
  
          const foundStylist = allStylist.find(
            (item) => item.fullname === data.stylistName
          );
          const stylistId = foundStylist ? foundStylist.accountid : null;
  
          setFormData((prev) => ({
            ...prev,
            bookingId: bookingId,
            customerId: data.customerId,
            voucherId: Number(voucherId),
            bookingDate: data.date,
            stylistId: stylistId,
            serviceId: data.serviceId,
            salonId: Number(salonId),
            customerName: data.customerName,
            stylistName: data.stylistName,
            date: data.date,
            time: data.time,salonName: data.salonName,
            voucherCode: data.voucherCode,
            serviceName: data.serviceName,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      if (isModalOpen) {
        if (formData.bookingId) {
          fetchBookingData(formData.bookingId);
        }
      }
    }, [isModalOpen]);
  
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
  
      let sortedBookings;
  
      if (direction === null) {
        sortedBookings = [...originalBookings];
      } else {
        sortedBookings = [...bookings].sort((a, b) => {
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
  
      setBookings(sortedBookings);
    };
  
    const getSortIndicator = (key) => {
      if (sortConfig.key === key) {
        if (sortConfig.direction === "ascending") return " ▲";if (sortConfig.direction === "descending") return " ▼";
      }
      return "";
    };
  
    const toggleModal = async (id) => {
      if (id) {
        await fetchBookingData(id);
      }
      setIsModalOpen(!isModalOpen);
    };
  
    const formatDate = (dateInput) => {
      const date = new Date(dateInput);
      if (isNaN(date)) return "";
      const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${dayOfWeek} (${day}/${month}/${year})`;
    };
  
    const formatTime = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return `${hours.toString().padStart(2, "0")}h${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    const handlePageChange = (page) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    };

    const formatDateForDisplay = (dateString) => {
      return dayjs(dateString).format("DD/MM/YYYY");
    };

    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    const CalendarDropdown = () => {
      const wrapperStyle = {
        width: 320,
        padding: "10px",
        backgroundColor: "#fff",
      };
  
      const onSelect = (value) => {
        const formattedDate = value.format("YYYY-MM-DD");
        setSelectedDate(formattedDate);
      };
  
      return (
        <div style={wrapperStyle} onClick={stopPropagation}>
          <Calendar
            fullscreen={false}
            onSelect={onSelect}
            value={dayjs(selectedDate)}
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
  
  
    return (
      <>
        <div className="manager-booking-cancel">
          <div className="manager-booking-cancel__header">
            <div className="manager-booking-cancel__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />
              {/* <i class="fas fa-search"></i> */}
              <input placeholder="Search here..." type="text" />
            </div>
            <div className="manager-booking-cancel__header-filter">
            <Dropdown
            className="manager-booking-cancel__header-filter--select"
              menu={{
                items,
              }}
              trigger={["hover"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {formatDateForDisplay(selectedDate)}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>

            </div>
          </div>
          <div className="manager-booking-cancel__container">
            <div className="manager-booking-cancel__content">
              <table className="manager-booking-cancel__table">
                <thead>
                  <tr>
                  <th onClick={() => sortBy("id")}>
                    ID{getSortIndicator("id")}
                  </th>
                  <th onClick={() => sortBy("customerName")}>
                    Customer Name{getSortIndicator("customerName")}
                  </th>
                  <th onClick={() => sortBy("phone")}>
                    Phone{getSortIndicator("phone")}
                  </th>
                  <th onClick={() => sortBy("stylistName")}>
                    Stylist Name{getSortIndicator("stylistName")}
                  </th>
                  <th onClick={() => sortBy("date")}>
                    Date{getSortIndicator("date")}
                  </th>

                  <th onClick={() => sortBy("time")}>
                    Time{getSortIndicator("time")}
                  </th>
                  <th>Action</th>
                  </tr>
                </thead>
  
                <tbody>
                {bookingLoading
                  ? [...Array(7)].map((_, index) => (
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
                          <Skeleton width={150} />
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
                          </div>
                        </td>
                      </tr>
                    ))
                  : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="manager-booking-cancel__notValid">
                          <FolderOutlined className="notValid--icon" />
                          <p>Currently, there are no cancel bookings</p>
                        </div>
                      </td>
                    </tr>
                  ) : (bookings.map((booking) => (
                    <tr key={booking.id}><td className="manager-booking-cancel__id">{booking.id}</td>
                    <td>
                      <div className="manager-booking-cancel__customer">
                        <span className="manager-booking-cancel__customer-name">
                          {booking.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="manager-booking-cancel__status">
                        {booking.customerPhone}
                      </td>
                    <td className="manager-booking-cancel__discountAmount">
                      {booking.stylistName}
                    </td>
                    <td>
                      <span className={`manager-booking-cancel__quantity`}>
                        {formatDate(booking.date)}
                      </span>
                    </td>
                    <td>
                      <span className={`manager-booking-cancel__quantity`}>
                        {formatTime(booking.time)}
                      </span>
                    </td>
                    <td className="manager-booking-cancel__actions">
                      <button
                        className="manager-booking-cancel__action-button"
                        onClick={() => toggleModal(booking.id)}
                      >
                        <BiDetail />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
        {bookings && bookings.length > 0 && (
        <div className="manager-booking-cancel__pagination">
          <div className="manager-booking-cancel__pagination-pages">
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
          <div
            className="manager-booking-cancel-backdrop"
            onClick={toggleModal}
          >
            <div
              className="manager-booking-cancel-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form>
                <h2 className="manager-booking-cancel-modal__header">
                  Booking Detail
                </h2>
                <div className="manager-booking-cancel-modal__form-section">
                  <div className="manager-booking-cancel-modal__form-grid">
                    <div className="manager-booking-cancel-modal__form-grid manager-booking-cancel-modal__form-grid--half-width">
                      <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="customerName"
                          className="manager-booking-cancel-modal__label"
                        >
                          Customer Name:
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          className="manager-booking-cancel-modal__input"
                          placeholder="Customer Name"
                          defaultValue={formData.customerName}
                          disabled
                        />
                      </div>
                      <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="voucherCode"
                          className="manager-booking-cancel-modal__label"
                        >
                          Voucher Code:
                        </label>
                        <input
                          type="text"
                          id="voucherCode"
                          className="manager-booking-cancel-modal__input"
                          placeholder="Voucher Code"
                          defaultValue={formData.voucherCode}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="manager-booking-cancel-modal__form-grid manager-booking-cancel-modal__form-grid--full-width">
                      <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="time"
                          className="manager-booking-cancel-modal__label"
                        >
                          Select Time:
                        </label>
                        <div className="manager-booking-cancel-modal__slots-list">
                          {(slots || []).map((time) => (
                            <label
                              key={time.slotid}
                              className={`manager-booking-cancel-modal__slots-option disabled`}
                            >
                              <input
                                type="radio"
                                name="time"
                                value={time.slottime}
                                checked={formData.time === time.slottime}
                                onChange={handleTimeChange}
                                disabled
                                className={`manager-booking-cancel-modal__radio disable`}
                              />
                              <span>{formatTime(time.slottime)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className="manager-booking-cancel-modal__form-grid
              manager-booking-cancel-modal__form-grid--half-width"
                    >
                      <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="date"
                          className="manager-booking-cancel-modal__label"
                        >
                          Date:
                        </label>
                        <input
                          type="text"
                          id="date"
                          className="manager-booking-cancel-modal__input"
                          placeholder="Date"
                          value={formatDate(formData.date)}
                          disabled
                          onChange={handleDateChange}
                        />
                      </div>
                      <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="stylistName"
                          className="manager-booking-cancel-modal__label"
                        >
                          Stylist Name:
                        </label>
                         <input
                          type="text"
                          id="stylistName"
                          className="manager-booking-cancel-modal__input"
                          placeholder="Stylist Name"
                          value={formData.stylistName}
                          disabled
                        />
                      </div>
                    </div>

                    <div
                      className="manager-booking-cancel-modal__form-grid
                manager-booking-cancel-modal__form-grid--full-width"
                    >
                      <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="serviceName"
                          className="manager-booking-cancel-modal__label"
                        >
                          Service Name:
                        </label>
                        <div className="manager-booking-cancel-modal__services-list">
                          {(services || []).map((service) => (
                            <label
                              key={service.id}
                              className="manager-booking-cancel-modal__option disabled"
                            >
                              <input
                                type="checkbox"
                                checked={selectedServices.includes(service.id)}
                                disabled
                                className="manager-booking-cancel-modal__checkbox disable"
                              />
                               <span>
                                {service.serviceName} -{" "}
                                {service.price && formatPrice(service.price)}{" "}
                                VND
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className="manager-booking-cancel-modal__form-grid
                  manager-booking-cancel-modal__form-grid--full-width"
                    >
                     <div className="manager-booking-cancel-modal__form-group">
                        <label
                          htmlFor="salon"
                          className="manager-booking-cancel-modal__label"
                        >
                          Select Salon:
                        </label>
                        <input
                          type="text"
                          id="salon"
                          className="manager-booking-cancel-modal__input"
                          placeholder="Stylist Name"
                          value={formData.salonName}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="manager-booking-cancel-modal__form-grid
                  manager-booking-cancel-modal__form-grid--full-width">
                     <div className="manager-booking-cancel-modal__form-group">
                    <div className="staff-create-booking__total-price">
                      <h3>
                        Total Price: {formatPrice(calculateTotalPrice())} VND
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
  };
  
  export default ManagerBookingCancel;