/* eslint-disable react-hooks/exhaustive-deps */
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { LuCalendarSearch } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiHome } from "react-icons/ci";
import { PiScissors } from "react-icons/pi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { SlPeople } from "react-icons/sl";
import "./ChooseDateTime.scss";
import api from "../../../../config/axios";
import Swal from "sweetalert2";

export default function ChooseDateTime() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isSelectedStylist = sessionStorage.getItem("selectedStylistId");
    if (!isSelectedStylist) {
      navigate("/booking/step3");
      const isSelectedServices = sessionStorage.getItem("selectedServicesId");
      if (!isSelectedServices) {
        navigate("/booking/step2");
        const selectedBranchId = sessionStorage.getItem("selectedBranchId");
        if (!selectedBranchId) {
          navigate("/booking/step1");
        }
      }
    }
  }, []);

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

    fetchData("slot/read", setTimeSlots);
  }, []);

  useEffect(() => {
    const storedTimeId = sessionStorage.getItem("selectedTimeId");
    const storedDate = sessionStorage.getItem("selectedDate");

    if (storedTimeId) {
      setSelectedTime(Number(storedTimeId));
    }
    if (storedDate) {
      setSelectedDate(new Date(storedDate));
    }
  }, [timeSlots]);

  const handleTimeSlotClick = (slotId) => {
    if (availableSlots.some((slot) => slot.slotid === slotId)) {
      setSelectedTime(slotId);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value === "today" ? today : tomorrow;
    formatDateForInput(date);
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayOfWeek} (${day}/${month})`;
  };

  const isSelectedTime = selectedTime !== null;

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const storedBranchId = sessionStorage.getItem("selectedBranchId");
    const branchId = parseInt(storedBranchId, 10);

    const storedServices = sessionStorage.getItem("selectedServicesId");
    const serviceIds = JSON.parse(storedServices);

    const storedStylist = sessionStorage.getItem("selectedStylistId");
    const stylistId = JSON.parse(storedStylist);

    const fetchTimeSlots = async () => {
      const bookingValue = {
        salonId: branchId,
        serviceId: serviceIds,
        accountId: stylistId,
        date: formatDateForInput(selectedDate),
      };

      try {
        const response = await api.post("booking/slots", bookingValue);
        const data = response.data.result;
        if (data) {
          if (data.length === 0) {
            Swal.fire({
              icon: "error",
              title: "Sorry",
              text: "Today, this stylist is fully booked",
            });
          }
          setAvailableSlots(data);
        }
      } catch (error) {}
    };
    fetchTimeSlots();
  }, [selectedDate]);

  function formatTime(time) {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
}

  return (
    <div className="chooseDateTime">
      <nav className="chooseDateTime__tagNavigation">
        <ul className="chooseDateTime__tagNavigation--item">
          <li className="chooseDateTime__tagNavigation--item-content">
            <Link to="/booking/step1" aria-label="Salon">
              <div className="filled"></div>
              <CiHome />
            </Link>
            <div className="tooltip">Salon</div>
          </li>
          <li className="chooseDateTime__tagNavigation--item-content">
            <Link to="/booking/step2" aria-label="Service">
              <div className="filled"></div>
              <PiScissors />
            </Link>
            <div className="tooltip">Service</div>
          </li>

          <li className={`chooseDateTime__tagNavigation--item-content`}>
            <Link to={"/booking/step3"} aria-label="Stylist">
              <div className="filled"></div>
              <SlPeople />
            </Link>
            <div className="tooltip">Stylist</div>
          </li>
          <li className="chooseDateTime__tagNavigation--item-content active">
            <Link to="/booking/step4" aria-label="Time">
              <div className="filled"></div>
              <RiCalendarScheduleLine />
            </Link>
            <div className="tooltip">Time</div>
          </li>
        </ul>
      </nav>

      <div className="chooseDateTime__container">
        <div className="chooseDateTime__container-header">
          <Link to="/booking/step3">
            <FaArrowLeft className="chooseDateTime-icon" />
          </Link>
          <h1>Choose Date & Time</h1>
        </div>
        <div className="chooseDateTime__container-date">
          <LuCalendarSearch className="select-icon" />
          <select
            value={
              selectedDate.toDateString() === today.toDateString()
                ? "today"
                : "tomorrow"
            }
            onChange={handleDateChange}
          >
            <option value="today">Today, {formatDate(today)}</option>
            <option value="tomorrow">Tomorrow, {formatDate(tomorrow)}</option>
          </select>
        </div>
        <div className="chooseDateTime__container-time">
          {timeSlots.map((slot) => (
            <div
              key={slot.slotid}
              className={`time-slot ${
                availableSlots.some(
                  (availableSlot) => availableSlot.slotid === slot.slotid
                )
                  ? ""
                  : "disabled"
              } ${selectedTime === slot.slotid ? "selected" : ""}`}
              onClick={() => handleTimeSlotClick(slot.slotid)}
            >
              {slot.slottime && formatTime(slot.slottime)}
            </div>
          ))}
        </div>
        <Link
          to="/booking"
          className={`chooseDateTime__container-btn btn flex ${
            isSelectedTime ? "" : "btn-disable"
          }`}
          onClick={(e) => {
            if (!isSelectedTime) {
              e.preventDefault();
            } else {
              sessionStorage.setItem("selectedTimeId", selectedTime);
              sessionStorage.setItem(
                "selectedDate",
                selectedDate.toISOString()
              );
            }
          }}
        >
          Next Step
          <FaArrowRight className="chooseDateTime-icon" />
        </Link>
      </div>
    </div>
  );
}
