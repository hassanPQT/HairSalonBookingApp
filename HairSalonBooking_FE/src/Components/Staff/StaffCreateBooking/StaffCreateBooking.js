/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./StaffCreateBooking.scss";
import { Spin } from "antd";
import api from "../../../config/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const StaffCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotRealTime, setSlotRealTime] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const customerPhone = state?.customerPhone || "";

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateChange = (e) => {
    const date = e.target.value === "today" ? today : tomorrow;
    formatDateForInput(date);
    setSelectedDate(date);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => {
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayOfWeek} (${day}/${month})`;
  };

  const [formData, setFormData] = useState({
    phone: "",
    date: "",
    time: "",
    serviceId: [],
    stylistId: 0,
    customerName: "",
  });

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  useEffect(() => {
    if (customerPhone) {
      setFormData((prev) => ({ ...prev, phone: customerPhone }));
      fetchCustomerName(customerPhone)
    }
  }, [customerPhone]);

  const [selectedTime, setSelectedTime] = useState("");

  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    setFormData((prev) => ({ ...prev, time: newTime }));
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setFormData((prev) => ({ ...prev, phone: newPhone }));

    if (newPhone.length === 10) {
      fetchCustomerName(newPhone);
    } else {
      setFormData((prev) => ({ ...prev, customerName: "" }));
    }
  };

  const handleStylistChange = (event) => {
    setFormData((prev) => ({ ...prev, stylistId: event.target.value }));
  };

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await api.get(endpoint);
        const data = response.data.result;
        if (data) {
          setter(data);
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchData("slot/read", setSlots);
    fetchData("service", setServices);
  }, []);

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

    fetchData(`slot/${formatDateForInput(selectedDate)}`, setSlotRealTime);
  }, [selectedDate]);

  useEffect(() => {
    const fetchManagerData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        if (data) {
          setStaff(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  const fetchCustomerName = async (phone) => {
    setLoading(true);
    try {
      const response = await api.post(`customer/phone`, { phone });
      const data = response.data.result;
      if (data) {
        setFormData((prev) => ({ ...prev, customerName: data }));
      }
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        customerName: err.response.data.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staff.salonId !== undefined) {
      const fetchStylists = async () => {
        const foundSlot = slots.find((item) => item.slottime === formData.time);
        const slotId = foundSlot ? foundSlot.slotid : null;
        const bookingValue = {
          salonId: staff.salonId,
          serviceId: selectedServices,
          date: formatDateForInput(selectedDate),
          slotId: slotId,
        };
        try {
          const response = await api.post(
            `booking/stylists/update`,
            bookingValue
          );
          const data = response.data.result;
          if (data) {
            setStylists(data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchStylists();
    }
  }, [staff, selectedTime, selectedServices, selectedDate]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prevSelected) => {
      const newSelected = prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId];

      setSelectedServices(newSelected);
      return newSelected;
    });
  };

  const createBookingData = async (e) => {
    e.preventDefault();
    const selectedServicesId = selectedServices.map(Number);
    const foundSlot = slots.find((item) => item.slottime === formData.time);
    const slotId = foundSlot ? foundSlot.slotid : null;
    const createValues = {
      salonId: Number(staff.salonId),
      phoneNumber: formData.phone,
      bookingDate: formatDateForInput(selectedDate),
      slotId: slotId,
      serviceId: selectedServicesId,
      stylistId: Number(formData.stylistId),
      voucherId: 0,
    };

    setLoading(true);
    try {
      const response = await api.post(`staff/booking`, createValues);
      const data = response.data.result;

      if (data) {
        navigate("/staff/booking/pending");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (staff.salonId !== undefined) {
      createBookingData(e);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}h${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <div className="staff-create-booking__breadcrumb">
        <Link
          to="/staff/booking/pending"
          className="staff-create-booking__breadcrumb-link"
        >
          Booking
        </Link>{" "}
        &gt;
        <span className="staff-create-booking__breadcrumb-current">
          New Booking
        </span>
      </div>
      <div className="staff-create-booking">
        <div className="staff-create-booking__container">
          <form onSubmit={handleSubmit}>
            <h2 className="staff-create-booking__header">New Booking</h2>
            <div className="staff-create-booking__form-section">
              <div className="staff-create-booking__form-grid">
                <div
                  className="staff-create-booking__form-grid
              staff-create-booking__form-grid--half-width"
                >
                  <div className="staff-create-booking__form-group">
                    <label
                      htmlFor="phone"
                      className="staff-create-booking__label"
                    >
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="staff-create-booking__input"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="staff-create-booking__form-grid">
                    <div className="staff-create-booking__form-group">
                      <label
                        htmlFor="date"
                        className="staff-create-booking__label"
                      >
                        Select Date:
                      </label>
                      <select
                        className="staff-create-booking__select"
                        value={
                          selectedDate.toDateString() === today.toDateString()
                            ? "today"
                            : "tomorrow"
                        }
                        onChange={handleDateChange}
                      >
                        <option value="today">
                          Today, {formatDate(today)}
                        </option>
                        <option value="tomorrow">
                          Tomorrow, {formatDate(tomorrow)}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="staff-create-booking__form-grid
                staff-create-booking__form-grid--full-width"
                >
                  <div className="staff-create-booking__form-group">
                    <label
                      htmlFor="customerName"
                      className="staff-create-booking__label"
                    >
                      Customer Name:
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={formData.customerName}
                      disabled
                      className="staff-create-booking__input"
                      placeholder="Customer Name"
                    />
                  </div>
                </div>
                <div
                  className="staff-create-booking__form-grid
                staff-create-booking__form-grid--full-width"
                >
                  <div className="staff-create-booking__form-group">
                    <label className="staff-create-booking__label">
                      Select Time:
                    </label>
                    <div className="staff-create-booking__slots-list">
                      {(slots || []).map((time) => (
                        <label
                          key={time.slotid}
                          className={`staff-create-booking__slots-option ${
                            slotRealTime.some(
                              (item) => item.slotid === time.slotid
                            )
                              ? ""
                              : " disabled"
                          }`}
                        >
                          <input
                            type="radio"
                            name="time"
                            value={time.slottime}
                            checked={formData.time === time.slottime}
                            onChange={handleTimeChange}
                            disabled={
                              !slotRealTime.some(
                                (item) => item.slotid === time.slotid
                              )
                            }
                            className={`staff-create-booking__radio ${
                              slotRealTime.some(
                                (item) => item.slotid === time.slotid
                              )
                                ? ""
                                : "disabled"
                            }`}
                          />
                          <span>{formatTime(time.slottime)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className="staff-create-booking__form-grid
                staff-create-booking__form-grid--full-width"
                >
                  <div className="staff-create-booking__form-group">
                    <label className="staff-create-booking__label">
                      Select Service:
                    </label>
                    <div className="staff-create-booking__services-list">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className="staff-create-booking__option"
                        >
                          <input
                            type="checkbox"
                            onChange={() => handleServiceToggle(service.id)}
                            className="staff-create-booking__checkbox"
                          />
                          <span>
                            {service.serviceName} -{" "}
                            {service.price && formatPrice(service.price)} VND
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="staff-create-booking__form-group staff-create-booking__form-group--full-width">
                    <label
                      htmlFor="stylistName"
                      className="staff-create-booking__label"
                    >
                      Stylist Name:
                    </label>
                    <select
                      id="stylistName"
                      className="staff-create-booking__select"
                      defaultValue={formData.stylistId}
                      onChange={handleStylistChange}
                    >
                      <option value={0} disabled>
                        Select Stylist
                      </option>
                      {stylists.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.fullname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="staff-create-booking__form-group staff-create-booking__form-group--full-width">
                    <div className="staff-create-booking__total-price">
                      <h3>
                        Total Price: {formatPrice(calculateTotalPrice())} VND
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="staff-create-booking__button-container">
              <button
                type="submit"
                className="staff-create-booking__button"
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StaffCreateBooking;
