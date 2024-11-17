/* eslint-disable jsx-a11y/anchor-is-valid */
import { React } from "react";
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Footer.scss";
import { logo_blue_noBackground } from "../../../data/image";

export default function Footer() {
  const handleHomeClick = (e) => {
    // if (location.pathname === "/") {
    // e.preventDefault(); // Prevent navigation
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
    // }
  };

  return (
    <div className="footer ">
      <div className="footer__container container grid">
        <div>
          <div className="footer__Logo">
            <Link to="/" onClick={handleHomeClick} className=" flex">
              <h1 className="flex">
                <img src={logo_blue_noBackground} alt="logo" />
                F-Salon
              </h1>
            </Link>
          </div>
          <div className="footer__socials flex">
            <FaFacebookF className="footer__socials-icon" />
            <AiFillInstagram className="footer__socials-icon" />
            <FaTwitter className="footer__socials-icon" />
          </div>
        </div>

        <div className="footer__Links">
          <span className="footer__Links-linkTitle">Information</span>
          <li>
            <Link to="/" onClick={handleHomeClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to={"/aboutus"} onClick={handleHomeClick}>
              Explore
            </Link>
          </li>
          <li>
            <Link to={"/services"} onClick={handleHomeClick}>
              Service
            </Link>
          </li>
          <li>
            <Link to={"/contact"} onClick={handleHomeClick}>
              Contact
            </Link>
          </li>
        </div>
        <div className="footer__Links">
          <span className="footer__Links-linkTitle">Helpful Links</span>
          <li>
            <Link to={"/"} onClick={handleHomeClick}>
              Destination
            </Link>
          </li>
          <li>
            <Link to={"/contact"} onClick={handleHomeClick}>
              Support
            </Link>
          </li>
          <li>
            <Link to={""} onClick={handleHomeClick}>
              Service & Conditions
            </Link>
          </li>
          <li>
            <Link to={"/"} onClick={handleHomeClick}>
              Privacy
            </Link>
          </li>
        </div>
        <div className="footer__Links">
          <span className="footer__Links-linkTitle">Contact Us</span>
          <span className="phone">+444 555 666</span>
          <span className="email">abcd@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
