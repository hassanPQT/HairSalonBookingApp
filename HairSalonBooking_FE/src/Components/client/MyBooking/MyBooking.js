/* eslint-disable react-hooks/exhaustive-deps */
import { FiTrash2 } from "react-icons/fi";

import { LiaUserEditSolid } from "react-icons/lia";
import { GoDotFill } from "react-icons/go";

import React, { useState, useEffect, createContext } from "react";
import api from "../../../config/axios";
import { Modal } from "antd";
import Swal from "sweetalert2";
import Skeleton from "@mui/material/Skeleton";

import "./MyBooking.scss";
import { ChooseDateTime } from "./UpdateMyBooking/ChooseDateTime";
import { ChooseStylist } from "./UpdateMyBooking/ChooseStylist";
import { ChooseService } from "./UpdateMyBooking/ChooseService";
import { ChooseSalon } from "./UpdateMyBooking/ChooseSalon";
import Feedback from "./Feedback/Feedback";

export const bookingIdContext = createContext();
export default function MyBooking() {
  const [activeTab, setActiveTab] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [bookingId, setBookingId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountId, setAccountId] = useState(0);
  const [currentBookingId, setCurrentBookingId] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("customer/profile");
        const data = response.data;
        if (data) {
          setAccountId(data.result.accountid);
          setActiveTab("pending");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [accountId]);

  const fetchBookingHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`customer/${accountId}/${activeTab}`);
      if (response.data) {
        setBookingHistory(response.data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== null && accountId !== 0) {
      fetchBookingHistory();
    }
  }, [activeTab]);

  const refresh = () => {
    fetchBookingHistory();
  };

  const showModal = (bookingId) => {
    if (bookingId) {
      setIsModalOpen(true);
      setBookingId(bookingId);
      if (currentBookingId !== bookingId) {
        setCurrentStep("salon");
        setCurrentBookingId(bookingId);
      }
    }
  };
  const handleCancel = () => {
    sessionStorage.removeItem("selectedBranchId");
    sessionStorage.removeItem("selectedServicesId");
    sessionStorage.removeItem("selectedStylistId");
    sessionStorage.removeItem("selectedTimeId");
    sessionStorage.removeItem("selectedDate");
    sessionStorage.removeItem("selectedVoucherId");
    setCurrentStep("salon");
    setIsModalOpen(false);
  };

  const deleteBooking = async (bookingId) => {
    try {
      // const response = await api.delete(`bookingHistory/${bookingId}`);
      const response = await api.delete(`booking/${bookingId}`);
      if (response.status === 200) {
        Swal.fire({
          title: "Deleted!",
          text: "The booking has been deleted.",
          icon: "success",
        });
        setBookingHistory((prev) =>
          prev.filter((booking) => booking.bookingId !== bookingId)
        );
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };
  const [currentStep, setCurrentStep] = useState("salon");

  const handleNextStep = () => {
    if (currentStep === "salon") {
      setCurrentStep("service");
    } else if (currentStep === "service") {
      setCurrentStep("stylist");
    } else if (currentStep === "stylist") {
      setCurrentStep("dateTime");
    } else if (currentStep === "dateTime") {
      setCurrentStep("dateTime");
    }
  };
  const confirmDeleteModal = (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1b5077",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // console.log(result.isConfirmed);
      if (result.isConfirmed) {
        try {
          await deleteBooking(bookingId);
          fetchBookingHistory();
        } catch (error) {}
      }
    });
  };

  const skeletonContainerStyle = {
    width: "98%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
  };

  const skeletonStyle = {
    flex: "0 1 32%", // Each skeleton takes 30% of the width
    height: "180px", // Set height
  };

  return (
    <>
      <div className="myBooking">
        <div className="myBooking__tabs">
          <label
            onClick={() => setActiveTab("pending")}
            htmlFor="tab2"
            className={activeTab === "pending" ? "label-active" : ""}
          >
            Pending
          </label>

          <label
            onClick={() => setActiveTab("completed")}
            htmlFor="tab1"
            className={activeTab === "completed" ? "label-active" : ""}
          >
            Completed
          </label>

          <div className="myBooking__tabs-panels">
            {/* xem lịch sử giao dịch và thêm feedback */}
            {activeTab === "completed" && (
              <Feedback bookingHistory={bookingHistory} accountId={accountId} />
            )}

            {/* update và xóa booking */}
            {activeTab === "pending" && (
              <section className="tab-panel">
                <h2>Upcoming Bookings</h2>
                <div className="panel">
                  {loading ? (
                    <div style={skeletonContainerStyle}>
                      <Skeleton variant="rect" style={skeletonStyle} />
                      <Skeleton variant="rect" style={skeletonStyle} />
                      <Skeleton variant="rect" style={skeletonStyle} />
                      <Skeleton variant="rect" style={skeletonStyle} />
                      <Skeleton variant="rect" style={skeletonStyle} />
                      <Skeleton variant="rect" style={skeletonStyle} />
                    </div>
                  ) : (
                    (bookingHistory || []).map((booking) => (
                      <div key={booking.bookingId} className="panel__card">
                        <div className="panel__card-info">
                          <div className="info__title">
                            <h3>#{booking.bookingId}</h3>
                            <div className="info__title-right">
                              <h3>#{booking.date}</h3>
                              <h4>{booking.time}</h4>
                            </div>
                          </div>
                          <div className="info__content">
                            <p>
                              <label>Address:</label> {booking.salonName}
                            </p>
                            <p>
                              <label>Stylist:</label> {booking.stylistName}
                            </p>
                            <div className="info__content-lists">
                              <label>Services:</label>
                              {Array.isArray(booking.serviceName) &&
                              booking.serviceName.length > 0
                                ? booking.serviceName.map((service, index) => (
                                    <div key={index}>
                                      <GoDotFill className="lists-icon" />
                                      {service.serviceName}
                                    </div>
                                  ))
                                : null}
                            </div>
                          </div>

                          <div className="panel-actions">
                            <button
                              className="panel-btn btn"
                              onClick={() => showModal(booking.bookingId)}
                            >
                              <LiaUserEditSolid className="myBooking-icon" />
                            </button>
                            <button
                              className="panel-btn btn"
                              onClick={() =>
                                confirmDeleteModal(booking.bookingId)
                              }
                            >
                              <FiTrash2 className="myBooking-icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <bookingIdContext.Provider value={bookingId}>
                  <Modal
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={currentStep === "service" ? "1080px" : "520px"}
                  >
                    {currentStep === "salon" ? (
                      <ChooseSalon
                        onNext={handleNextStep}
                        onClose={handleCancel}
                      />
                    ) : currentStep === "service" ? (
                      <ChooseService
                        onNext={handleNextStep}
                        onPre={() => setCurrentStep("salon")}
                      />
                    ) : currentStep === "stylist" ? (
                      <ChooseStylist
                        onNext={handleNextStep}
                        onPre={() => setCurrentStep("service")}
                      />
                    ) : currentStep === "dateTime" ? (
                      <ChooseDateTime
                        accountId={accountId}
                        onPre={() => setCurrentStep("stylist")}
                        onSave={() => {
                          handleCancel();
                          refresh();
                        }}
                      />
                    ) : null}
                  </Modal>
                </bookingIdContext.Provider>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
