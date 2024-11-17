import { useState, useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";

import "./Services.scss";

export default function Services() {
  const [serviceData, setServiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const handleClick = (serviceId) => {
    navigate(`/details`, { state: { serviceId } });
  };

  useEffect(() => {
    fetchServiceData(currentPage);
  }, [currentPage]);

  const fetchServiceData = async (page) => {
    try {
      const response = await api.get(`service/page?page=${page}&size=4`);

      const data = response.data?.result?.content || [];
      const total = response.data?.result?.totalPages || 0;
      setServiceData(data);
      setTotalPages(total);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleHomeClick = (e) => {
    navigate("/");
    e.preventDefault(); // Prevent navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  return (
    <>
      <div className="services">
        <div className="services__header">
          <h1>OUR SERVICES</h1>
        </div>
        <div className="services__container">
          <div className="services__container-cards">
            <div className="card-list">
              {(serviceData || []).map((serD) => (
                <div
                  className="card"
                  key={serD.id}
                  onClick={() => handleClick(serD.id)}
                >
                  <div className="top-section">
                    <img src={serD.image} alt="Service" />
                    <div className="icons">
                      <div className="logo">
                        <MdArrowOutward className="direction-icon" />
                      </div>
                    </div>
                  </div>
                  <div className="bottom-section">
                    <span className="title">{serD.serviceName}</span>
                    <div className="row row1">
                      <div className="item">
                        <span className="big-text">{serD.skillName}</span>
                        <span className="regular-text">Skill</span>
                      </div>
                      <div className="item">
                        <span className="big-text">{serD.duration}</span>
                        <span className="regular-text">Duration</span>
                      </div>
                      <div className="item">
                        <span className="big-text">
                          {formatCurrency(serD.price)}
                        </span>
                        <span className="regular-text">Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="manager-stylist__pagination">
          <p>
            Showing {currentPage * 4 + 1} -{" "}
            {Math.min((currentPage + 1) * 4, serviceData.length)} from{" "}
            {serviceData.length} data
          </p>
          <div className="manager-stylist__pagination-pages">
            <span
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 0 ? "disabled" : ""}
            >
              <FaAngleLeft className="pagination-icon" />
            </span>
            {[...Array(totalPages)].map((_, index) => (
              <span
                key={index}
                onClick={() => handlePageChange(index)}
                className={currentPage === index ? "active" : ""}
              >
                {index + 1}
              </span>
            ))}
            <span
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages - 1 ? "disabled" : ""}
            >
              <FaChevronRight className="pagination-icon" />
            </span>
          </div>
        </div>

        <div className="services__footer" onClick={handleHomeClick}>
          <div className="grid-item item1">
            <h2>Latest Work</h2>
            <p>#fsalon</p>
          </div>
          <div className="grid-item item2">
            <h2>Summer Essentials</h2>
            <p>Discover</p>
          </div>
          <div className="grid-item item3">
            <h2>Explore great</h2>
            <p>saving</p>
          </div>
          <div className="grid-item item4">
            <h2>Discounts</h2>
            <p>& offers</p>
          </div>
          <div className="grid-item item5">
            <h2>Attention</h2>
            <p>to Details</p>
          </div>
        </div>
      </div>
    </>
  );
}
