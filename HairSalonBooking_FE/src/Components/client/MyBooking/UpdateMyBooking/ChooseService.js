/* eslint-disable react-hooks/exhaustive-deps */
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { LuClock } from "react-icons/lu";
import { Modal } from "antd";
import Skeleton from "@mui/material/Skeleton";
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import api from "../../../../config/axios";
import DOMPurify from "dompurify";
import "./UpdateMyBooking.scss";
import { bookingIdContext } from "../MyBooking";

export function ChooseService({ onNext, onPre }) {
  const [voucher, setVoucher] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectVoucherId, setSelectVoucherId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [services, setServices] = useState([]);
  const [searchResults, setSearchResults] = useState(services);
  const [areServicesHidden, setAreServicesHidden] = useState(false);
  const inputRef = useRef(null);
  const bookingId = useContext(bookingIdContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedService = sessionStorage.getItem("selectedServicesId");
 
    if (storedService) {
      setSelectedServices(JSON.parse(storedService));
    }
  }, [services]);
  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("service");
        if (response.data) {
          // setServices(response.data);
          setServices(response.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  // Search services based on the search value
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults(services);
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get(`users/search`, {
          params: { q: searchValue, type: "less" },
        });
        if (response.data && response.data.data) {
          setSearchResults(response.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, [searchValue, services]);

  // Fetch booking history
  useEffect(() => {
    setLoading(true);
    const fetchBooking = async () => {
      // const storedService = sessionStorage.getItem("selectedServicesId");
      // console.log(storedService);
      // if (!storedService) {
      try {
        const response = await api.get(`booking/${bookingId}`);
        const data = response.data.result;
        if (data) {
          setSelectedServices(data.serviceId);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
      // } else {
      //   setSelectedServices(JSON.parse(storedService));
      // }
    };
    fetchBooking();
  }, [bookingId, services]);

  // Fetch vouchers
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await api.get("voucher");
        if (response.data) {
          // setVoucher(response.data);
          setVoucher(response.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVoucher();
  }, []);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    inputRef.current.focus();
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
  };

  const isServiceSelected = (serviceId) => {
    return selectedServices.includes(serviceId);
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const calculateTotalDuration = () => {
    if (selectedServices.length === 0) return "";

    const totalMinutes = selectedServices.reduce((total, id) => {
      const service = services.find((service) => service.id === id);
      if (service) {
        const [hours, minutes] = service.duration.split(":").map(Number);
        return total + hours * 60 + minutes;
      }
      return total;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}`;
    } else if (hours > 0) {
      return `${hours} hour`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":").map(Number);

    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}`;
    } else if (hours === 1) {
      return `${hours} hour`;
    } else if (hours > 1) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleVoucher = (voucher) => {
    setSelectVoucherId(voucher.id);
    setIsModalOpen(false);
    sessionStorage.setItem("selectedVoucherId", voucher.id);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const selectedVoucher = voucher.find((v) => {
    const storedVoucherId = sessionStorage.getItem("selectedVoucherId");
    return !storedVoucherId
      ? v.id === selectVoucherId
      : v.id === storedVoucherId;
  });

  return (
    <div className="myBooking__service">
      <div className="myBooking__service-left">
        <div className="myBooking__service-header">
          <div onClick={onPre}>
            <FaArrowLeft className="myBooking__service-icon" />
          </div>
          <h1>Choose Service</h1>
        </div>
        <div className="myBooking__service-search">
          <IoSearchOutline className="myBooking__service-icon" />
          <input
            ref={inputRef}
            placeholder="Search for services..."
            value={searchValue}
            onChange={handleChange}
          />
          <IoCloseCircle
            className="myBooking__service-closeIcon"
            onClick={handleClearSearch}
            aria-label="Clear search"
          />
        </div>
        <div className="myBooking__service-locations">
          F-Salon has the following services:
        </div>

        <div className="myBooking__service-lists">
          {loading
            ? 
              [...Array(3)].map((_, index) => (
                <div item xs={12} md={6} key={index}>
                  <Skeleton variant="rectangular" height={250} width={400} />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              ))
            : searchResults.map((service) => (
                <div key={service.id} className="myBooking__service__card">
                  <img alt="service banner" src={service.image} />
                  <div className="card__content">
                    <h2>{service.serviceName}</h2>
                    <div className="card__content-time">
                      <LuClock className="card-icon" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(service.description || ""),
                      }}
                    />
                    <div className="card__content-action">
                      <div className="card__content-price">
                        Price: {formatCurrency(service.price)}
                      </div>
                      <button
                        className={`card__content-add ${
                          isServiceSelected(service.id) ? "disabled" : ""
                        }`}
                        onClick={() => {
                          if (!isServiceSelected(service.id)) {
                            setSelectedServices((prev) => [
                              ...prev,
                              service.id,
                            ]); // Store only ID
                          }
                        }}
                        disabled={isServiceSelected(service.id)}
                      >
                        {isServiceSelected(service.id)
                          ? "Added"
                          : "Add service"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className="myBooking__service-right">
        <div className="myBooking__service-footer">
          {/* <div className="footer__hidden" onClick={toggleServicesHidden}>
            {areServicesHidden ? (
              <>
                <FaAngleDoubleUp />
                <span>Show selected services</span>
                <FaAngleDoubleUp />
              </>
            ) : (
              <>
                <FaAngleDoubleDown />
                <span>Hide selected services</span>
                <FaAngleDoubleDown />
              </>
            )}
          </div> */}
          <h1>Your service</h1>
          <div className="footer__services">
            {selectedServices.map((serviceId, index) => {
              const service = services.find(
                (service) => service.id === serviceId
              );
              return (
                service && (
                  <div
                    key={index}
                    className={`footer__service ${
                      areServicesHidden ? "hidden" : ""
                    }`}
                  >
                    <span className="footer__service-name">
                      {service.serviceName}
                    </span>

                    <div>
                      <span className="footer__service-price">
                        {formatCurrency(service.price)}
                      </span>
                      <IoIosCloseCircle
                        className="footer__service-icon"
                        onClick={() => handleRemoveService(serviceId)} // Pass the service ID
                      />
                    </div>
                  </div>
                )
              );
            })}
          </div>
          <div className="footer__payment">
            <div className="footer__promo">
              <span onClick={showModal} className="footer__promo-action">
                Voucher
              </span>
              <span>
                {selectedVoucher ? selectedVoucher.code : "No voucher selected"}
              </span>
            </div>

            <div className="footer__pay">
              <div className="footer__pay-content">
                <span className="footer__pay-services">
                  Selected services : {selectedServices.length}
                </span>
                <span className="footer__pay-services">
                  Total Duration : {calculateTotalDuration() || "0"}
                </span>
              </div>
              <span className="footer__pay-services">
                Pay :{" "}
                {formatCurrency(
                  (selectedServices || []).reduce((total, serviceId) => {
                    const service = services.find(
                      (service) => service.id === serviceId
                    );
                    return total + (service ? service.price : 0);
                  }, 0)
                )}
              </span>
              <span className="footer__pay-services">
                Discount :{" "}
                {selectedVoucher ? selectedVoucher.discountAmount : 0}%
              </span>
              <span className="footer__pay-services">
                Total Pay :{" "}
                {formatCurrency(
                  (selectedServices || []).reduce((total, serviceId) => {
                    const service = services.find(
                      (service) => service.id === serviceId
                    );
                    return total + (service ? service.price : 0);
                  }, 0) *
                    (1 -
                      (selectedVoucher
                        ? selectedVoucher.discountAmount / 100
                        : 0)) // Apply discount
                )}
              </span>
            </div>
            <button
              className="myBooking__service-btn btn flex"
              onClick={(e) => {
                onNext();
                if (selectedServices.length === 0) {
                  e.preventDefault();
                } else {
                  sessionStorage.setItem(
                    "selectedServicesId",
                    JSON.stringify(selectedServices) // Store only IDs
                  );
                }
              }}
            >
              Next Step
              <FaArrowRight className="myBooking__salon-icon" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="voucher__modal">
          <h1>Choose voucher</h1>
          <div className="voucher__modal-lists">
            {voucher.map((item) => (
              <div
                key={item.id}
                className="voucher-item"
                onClick={() => handleVoucher(item)}
              >
                <h3>{item.code}</h3>
                <p>Name: {item.name}</p>
                <p>Discount amount: {item.discountAmount}%</p>
                <p>Quantity: {item.quantity}</p>
                <p>Expiry date: {formatDateString(item.expiryDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
