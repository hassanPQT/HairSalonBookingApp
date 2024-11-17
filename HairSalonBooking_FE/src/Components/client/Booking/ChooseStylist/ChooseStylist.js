/* eslint-disable react-hooks/exhaustive-deps */
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { StarFilled } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiHome } from "react-icons/ci";
import { PiScissors } from "react-icons/pi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { SlPeople } from "react-icons/sl";

import "./ChooseStylist.scss";
import api from "../../../../config/axios";

export default function ChooseStylist() {
  const [selectedStylist, setSelectedStylist] = useState(null);
  const handleSelected = (stylist) => {
    setSelectedStylist(stylist);
  };
  const navigate = useNavigate();

  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    const storedBranchId = sessionStorage.getItem("selectedBranchId");
    const branchId = parseInt(storedBranchId, 10);

    const storedServices = sessionStorage.getItem("selectedServicesId");
    const serviceIds = JSON.parse(storedServices);

    const fetchStylists = async () => {
      const bookingValue = {
        salonId: branchId,
        serviceId: serviceIds,
      };

      try {
        const response = await api.post(`booking/stylists`, bookingValue);
        const data = response.data.result;
        if (data) {
          setStylists(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStylists();
  }, []);

  useEffect(() => {
    const isSelectedServices = sessionStorage.getItem("selectedServicesId");
    if (!isSelectedServices) {
      navigate("/booking/step2");
      const selectedBranchId = sessionStorage.getItem("selectedBranchId");
      if (!selectedBranchId) {
        navigate("/booking/step1");
      }
    }
  }, []);

  useEffect(() => {
    const storedStylistId = sessionStorage.getItem("selectedStylistId");
    const stylistId = parseInt(storedStylistId, 10);
    if (stylistId) {
      const stylist = stylists.find((s) => s.id === stylistId);
      if (stylist) {
        setSelectedStylist(stylist);
      }
    }
  }, [stylists]);

  const isSelectedStylist = !!sessionStorage.getItem("selectedStylistId");

  return (
    <>
      <div className="chooseStylist">
        <div className="chooseStylist__tagNavigation">
          <ul className="chooseStylist__tagNavigation--item">
            <li className="chooseStylist__tagNavigation--item-content">
              <Link to="/booking/step1">
                <div className="filled"></div>
                <CiHome />
              </Link>
              <div className="tooltip">Salon</div>
            </li>
            <li className="chooseStylist__tagNavigation--item-content">
              <Link to="/booking/step2">
                <div className="filled"></div>

                <PiScissors />
              </Link>
              <div className="tooltip">Service</div>
            </li>
            <li className="chooseStylist__tagNavigation--item-content active">
              <Link to="/booking/step3">
                <div className="filled"></div>

                <SlPeople />
              </Link>
              <div className="tooltip">Stylist</div>
            </li>
            <li
              className={`chooseStylist__tagNavigation--item-content ${
                isSelectedStylist ? "" : "disable"
              }`}
            >
              <Link
                to={isSelectedStylist ? "/booking/step4" : "/booking/step3"}
              >
                <div className="filled"></div>

                <RiCalendarScheduleLine />
              </Link>
              <div className="tooltip">Time</div>
            </li>
          </ul>
        </div>

        <div className="chooseStylist__container">
          <div className="chooseStylist__container-header">
            <Link to="/booking/step2">
              <FaArrowLeft className="chooseStylist-icon" />
            </Link>
            <h1>Choose Stylist</h1>
          </div>
          {selectedStylist ? (
            <>
              <div className="chooseStylist__container-name">
                <IoPersonOutline className="stylist-icon" />
                <h1>{selectedStylist.fullname}</h1>
              </div>
              <div className="chooseStylist__container-info">
                <p>Stylist: {selectedStylist.fullname}</p>
                <p>
                  {selectedStylist.feedbackScore / 2}
                  {"  "}
                  <StarFilled className="infor__rating" />
                </p>
                {/* <p className="infor__rating">
                  <span>
                    Cut {selectedStylist.rating.cut}
                    <FaStar className="infor__rating-icon" />(
                    {selectedStylist.customers.cut})
                  </span>
                </p>
                <p className="infor__rating">
                  <span>
                    Perm {selectedStylist.rating.perm}
                    <FaStar className="infor__rating-icon" />(
                    {selectedStylist.customers.perm})
                  </span>
                </p>
                <p className="infor__rating">
                  <span>
                    Dye {selectedStylist.rating.dye}
                    <FaStar className="infor__rating-icon" />(
                    {selectedStylist.customers.dye})
                  </span>
                </p> */}
              </div>
            </>
          ) : (
            <></>
          )}

          <Swiper
            className="chooseStylist__container-lists"
            slidesPerView={3}
            navigation={true}
            modules={[Navigation]}
          >
            {stylists.map((stylist) => (
              <SwiperSlide key={stylist.id}>
                <div
                  onClick={() => handleSelected(stylist)}
                  className={`chooseStylist__container-single ${
                    selectedStylist && selectedStylist.id === stylist.id
                      ? "selected"
                      : ""
                  }`}
                >
                  <img alt={stylist.fullname} src={stylist.image} />
                  <p>{stylist.fullname}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Link
            to="/booking/step4"
            className={`chooseStylist__container-btn btn flex ${
              !!selectedStylist ? "" : "btn-disable"
            }`}
            onClick={(e) => {
              if (!selectedStylist) {
                e.preventDefault();
              } else {
                sessionStorage.setItem("selectedStylistId", selectedStylist.id);
              }
            }}
          >
            Next Step
            <FaArrowRight className="chooseService-icon" />
          </Link>
        </div>
      </div>
    </>
  );
}
