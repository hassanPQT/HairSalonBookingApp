/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "antd";
import * as React from "react";
import api from "../../../config/axios";
import "./ServiceDetails.scss";

export default function ServicesDetails() {
  const [serviceData, setServiceData] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { state } = useLocation();
  const serviceId = state.serviceId;

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await api.get(`service/${serviceId}`);
        const data = response.data.result;
        console.log(data);

        if (data) {
          setServiceData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchServiceData();
  }, [serviceId]);

  // Update `mainImage` once `serviceData.image` is loaded
  useEffect(() => {
    if (serviceData.image) {
      setMainImage(serviceData.image);
    }
  }, [serviceData.image]);

  const image = [
    serviceData.image,
    ...(Array.isArray(serviceData.collectionsImage)
      ? serviceData.collectionsImage
      : []),
  ];

  console.log(image);

  function removePTags(input) {
    if (!input) return "";
    return input.replace(/<\/?p>/g, "");
  }

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const handleClick = (serviceId) => {
    sessionStorage.setItem("selectedServicesId", JSON.stringify([serviceId]));
    navigate("/booking/step1");
  };

  const carouselSettings = {
    vertical: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
      <div className="servicesDetails">
        <div className="servicesDetails__header">
          <h1>SERVICES DETAILS</h1>
        </div>

        <div className="servicesDetails__main">
          <div className="servicesDetails__main-left">
            <div className="left-image">
              <Carousel
                arrows
                dotPosition="none"
                infinite={true}
                {...carouselSettings}
              >
                {(image || []).map((subImg, index) => (
                  <div className="left-image-img" key={index}>
                    <img
                      src={subImg}
                      alt={`Image ${index}`}
                      className={index === selectedIndex ? "selected" : ""}
                      onClick={() => {
                        setMainImage(subImg);
                        setSelectedIndex(index);
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            {/* <div className="left-details">
              <div className="left-details-header">
                Duration ⏰
                <span>
                  {"  "}
                  {serviceData.duration}
                </span>
              </div>
            </div> */}
          </div>
          <div className="servicesDetails__main-right">
            <div className="right-details">
              <div className="right-image">
                {mainImage && <img alt="Main" src={mainImage} />}
              </div>
              <div className="right-content">
                <h1>
                  <span>{serviceData.serviceName}</span>
                </h1>

                <div className="right-content-header">
                  <h2>
                    ✂️
                    <span>{serviceData.skillName}</span>
                  </h2>
                  <h2>
                    ⏰
                    <span>
                      {"  "}
                      {serviceData.duration}
                    </span>
                  </h2>
                </div>
                <div className="right-content-description">
                  {removePTags(serviceData.description)}
                </div>
                <div className="details-footer">
                  <h2>
                    💸<span>{formatCurrency(serviceData.price)}</span>
                  </h2>
                  <div className="servicesDetails-btn">
                    <button onClick={() => handleClick(serviceData.id)}>
                      🛒 Booking Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
