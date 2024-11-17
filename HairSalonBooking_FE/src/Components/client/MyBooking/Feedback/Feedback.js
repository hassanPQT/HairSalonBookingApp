import { VscFeedback } from "react-icons/vsc";
import { GoDotFill } from "react-icons/go";
import api from "../../../../config/axios";
import React, { useState, useEffect } from "react";
import { Modal } from "antd";

export default function Feedback({ bookingHistory, accountId }) {
  const [feedBackData, setFeedBackData] = useState([]);
  const [bookingId, setBookingId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const showModal = (bookingId) => {
    if (bookingId) {
      setIsModalOpen(true);
      setBookingId(bookingId);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    createFeedback();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await api.get(`feedback/${bookingId}`);

        if (response.data) {
          setFeedBackData(response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    fetchFeedback(bookingId);
  }, [bookingId, feedBackData]);

  const fetchFeedback = async () => {
    try {
      const response = await api.get(`feedback/${bookingId}`);
      const data = response.data.result;
      console.log(data);
      if (data !== "Not feedback yet" || !data) {
        console.log(data);
        setIsDisabled(true);
        const foundFeedback = data;

        if (foundFeedback) {
          setRating(Math.ceil(foundFeedback.score / 2));
          setFeedback(foundFeedback.content);
        }
      } else {
        setFeedback("");
        setRating(0);
        setIsDisabled(false);
      }
    } catch (error) {
      console.log("Error fetching feedback:", error);
    }
  };

  function getNowDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const createFeedback = async () => {
    const createValues = {
      date: getNowDate(),
      content: feedback,
      score: rating * 2,
      accountId: accountId,
      bookingId: bookingId,
    };
    try {
      const response = await api.post(`feedback`, createValues);
      console.log("Created feedback:", response.data);
    } catch (err) {
      console.error("Error saving feedback:", err);
    } finally {
      setIsDisabled(true);
    }
  };
  return (
    <>
      <section className="tab-panel">
        <h2>Booking history </h2>
        <div className="panel">
          {(bookingHistory || []).map((booking) => (
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
                    <label>Address :</label>
                    {booking.salonName}
                  </p>
                  <p>
                    <label>Stylist :</label> {booking.stylistName}
                  </p>
                  <div className="info__content-lists">
                    <label>Services :</label>
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

                <div
                  className="panel-action"
                  onClick={() => showModal(booking.bookingId)}
                >
                  <button className="panel-btn btn">
                    <VscFeedback className="myBooking-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal
          title="Feedback"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Send"
          className="myBooking__model"
          okButtonProps={{
            disabled: isDisabled,
          }}
        >
          <div className="model__rating">
            {[5, 4, 3, 2, 1].map((star) => (
              <React.Fragment key={star}>
                <input
                  id={`rating-${star}`}
                  type="radio"
                  name="rating"
                  value={star}
                  checked={rating === star}
                  onChange={(e) => setRating(Number(e.target.value))}
                />

                <label
                  htmlFor={`rating-${star}`}
                  title={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <svg
                    viewBox="0 0 576 512"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                  </svg>
                </label>
              </React.Fragment>
            ))}
          </div>

          <div className="model__feedback">
            <label htmlFor="input" className="text">
              Write feedback here:
            </label>
            <textarea
              type="text"
              placeholder="Write here..."
              name="input"
              className="input"
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </Modal>
      </section>
    </>
  );
}
