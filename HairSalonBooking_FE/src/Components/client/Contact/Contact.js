/* eslint-disable jsx-a11y/iframe-has-title */
import { LuPhone, LuMail } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";

import "./Contact.scss";

export default function Contact() {
  return (
    <>
      <div className="contact">
        <section className="contact__banner">
          <h1>Contact Information</h1>
          <p>
            We’d love to hear from you! Whether you have questions about our
            services, want to book an appointment, or just want to learn more
            about F-Salon, our team is here to help. Please feel free to reach
            out using any of the methods below, and we’ll get back to you as
            soon as possible.
          </p>
        </section>

        <section className="contact__container">
          <div className="container__info">
            <div className="container__info-item">
              <LuPhone className="contact-icon" />
              <p>
                Phone Number
                <br />
                <strong>+123 4567 7896</strong>
              </p>
            </div>
            <div className="container__info-item">
              <LuMail className="contact-icon" />
              <p>
                Email Address
                <br />
                <strong>example@gmail.com</strong>
              </p>
            </div>
            <div className="container__info-item">
              <IoLocationOutline className="contact-icon" />
              <p>
                Location
                <br />
                <strong>123 Business Avenue, NYC</strong>
              </p>
            </div>
          </div>

          <div className="container__form">
            <h2>Send Us a Message</h2>
            <p>
              Questions or need help? Fill out the form, and we’ll reply
              shortly!
            </p>
            <form>
              <input type="text" placeholder="Your name" />
              <input type="email" placeholder="Email address" />
              <input type="text" placeholder="Phone number" />
              <input type="text" placeholder="Subject" />
              <textarea rows="5" placeholder="Message"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>

        <section className="contact__map">
          <h2>Find Us on Google Maps</h2>
          <p>
            Discover our location easily on Google Maps! Simply click the link
            below to get directions to F-Salon and plan your visit. We can’t
            wait to see you!
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d111712.0863672117!2d106.72314450848583!3d10.848130864058845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zbmjDoCB0aHXhu5FjIGxvbmcgY2jDonU!5e0!3m2!1svi!2s!4v1727451316132!5m2!1svi!2s"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </section>
      </div>
    </>
  );
}
