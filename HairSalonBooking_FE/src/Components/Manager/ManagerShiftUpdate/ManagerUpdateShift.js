import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Checkbox, message, Spin } from "antd";
import { StarFilled } from "@ant-design/icons";
import { TiScissorsOutline } from "react-icons/ti";
import Swal from "sweetalert2";
import "./ManagerUpdateShift.scss";
import api from "../../../config/axios";
import { updateBooking } from "../../../actions/Update";
import { useDispatch } from "react-redux";

export default function ManagerUpdateShift() {
  const [booking, setBooking] = useState([]);
  const [services, setServices] = useState(null);
  const [slots, setSlots] = useState(null);
  const [salonLocations, setSalonLocations] = useState(null);
  const [stylistData, setStylistData] = useState(null);
  const [availableStylist, setAvailableStylist] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formUpdate, setFormUpdate] = useState({
    salonId: 0,
    customerId: 0,
    slotId: 0,
    bookingDate: "",
    serviceId: 0,
    stylistId: 0,
    voucherId: 0,
  });

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
    fetchData("service", setServices);
    fetchData("slot/read", setSlots);
    fetchData("stylist/read", setStylistData);
  }, []);

  useEffect(() => {
    if (services && salonLocations && slots && stylistData) {
      fetchBookingBusy();
    }
  }, [services, salonLocations, slots, stylistData]);

  const fetchBookingBusy = async () => {
    try {
      const response = await api.get(`manager/booking/stylist/busy`);
      const data = response.data.result;
      console.log(data);
      if (data) {
        const bookingData = data.map((booking) => {
          const serviceNames = booking.serviceId.map(
            (serviceId) =>
              services.find((service) => service.id === serviceId)?.serviceName
          );
          const salon = salonLocations.find(
            (sa) => sa.address === booking.salonName
          );
          const salonId = salon ? salon.id : null;
          const slot = slots.find((slot) => slot.slottime === booking.time);
          const slotId = slot ? slot.slotid : null;
          const formattedTime = slot ? slot.slottime : booking.time;
          const stylist = stylistData.find(
            (stylist) => stylist.fullname === booking.stylistName
          );
          const stylistImg = stylist ? stylist.image : null;
          return {
            ...booking,
            serviceNames,
            salonId,
            slotId,
            stylistImg,
            time: formattedTime,
          };
        });
        setBooking(bookingData);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (booking.length > 0) {
      setSelectedBooking(booking[0]);
      console.log(selectedBooking);
      fetchAvailableStylist(booking[0]);
    }
  }, [booking]);
  const fetchAvailableStylist = async (booking) => {
    const value = {
      salonId: booking.salonId,
      serviceId: booking.serviceId,
      date: booking.date,
      slotId: booking.slotId,
    };
    try {
      console.log(value);
      const response = await api.post(`booking/stylists/update`, value);
      const data = response.data.result;

      if (data) {
        setAvailableStylist(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAvailableStylist = async (booking) => {
    if (booking) {
      setSelectedBooking(booking);
      await fetchAvailableStylist(booking);
    }
  };

  const onCheckboxChange = (stylistId) => {
    setSelectedStylist(selectedStylist === stylistId ? null : stylistId);
  };

  const updateBookingData = async (booking) => {
    const updateValues = {
      salonId: parseInt(booking.salonId, 10),
      customerId: parseInt(booking.customerId, 10),
      slotId: parseInt(booking.slotId, 10),
      bookingDate: booking.date,
      serviceId: booking.serviceId,
      stylistId: parseInt(selectedStylist, 10),
      voucherId: parseInt(booking.voucherCode, 10),
    };

    setLoading(true);
    try {
      console.log(updateValues);
      const response = await api.put(`booking/${booking.id}`, updateValues);
      const data = response.data.result;

      console.log(data);
      if (data) {
        setFormUpdate((prev) => ({
          ...prev,
          salonId: data.salonId || 0,
          customerId: data.customerId || 0,
          slotId: data.slotId || 0,
          bookingDate: data.bookingDate || "",
          serviceId: data.serviceId || "",
          stylistId: data.stylistId || 0,
          voucherId: data.voucherId || 0,
        }));
        dispatch(updateBooking());
        messageApi.success("Booking information updated successfully!");
        Swal.fire({
          title: "Updated!",
          text: "The booking has been update.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setBooking((prevBookings) => {
          const updatedBookings = prevBookings.filter(
            (boo) => boo.id !== selectedBooking.id
          );
          if (updatedBookings.length === 0) {
            navigate("/manager/shift");
          }
          return updatedBookings;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (booking) => {
    if (!selectedStylist) {
      messageApi.warning("Please select a stylist before saving.");
      return;
    }
    await updateBookingData(booking);
  };
  function convertTimeFormat(time) {
    const [hours, minutes] = time.split(":");

    return `${hours}h${minutes}`;
  }
  return (
    <>
      {" "}
      <div className="manager-create-stylist__breadcrumb">
        <Link
          to="/manager/shift"
          className="manager-create-stylist__breadcrumb-link"
        >
          Shift
        </Link>{" "}
        &gt;
        <span className="manager-create-stylist__breadcrumb-current">
          Update Booking
        </span>
      </div>
      <div className="shift-manager">
        <div className="shift-manager__sidebar">
          <section className="stylist-info">
            <h2 className="stylist-info__title">
              Stylist <span>Information</span>
            </h2>
            <div className="stylist-info__card">
              <div className="stylist-info__avatar">
                <img
                  alt={selectedBooking.stylistName}
                  src={selectedBooking.stylistImg}
                />
              </div>
              <div className="stylist-info__details">
                <div className="stylist-info__header">
                  <h2>
                    #Date: <span>{selectedBooking.date}</span>
                  </h2>
                </div>
                <h1>{selectedBooking.stylistName}</h1>
              </div>
            </div>
          </section>

          <section className="task-list">
            <h3 className="task-list__title">
              All Booking <span>({booking.length || 0})</span>
            </h3>
            <div className="task-list__container">
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                </table>
                <div className="data-table__body-wrapper">
                  <table className="data-table">
                    <tbody>
                      {(booking || []).map((booking) => (
                        <tr
                          key={booking.id}
                          onClick={() => handleAvailableStylist(booking)}
                          className={
                            selectedBooking?.id === booking.id
                              ? "selected-booking"
                              : ""
                          }
                        >
                          <td
                            className="data-table__id"
                            style={{ width: "70px" }}
                          >
                            {booking.id}
                          </td>
                          <td style={{ width: "180px" }}>
                            <div className="customer-info">
                              <span className="customer-info__name">
                                {booking.customerName}
                              </span>
                            </div>
                          </td>
                          <td style={{ width: "160px" }}>
                            {(booking.serviceNames || []).map(
                              (service, index) => (
                                <div key={index}>➕ {service}</div>
                              )
                            )}
                          </td>
                          <td>{convertTimeFormat(booking.time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="shift-manager__main">
          <section className="available-stylists">
            <h2 className="available-stylists__title">
              Available <span>Stylist</span>
            </h2>
            {availableStylist.length === 0 ? (
              <div className="empty-state">
                <TiScissorsOutline className="empty-state__icon" />
                <p>Don't have stylist available</p>
              </div>
            ) : (
              <div>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Stylist</th>
                        <th>Score</th>
                        <th>Select</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="data-table__body-wrapper">
                    <table className="data-table">
                      <tbody>
                        {(availableStylist || []).map((stylist) => (
                          <tr key={stylist.id}>
                            <td
                              className="data-table__id"
                              style={{ width: "60px" }}
                            >
                              {stylist.id}
                            </td>
                            <td
                              className="stylist-avatar"
                              style={{ width: "100px" }}
                            >
                              <img src={stylist.image} alt={stylist.fullname} />
                            </td>
                            <td
                              className="stylist-name"
                              style={{ width: "180px" }}
                            >
                              {stylist.fullname}
                            </td>
                            <td style={{ width: "100px" }}>
                              <div className="rating">
                                {stylist.feedbackScore}
                                <span>
                                  <StarFilled className="rating__star" />
                                </span>
                              </div>
                            </td>
                            <td>
                              <Checkbox
                                checked={selectedStylist === stylist.id}
                                onChange={() => onCheckboxChange(stylist.id)}
                              >
                                {selectedStylist === stylist.id
                                  ? "Selected"
                                  : "Available"}
                              </Checkbox>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {selectedStylist && (
                  <div className="action-bar">
                    <button
                      className="action-bar__button"
                      disabled={loading}
                      onClick={() => handleSubmit(selectedBooking)}
                    >
                      {loading ? <Spin size="small" /> : "Save"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
