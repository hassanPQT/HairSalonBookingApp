/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { StarFilled } from "@ant-design/icons";

import api from "../../../config/axios";
import "./StylistFeedback.scss";

export default function StylistFeedback() {
  const [feedbackData, setFeedBackData] = useState([]);
  const [avrRate, setAvrRate] = useState(0);
  const [stylistId, setStylistId] = useState("0");

  const fetchFeedbackData = async () => {
    try {
      const response = await api.get(`feedback/stylist/${stylistId}`);
      const data = response.data.result;
      console.log(data);
      setFeedBackData(data);
      const totalScore = data.reduce(
        (total, feedback) => total + feedback.score,
        0
      );

      const averageRate = (totalScore / 2 / data.length).toFixed(1);

      setAvrRate(averageRate);
    } catch (err) {
      console.error(err);
    }
  };

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
    fetchFeedbackData();
  }, [stylistId]);

  const numberOfRate = (rate) => {
    const arr = feedbackData.filter((f) => rate === f.score / 2);
    return ((arr.length / feedbackData.length) * 100).toFixed(1);
  };

  return (
    <div className="StylistFeedback">
      <div className="StylistFeedback__average-rating">
        <h2>Average Rating</h2>
        <div className="rating-content">
          <div className="rating-value">
            {avrRate || 0}
            <StarFilled className="rating-average-icon" />
          </div>
          <div>{feedbackData.length} Reviews</div>
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((rate) => (
              <div className="rating-bar" key={rate}>
                <span>{rate}</span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${numberOfRate(rate)}%` }}
                  ></div>
                </div>
                <span>{numberOfRate(rate) || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="StylistFeedback__customer-feedback">
        <h2>Customer Feedback</h2>
        <div className="lists-feedback">
          {(feedbackData || []).map((feed) => (
            <div className="feedback-item" key={feed.bookingId}>
              <img
                alt={feed.customerName}
                height="50"
                src={feed.customerImage}
                width="50"
              />
              <div className="feedback-content">
                <div className="feedback-header">
                  <div>
                    <h3>{feed.customerName}</h3>
                    <span>{feed.date}</span>
                  </div>
                  <div className="feedback__rating">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s}>
                        <StarFilled
                          className={
                            feed.score / 2 < s
                              ? "feedback-not-rating"
                              : "feedback-rating"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="feedback-text">{feed.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
