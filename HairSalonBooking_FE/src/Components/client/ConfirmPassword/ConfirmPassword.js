import React, { useEffect, useState } from 'react';
import './ConfirmPassword.scss';
import api from '../../../config/axios';
import { message, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { eye, eye_off, logo_blue_noBackground } from '../../../data/image';

const ConfirmPassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user was verified
    if (!location.state?.verified) {
      navigate('/login/forgetPassword');
    }
  }, [location.state, navigate]);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.passwordConfirm.value;
    setLoading(true);

    try {
      const response = await api.post(`changePassword/${email}`, { 
        password: password,
        repassword: confirmPassword
      });
      if (response.data.code === 1000) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      <div className="confirm-password__container">
        <div className="confirm-password__left-side">
          <div className="confirm-password__logo">
          <img src={logo_blue_noBackground} alt="Arrow" />
          <h2>F-salon</h2>
          </div>
          <div className="confirm-password__illustration">
          <img
              src="https://firebasestorage.googleapis.com/v0/b/f-salon-51786.appspot.com/o/o_bg-remover-gen_2oQMxgffQbVQ8AXzDmMXCZbgwy2%20(1).png?alt=media&token=9e569b24-02d3-440c-86d7-b7861971bd55"
              alt="Illustration"
              style={{objectFit: "cover"}}
            />
          </div>
          <div className="confirm-password__title">
          </div>
        </div>
        <div className="confirm-password__right-side">
          <h1>Confirm Password</h1>
          <form className="confirm-password__form" onSubmit={handleSubmit}>
            <label htmlFor="password">New password</label>
            <div className="confirm-password__password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                required
              />
              <img
                src={passwordVisible ? eye_off : eye}
                alt="Eye Icon"
                onClick={handlePasswordVisibility}
              />
            </div>
            <label htmlFor="passwordConfirm">Confirm password</label>
            <div className="confirm-password__password-input">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="passwordConfirm"
                name="passwordConfirm"
                required
              />
              <img
                src={confirmPasswordVisible ? {eye_off} : {eye}}
                alt="Eye Icon"
                onClick={handleConfirmPasswordVisibility}
              />
            </div>
            <div className="confirm-password__flex-box">
              <button type="submit" className="confirm-password__log-in-button" disabled={loading}>
                {loading ? <Spin size="small" /> : "CONFIRM"} 
              </button>
            </div>
          </form>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default ConfirmPassword;
