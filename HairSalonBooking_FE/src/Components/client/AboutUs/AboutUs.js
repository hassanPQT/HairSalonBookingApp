import "./AboutUs.scss";
import { video1 } from "../../../data/image";

export default function AboutUs() {
  return (
    <section className="about section">
      <div className="about__container">
        <h2 className="about__container-title">Why F-salon?</h2>
        <div className="mainContent container grid">
          <div className="about__single">
            <img
              src="https://icon-library.com/images/shop-icon-png/shop-icon-png-6.jpg"
              alt="Icon Branch"
            />
            <h2>2+ Branch</h2>
            <p>
              With over 2 branches nationwide, we are committed to providing
              exceptional hair and beauty services to our valued clients.
              Discover the convenience of our numerous locations and let us help
              you look and feel your best, wherever you are!
            </p>
          </div>
          <div className="about__single">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4661/4661125.png"
              alt="Icon Stylist"
            />
            <h3>20+ Stylist</h3>
            <p>
              Our team of over 400 skilled stylists is dedicated to delivering
              exceptional hair and beauty services tailored to your unique
              needs. With a diverse range of expertise, our professionals are
              here to transform your look and help you feel confident and
              beautiful.
            </p>
          </div>
          <div className="about__single">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10215/10215938.png"
              alt="Icon Customer"
            />
            <h3>1000+ Customer</h3>
            <p>
              Join over 2,000 satisfied customers who trust us with their hair
              and beauty needs. We prioritize your satisfaction above all else.
              Experience the difference with our skilled stylists and welcoming
              atmosphere that make every visit a delight!
            </p>
          </div>
        </div>

        <div className="about__video container">
          <div className="about__videoCard grid">
            <div className="about__cardText">
              <h2>Your Style, Our Passion!</h2>
              <p>
                At our salon, we are dedicated to providing exceptional hair and
                beauty services with a team of skilled professionals, ensuring
                every client leaves feeling beautiful and confident
              </p>
            </div>
            <div className="about__cardVideo">
              <video src={video1} autoPlay loop muted type="video/mp4"></video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
