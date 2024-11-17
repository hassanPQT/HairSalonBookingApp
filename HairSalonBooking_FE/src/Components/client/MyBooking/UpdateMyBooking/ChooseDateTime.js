/* eslint-disable react-hooks/exhaustive-deps */
import { FaArrowLeft } from "react-icons/fa6";

import { LuCalendarSearch } from "react-icons/lu";

import { message, Spin } from "antd";

import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import Skeleton from "@mui/material/Skeleton";

import api from "../../../../config/axios";
import "./UpdateMyBooking.scss";

import { slots } from "../../../../data/booking";

import { bookingIdContext } from "../MyBooking";
import { updateBooking } from "../../../../actions/Update";

export function ChooseDateTime({ accountId, onPre, onSave }) {
  const bookingId = useContext(bookingIdContext);
  const [messageApi, contextHolder] = message.useMessage();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(true);
  const dispatch = useDispatch();
  const [isSlotAvailable, setIsSlotAvailable] = useState(false);
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

  function convertTime(timeString) {
    if (!/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      throw new Error("Invalid time format. Expected format is HH:MM:SS.");
    }
    const parts = timeString.split(":");
    return `${parts[0]}h${parts[1]}`;
  }

  const fetchBooking = async () => {
    try {
      const response = await api.get(
        // `bookingHistory?bookingId=${bookingId}`
        `booking/${bookingId}`
      );
      const data = response.data.result;
      if (data) {
        setSelectedDate(new Date(data.date));
        const foundSlot = timeSlots.find(
          (item) => item.slottime === convertTime(data.time)
        ).slotid;

        if (foundSlot) {
          setSelectedTime(foundSlot);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSlotLoading(false);
    }
  };
  useEffect(() => {
    fetchBooking();
  }, [timeSlots, bookingId]);

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
        const response = await api.post(
          `booking/slots/${bookingId}`,
          bookingValue
        );
        if (response.data && response.data.result) {
          setAvailableSlots(response.data.result);
        }
      } catch (error) { }
    };
    fetchTimeSlots();
  }, [selectedDate]);

  const toggleModal = async (bookingId) => {
    if (bookingId) {
      await fetchBooking(bookingId);
    }
  };
  const updateBookingData = async (e) => {
    e.preventDefault();
    const updateValues = {
      salonId: parseInt(sessionStorage.getItem("selectedBranchId"), 10),
      customerId: accountId,
      slotId: parseInt(sessionStorage.getItem("selectedTimeId"), 10),
      bookingDate: sessionStorage.getItem("selectedDate"),
      serviceId: JSON.parse(sessionStorage.getItem("selectedServicesId")),
      stylistId: parseInt(sessionStorage.getItem("selectedStylistId"), 10),
      voucherId: parseInt(sessionStorage.getItem("selectedVoucherId"), 10),
    };

    setLoading(true);
    try {
      const response = await api.put(
        // `bookingHistory/${bookingId}`,
        `booking/${bookingId}`,
        updateValues
      );
      const data = response.data;
      if (data) {
        await onSave();
        dispatch(updateBooking());
        messageApi.success("Booking information updated successfully!");
        toggleModal();
      }
    } catch (err) {
      if (err.response.status === 400) {
        messageApi.error("Please choose another time slot!");
      } else {
        messageApi.error("Something went wrong! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    updateBookingData(e);
  };

  return (
    <>
      {contextHolder}
      <form onSubmit={handleSubmit} className="myBooking__dateTime">
        <div className="myBooking__dateTime-header">
          <div onClick={onPre}>
            <FaArrowLeft className="chooseDateTime-icon" />
          </div>
          <h1>Choose Date & Time</h1>
        </div>
        <div className="myBooking__dateTime-date">
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
        <div className="myBooking__dateTime-time">
          {slotLoading
            ? // Show skeletons while loading
            [...Array(6)].map((_, index) => (
              <div key={index} className="time-slot">
                <Skeleton variant="text" width={100} height={40} />
              </div>
            ))
            : timeSlots.map((slot) => (
              <div
                key={slot.slotid}
                className={`time-slot ${availableSlots.some(
                  (availableSlot) => availableSlot.slotid === slot.slotid
                )
                    ? ""
                    : "disabled"
                  } ${selectedTime === slot.slotid ? "selected" : ""}`}
                onClick={() => handleTimeSlotClick(slot.slotid)}
              >
                {slot.slottime}
              </div>
            ))}
        </div>
        <button
          type="submit"
          className="myBooking__dateTime-btn btn flex "
          onClick={(e) => {
            toggleModal(bookingId);
            if (!isSelectedTime) {
              e.preventDefault();
            } else {
              sessionStorage.setItem("selectedTimeId", selectedTime);
              sessionStorage.setItem(
                "selectedDate",
                formatDateForInput(selectedDate)
              );
            }
          }}
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : "Save"}
        </button>
      </form>
    </>
  );
}
