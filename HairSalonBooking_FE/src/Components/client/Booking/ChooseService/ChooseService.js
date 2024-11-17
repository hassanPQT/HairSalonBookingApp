/* eslint-disable react-hooks/exhaustive-deps */
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { CiHome } from "react-icons/ci";
import { PiScissors } from "react-icons/pi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { SlPeople } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import "./ChooseService.scss";

import api from "../../../../config/axios";
import DOMPurify from "dompurify";

export default function ChooseService() {
  const [selectVoucher, setSelectVoucher] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedService, setSelectedService] = useState([]);
  const [services, setServices] = useState([]);
  const [searchResults, setSearchResults] = useState(services);
  const [areServicesHidden, setAreServicesHidden] = useState(false);
  const [voucher, setVoucher] = useState([]);
  const inputRef = useRef(null);

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // useEffect(() => {
  //   const selectedBranchId = sessionStorage.getItem("selectedBranchId");
  //   if (!selectedBranchId) {
  //     navigate("/booking/step1");
  //   }
  // }, []);

  const handleVoucher = (voucher) => {
    setSelectVoucher(voucher);
    sessionStorage.setItem('selectedVoucherId', voucher.id);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedVoucher = sessionStorage.getItem('selectedVoucherId');
    if (storedVoucher) {
      const voucherId = JSON.parse(storedVoucher);
      const selectedVoucher = voucher.find(v => v.id === voucherId);
      if (selectedVoucher) {
        setSelectVoucher(selectedVoucher);
      }
    } 
  }, [voucher]);

  useEffect(() => {
    const storedServices = sessionStorage.getItem("selectedServicesId");
    if (storedServices) {
      const serviceIds = JSON.parse(storedServices);
      const selected = services.filter((service) =>
        serviceIds.includes(service.id)
      );
      setSelectedService(selected);
    }
  }, [services]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get("service");
        if (response.data && response.data.result) {
          setServices(response.data.result);
          setSearchResults(response.data.result);
        }
      } catch (error) {}
    };
    fetchService();
  }, []);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await api.get("voucher");
        const data = response.data.result;
        if (data) {
          setVoucher(data);
        }
      } catch (error) {}
    };
    fetchVoucher();
  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults(services);
      return;
    }

    const fetchServices = async () => {
      const value = {
        name: searchValue,
      };
      try {
        const response = await api.post(`service/searchByName`, value);
        const data = response.data.result;
        if (data) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [searchValue]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleRemoveService = (serviceToRemove) => {
    setSelectedService((prev) =>
      prev.filter((service) => service.id !== serviceToRemove.id)
    );
  };

  const handleClick = () => {
    setSearchValue("");
    inputRef.current.focus();
  };

  const isServiceSelected = (serviceId) => {
    return selectedService.some((service) => service.id === serviceId);
  };

  const isSelectedServices = !!sessionStorage.getItem("selectedServicesId");
  const isSelectedStylist = !!sessionStorage.getItem("selectedStylistId");

  const [modalContent, setModalContent] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const calculateTotalDuration = () => {
    if (selectedService.length === 0) return "";

    const totalMinutes = selectedService.reduce((total, service) => {
      const [hours, minutes] = service.duration.split(":").map(Number);
      return total + hours * 60 + minutes;
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
    }else if (hours > 1) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  
  return (
    <div className="chooseServices">
      <div className="chooseService">
        <div className="chooseService__tagNavigation">
          <ul className="chooseService__tagNavigation--item">
            <li className="chooseService__tagNavigation--item-content">
              <Link to="/booking/step1" aria-label="Select Salon">
                <div className="filled"></div>
                <CiHome />
              </Link>
              <div className="tooltip">Salon</div>
            </li>
            <li className="chooseService__tagNavigation--item-content active">
              <Link to="/booking/step2" aria-label="Select Service">
                <div className="filled"></div>
                <PiScissors />
              </Link>
              <div className="tooltip">Service</div>
            </li>
            <li
              className={`chooseService__tagNavigation--item-content ${
                isSelectedServices ? "" : "disable"
              }`}
            >
              <Link
                to={isSelectedServices ? "/booking/step3" : "/booking/step2"}
                aria-label="Select Stylist"
              >
                <div className="filled"></div>
                <SlPeople />
              </Link>
              <div className="tooltip">Stylist</div>
            </li>
            <li
              className={`chooseService__tagNavigation--item-content ${
                (isSelectedStylist && isSelectedServices) ? "" : "disable"
              }`}
            >
              <Link
                to={(isSelectedStylist && isSelectedServices) ? "/booking/step4" : "/booking/step2"}
                aria-label="Select Time"
              >
                <div className="filled"></div>
                <RiCalendarScheduleLine />
              </Link>
              <div className="tooltip">Time</div>
            </li>
          </ul>
        </div>

        <div className="chooseService__container">
          <div className="chooseService__container-left">
            <div className="chooseService__container-header">
              <Link to="/booking/step1">
                <FaArrowLeft className="chooseService-icon" />
              </Link>
              <h1>Choose service</h1>
            </div>
            <div className="chooseService__container-search">
              <IoSearchOutline className="chooseService-icon" />
              <input
                ref={inputRef}
                placeholder="Search for services..."
                value={searchValue}
                onChange={handleChange}
              />
              <IoCloseCircle
                className="chooseService-closeIcon"
                onClick={handleClick}
              />
            </div>
            <div className="chooseService__container-locations">
              F-Salon has the following services :
            </div>
            <div className="chooseService__container-lists">
              {searchResults &&
                searchResults.map((service) => (
                  <div key={service.id} className="chooseService__card">
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
                              setSelectedService((prev) => [...prev, service]);
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
          <div className="chooseService__container-right">
            <div className="chooseService__container-footer">
              {/* <div className="footer__hidden" onClick={handleHidden}>
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
                {selectedService.map((service, index) => (
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
                        onClick={() => handleRemoveService(service)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="footer__payment">
                <div className="footer__promo">
                  <button
                    onClick={showModal}
                    className="footer__promo-action btn"
                  >
                    Voucher
                  </button>
                  <span>{selectVoucher.code}</span>
                </div>

                <div className="footer__pay">
                  <div className="footer__pay-content">
                    <span className="footer__pay-services">
                      Selected services : {selectedService.length}
                    </span>
                    <span className="footer__pay-services">
                      Total Duration : {calculateTotalDuration() || "0"}
                    </span>
                  </div>
                  <span className="footer__pay-services">
                    Pay :{" "}
                    {formatCurrency(
                      (selectedService || []).reduce(
                        (total, service) => total + service.price,
                        0
                      )
                    )}
                  </span>
                  <span className="footer__pay-services">
                    Discount : {selectVoucher.discountAmount}
                    {"%"}
                  </span>
                  <span className="footer__pay-services">
                    Total Pay :{" "}
                    {formatCurrency(
                      (selectedService || []).reduce((total, service) => {
                        return total + service.price;
                      }, 0) *
                        (1 -
                          (selectVoucher
                            ? selectVoucher.discountAmount / 100
                            : 0)) // Apply discount
                    )}
                  </span>
                </div>
                <Link
                  to="/booking/step3"
                  className={`chooseService__container-btn btn flex ${
                    selectedService.length === 0 ? "btn-disable" : ""
                  }`}
                  onClick={(e) => {
                    if (selectedService.length === 0) {
                      e.preventDefault();
                    } else {
                      const selectedServiceIds = selectedService.map(
                        (service) => service.id
                      );
                      sessionStorage.setItem(
                        "selectedServicesId",
                        JSON.stringify(selectedServiceIds)
                      );
                    }
                  }}
                >
                  Next Step
                  <FaArrowRight className="chooseService-icon" />
                </Link>
              </div>
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
    </div>
  );
}
