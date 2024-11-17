import React, { useState, useEffect } from "react";
import "./Slides.scss";
import slides from "../../../data/slides.js";
import { Link, useNavigate } from "react-router-dom";
import { Carousel, message, Spin } from "antd";
import api from "../../../config/axios.js";

export default function Slides() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("customer/profile");
      const data = response.data.result;
      if (data) {
        setPhoneNumber(data.phone);
        setIsLoggedIn(true);
        setCustomer(data);
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      fetchCustomerData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      return message.error("Please login before booking.");
    }

    if (phoneNumber && phoneNumber.length === 10 && /^\d+$/.test(phoneNumber)) {
      await updatePhoneNumber(phoneNumber);
      navigate("/booking/step1");
    } else {
      message.error("Please enter a valid 10-digit phone number.");
    }
  };

  const updatePhoneNumber = async (newPhoneNumber) => {
    setIsLoading(true);
    if (customer) {
      const updateValues = {
        fullname: customer.fullname,
        email: customer.email,
        dob: customer.dob !== null ? customer.dob : "",
        image: customer.image,
        phone: newPhoneNumber,
      };

      try {
        await api.put(`customer/${customer.accountid}`, updateValues);
        setPhoneNumber(newPhoneNumber);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    setPhoneNumber(value);
  };

  return (
    <>
      <Carousel autoplay speed={1000} effect="fade">
        {slides.map((item) => (
          <div key={item.id}>
            <section className="slides">
              <img src={item.srcImg} alt={item.title} />
              <div className="slides__content">
                <h1>
                  {item.title}
                  <br />
                  <span>{item.subTitle}</span>
                </h1>
                <p>{item.description}</p>
                <Link to="/aboutus" className="slides__btn">
                  Read More
                </Link>
              </div>
            </section>
          </div>
        ))}
      </Carousel>
      <div className="homeCard grid center">
        <div className="homeCard-booking">
          <input
            type="tel"
            onChange={handlePhoneNumberChange}
            placeholder="Enter a 10-digit phone number"
            maxLength={10}
            value={phoneNumber || ""}
          />
        </div>
        <button
          className="slides__btn btn"
          onClick={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? <Spin size="small" /> : "Booking Now"}
        </button>
      </div>
    </>
  );
}
