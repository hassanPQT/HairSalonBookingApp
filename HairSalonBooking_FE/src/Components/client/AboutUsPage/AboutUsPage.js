import { FaQuoteLeft } from "react-icons/fa";

import React from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import {
  Swiper as AboutUsPageSwiper,
  SwiperSlide as AboutUsPageSwiperSlide,
} from "swiper/react";
import "./AboutUsPage.scss";
import feedback from "../../../data/feedback";
import { video2 } from "../../../data/image";
export default function AboutUsPage() {
  return (
    <>
      <div className="AboutUsPage">
        <section className="AboutUsPage__header">
          <h1>About Us</h1>
        </section>

        <section className="AboutUsPage__content">
          {/* <div class="AboutUsPage__container"> */}
          <div className="AboutUsPage__content-text">
            <h2>
              Discover F-Salon: Your Premier Destination for Style and
              Confidence
            </h2>
            <p>
              At F-Salon, we believe that a visit to the salon should be a
              transformative and uplifting experience. As a full-service hair
              studio, we are committed to delivering top-notch, personalized
              care that goes beyond a simple haircut. Our mission is to provide
              every guest with a place where they can unwind, explore new
              styles, and embrace the best version of themselves. Whether you’re
              here for a fresh cut, a complete color overhaul, or simply a trim,
              F-Salon is dedicated to making every appointment memorable and
              tailored to your unique style.
            </p>
            <p>
              With a team of highly skilled and passionate stylists, we are
              proud to offer a blend of creativity, precision, and warmth. Each
              of our professionals brings years of experience to the chair,
              combined with a dedication to staying up-to-date with the latest
              trends, techniques, and haircare innovations. We know that hair is
              an essential part of self-expression, and we take the time to
              understand each client’s individual needs, preferences, and
              lifestyle to ensure that you leave feeling refreshed, confident,
              and truly yourself.
            </p>

            {/* </div> */}
          </div>
          <div className="AboutUsPage__content-circle">
            <div className="loader">
              <img
                src="https://i.pinimg.com/564x/6c/c3/da/6cc3da6a664e9258f677c700547be76b.jpg"
                alt="banner"
                className="loader-image"
              />
              <div className="iconLoaderProgress">
                <svg
                  className="iconLoaderProgressFirst"
                  width="500"
                  height="500"
                >
                  <circle cx="250" cy="250" r="175"></circle>
                </svg>

                <svg
                  className="iconLoaderProgressSecond"
                  width="500"
                  height="500"
                >
                  <circle cx="250" cy="250" r="175"></circle>
                </svg>
              </div>
            </div>
          </div>
        </section>
        <div className="AboutUsPage__video">
          <div className="AboutUsPage__videoCard grid">
            <div className="AboutUsPage__cardText">
              <h2>Unmatched Quality in Every Service</h2>
              <p>
                At F-Salon, quality is at the heart of everything we do. We are
                committed to delivering exceptional services that exceed your
                expectations, from the moment you walk in until you leave with a
                look you love. Our team of professionals is dedicated to using
                only the finest products, techniques, and tools to ensure
                outstanding results with every visit.
              </p>
            </div>
            <div className="AboutUsPage__cardVideo">
              <video src={video2} autoPlay loop muted type="video/mp4"></video>
            </div>
          </div>
        </div>
        {/* <div className="AboutUsPage__container">
          <div className="AboutUsPage__container-title">
            See What Our Customer <div>Say About Us</div>
          </div>
        </div> */}
      </div>
      {/* 
      <AboutUsPageSwiper
        slidesPerView={1}
        spaceBetween={30}
        // loop={true}
        pagination={false}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="AboutUsPageSwiper"
      >
        <div className="AboutUsPage__container-testimonial">
          <div className=" AboutUsPage__main">
            {feedback.map((feed) => (
              <AboutUsPageSwiperSlide
                arrows
                infinite={false}
                key={feed.id}
                className="AboutUsPageSwiperSlide"
              >
                <FaQuoteLeft className="quote-icon" />
                <img alt="Avatar" height="80" src={feed.avatar} width="80" />
                <p>{feed.feedback}</p>
                <div className="testimonial-name">{feed.name}</div>
              </AboutUsPageSwiperSlide>
            ))}
          </div>
        </div>
      </AboutUsPageSwiper> */}
    </>
  );
}
