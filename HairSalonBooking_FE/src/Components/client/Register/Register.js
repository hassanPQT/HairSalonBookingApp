import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import "./Register.scss";
import { message, Spin } from "antd";
import { eye, eye_off, logo_blue_noBackground } from "../../../data/image";

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const userName = e.target[1].value;
    const fullName = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;
    const phoneNumber = e.target[5].value;
    setLoading(true);

    try {
      const response = await api.post("register", {
        email: email,
        username: userName,
        fullname: fullName,
        password: password,
        confirmpassword: confirmPassword,
        phone: phoneNumber
      });

      if (response) {
        messageApi.open({
            type: 'success',
            content: 'Registration successful! Please sign in.',
          });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
      {contextHolder}
      <div className="signup__container">
        <div className="signup__left-side">
          <div className="signup__logo">
          <img src={logo_blue_noBackground} alt="Arrow" />
          <h2>F-salon</h2>
          </div>
          <div className="signup__illustration">
          <img
              src="https://firebasestorage.googleapis.com/v0/b/f-salon-51786.appspot.com/o/o_bg-remover-gen_2oQMxgffQbVQ8AXzDmMXCZbgwy2%20(1).png?alt=media&token=9e569b24-02d3-440c-86d7-b7861971bd55"
              alt="Illustration"
              style={{objectFit: "cover"}}
            />
          </div>
          <div className="signup__title">
          </div>
        </div>
        <div className="signup__right-side">
          <h1>Sign Up</h1>
          <form className="signup__form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" required id="email" />
            <label htmlFor="userName">User name</label>
            <input type="text" required id="userName" />
            <label htmlFor="fullName">Full name</label>
            <input type="text" required id="fullName" />
            <label htmlFor="password">Password</label>
            <div className="signup__password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                required
              />
              <img
               src={passwordVisible ? eye_off : eye}
                alt="Eye Icon"
                onClick={handlePasswordVisibility}
              />
            </div>
            <label htmlFor="passwordConfirm">Confirm password</label>
            <div className="signup__password-input">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="passwordConfirm"
                required
              />
              <img
                src={confirmPasswordVisible ? eye_off : eye}
                alt="Eye Icon"
                onClick={handleConfirmPasswordVisibility}
              />
            </div>
            <label htmlFor="phoneNumber">Phone number</label>
            <input type="tel" required id="phoneNumber" />
            <div className="signup__flex-box">
              <div className="signup__checkbox">
                <input type="checkbox" id="terms-conditions" required />
                <label htmlFor="terms-conditions">I accept the terms & Conditions</label>
              </div>
              <button
                type="submit"
                className="signup__log-in-button"
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Sign Up"}
              </button>
            </div>
            <p className="signup__sign-up">Own an Account yet? <Link to='/login'>LOGIN</Link></p>
          </form>
        </div>
      </div>
      </>
    </>
  );
};

export default Register;
