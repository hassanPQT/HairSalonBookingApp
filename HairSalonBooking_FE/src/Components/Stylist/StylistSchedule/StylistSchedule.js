import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { BiTaskX } from "react-icons/bi";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { GoDotFill } from "react-icons/go";
import { FolderOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import "./StylistSchedule.scss";

const StylistSchedule = () => {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [highlightedDays, setHighlightedDays] = useState([14, 19, 25]);
  const [selectDay, setSelectDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [services, setServices] = useState([]);
  const [stylistId, setStylistId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [todayBooking, setTodayBooking] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get("service");
        const data = response.data.result;
        console.log(data);
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchService();
  }, []);

  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const response = await api.get(`stylist/profile`);
        const data = response.data.result;
        console.log(data);
        if (data) {
          setStylistId(data.accountid);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStylistData();
  }, [stylistId]);

  useEffect(() => {
    if (stylistId) {
      const fetchBookingData = async () => {
        try {
          const response = await api.get(
            `bookings/stylist/${selectDay}/${stylistId}`
          );
          const bookingsData = response.data.result;
          console.log(bookingsData);
          if (bookingsData && services.length > 0) {
            const updatedBookingDetails = bookingsData.map((booking) => {
              const matchedServices = booking.serviceId.map((serviceId) => {
                const matchedService = services.find(
                  (service) => Number(service.id, 10) === serviceId
                );
                return matchedService
                  ? matchedService.serviceName
                  : "Unknown Service";
              });
              return {
                ...booking,
                serviceNames: matchedServices,
              };
            });
            if (selectDay === dayjs().format("YYYY-MM-DD")) {
              setTodayBooking(updatedBookingDetails);
            }
            setBookingDetails(updatedBookingDetails);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchBookingData();
    }
  }, [selectDay, stylistId]);

  useEffect(() => {
    return () => requestAbortController.current?.abort();
  }, [selectDay]);

  const handleMonthChange = () => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
  };

  const handleDayClick = (date) => {
    if (!date || !dayjs(date).isValid()) {
      console.error("Invalid date selected");
      return;
    }

    setSelectDay(date.format("YYYY-MM-DD"));
  };

  function convertTimeFormat(time) {
    const [hours, minutes] = time.split(":");

    return `${hours}h${minutes}`;
  }

  return (
    <div className="StylistSchedule">
      <div className="StylistSchedule__left">
        <div className="calendar-container">
          <h2>
            Your <span>Calendar</span>
          </h2>
          <div className="schedule">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={dayjs(selectDay).isValid() ? dayjs(selectDay) : dayjs()}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                onChange={handleDayClick}
                renderLoading={() => <DayCalendarSkeleton />}
                // slots={{
                //   day: ServerDay,
                // }}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="today-task">
          <h3>
            Today Task <span>({todayBooking.length})</span>
          </h3>
          <ul>
            {todayBooking.length !== 0 ? (
              todayBooking.map((tbook) => (
                <li key={tbook.id}>
                  <span>👦 {tbook.customerName}</span>
                  <span>{convertTimeFormat(tbook.time)}</span>
                </li>
              ))
            ) : (
              <li className="today-task__notValid">
                <BiTaskX className="notValid--icon" />
                <p>Don't have booking yet</p>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="StylistSchedule__right">
        <div className="schedule-details">
          <h2>
            View <span>Details</span>
          </h2>
          {bookingDetails.length !== 0 ? (
            <div className="lists-details">
              {(bookingDetails || []).map((booking) => (
                <div className="details-item" key={booking.id}>
                  <div className="details-content">
                    <div className="details-header">
                      <div>
                        <h3>
                          <span>Customer : </span> {booking.customerName}
                        </h3>
                        <span>⏰{convertTimeFormat(booking.time)}</span>
                      </div>
                      <div
                        className={`status ${
                          booking.status === "PENDING"
                            ? "pending"
                            : booking.status === "IN_PROGRESS"
                            ? "in-progress"
                            : booking.status === "COMPLETED"
                            ? "completed"
                            : booking.status === "CANCELLED"
                            ? "cancelled"
                            : ""
                        }`}
                      >
                        {booking.status}
                      </div>
                    </div>
                    {(booking.serviceNames || []).map((ser, index) => (
                      <div className="details-text" key={index}>
                        <GoDotFill className="details-text-icon" />
                        {ser}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lists-details__notValid">
              <FolderOutlined className="notValid--icon" />
              <p>Don't have booking yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StylistSchedule;
