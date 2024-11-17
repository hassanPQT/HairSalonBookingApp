/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./StaffVNPayQR.scss";
import { QRCode, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import Swal from "sweetalert2";

const StaffVNPayQR = () => {
    const location = useLocation();
    const { paymentUrl, bookingId, totalAmount } = location.state || {}; 
    const navigate = useNavigate();
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const formatPrice = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };
    
      useEffect(() => {
        const checkComplete = async () => {
          if (isPaymentSuccessful) return;

          try {
            const response = await api.get(`booking/status/${bookingId}`);
            const data = response.data.result;
            if (data && data === "true") {
              setIsPaymentSuccessful(true);
              const result = await Swal.fire({
                  icon: "success",
                  title: "Payment successfully.",
                  confirmButtonText: "OK",
                  showCancelButton: false,
                  willClose: () => {
                    navigate("/staff/booking/complete");
                  },
              });
              if (result.isConfirmed) {
                  navigate("/staff/booking/complete");
              }
          }
          } catch (error) {
            console.error(error);
          }
        };
    
        checkComplete();
    
        const intervalId = setInterval(checkComplete, 2000);
    
        return () => clearInterval(intervalId);
      }, [isPaymentSuccessful]);


  return (
    <div className="StaffVNPayQR__container">
      <div className="StaffVNPayQR__title">INVOICE PAYMENT:  #{bookingId ? bookingId : ""}!</div>
      <div className="StaffVNPayQR__amount">Payment amount: {totalAmount ? formatPrice(totalAmount) : ""} VND</div>
      <div className="StaffVNPayQR__qr-code">
      <Space>
        <QRCode type="canvas" value={paymentUrl} />
      </Space>
      </div>
    </div>
  );
};

export default StaffVNPayQR;
