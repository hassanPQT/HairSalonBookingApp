import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiScissorsFill } from "react-icons/ri";
import { FiDroplet } from "react-icons/fi";
import { PiHairDryerBold } from "react-icons/pi";
import { GiComb } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import "./PopularService.scss";
import api from "../../../config/axios";
import DOMPurify from "dompurify";

export default function PopularService() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const skillIconMap = {
    "Hair cutting": RiScissorsFill,
    "Curling hair": FiDroplet,
    "Hair straightening": GiComb,
    "Hair dye": PiHairDryerBold,
  };

  function formatPrice(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("service/newest");
        const data = response.data.result;
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchServices();
  }, []);

  const handleClick = (serviceId) => {
    sessionStorage.setItem("selectedServicesId", JSON.stringify([serviceId]));
    navigate("/booking/step1");
  };

  return (
    <section className="service container section">
      <div className="service__container">
        <div className="service__container-title">
          <h2>Newest Service</h2>
          <p>
            Discover our most sought-after services designed to enhance your
            beauty and leave you feeling fabulous. Whether you're looking for a
            refreshing haircut, vibrant hair color, or a rejuvenating treatment,
            we have something for everyone!
          </p>
        </div>

        <div className="mainContent grid">
          {(services || []).map((service) => (
            <div key={service.id} className="service__combo">
              <div className="service__combo-img">
                <img src={service.image} alt={service.serviceName} />
                <span className="service__combo-discount">Hot</span>
              </div>

              <div className="service__details">
                <div className="service__details-price flex">
                  <h4>{service.price && formatPrice(service.price)} VND</h4>
                </div>

                <div className="service__name flex">
                  <div className="service__name-single flex">
                    {service.skillName && React.createElement(skillIconMap[service.skillName])}
                    <small>{service.skillName}</small>
                  </div>
                </div>

                <small className="service__details-description">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(service.description || ""),
                    }}
                  />
                </small>

                <button
                  className="service__details-btn btn flex"
                  onClick={() => handleClick(service.id)}
                >
                  Booking Now
                  <FaArrowRight className="service__details-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
