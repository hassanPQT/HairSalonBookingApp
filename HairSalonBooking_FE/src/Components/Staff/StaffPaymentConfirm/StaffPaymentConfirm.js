/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "./StaffPaymentConfirm.scss";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../config/axios";

const StaffPaymentConfirm = () => {
  const formatPrice = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  const navigate = useNavigate();
  const handleOnclick = () => {
    navigate("/");
  };

  const location = useLocation();
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState(null);

  function parseVNPString(vnpString) {
    const params = new URLSearchParams(vnpString);
    return {
      vnp_BankCode: params.get("vnp_BankCode"),
      vnp_CardType: params.get("vnp_CardType"),
      vnp_ResponseCode: params.get("vnp_ResponseCode"),
      vnp_TxnRef: params.get("vnp_TxnRef"),
      vnp_Amount: Number(params.get("vnp_Amount"))
    };
  }

  const vnpString = location.search;
  const result = parseVNPString(vnpString);
  console.log(result);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await api.get(
          `payment/response?vnp_BankCode=${result.vnp_BankCode}&vnp_CardType=${result.vnp_CardType}&vnp_ResponseCode=${result.vnp_ResponseCode}&vnp_TxnRef=${result.vnp_TxnRef}`
        );
        const data = response.data;
        if (data) {
          setTransactionId(data.match(/Transaction ID:\s*(\d+)/)[1]);
        }
      } catch (error) {
        setError("Payment verification failed. Please try again.");
      }
    };

    fetchPayment();
  }, []);

  useEffect(() => {
    const checkout = async () => {
      if (!transactionId) return;

      try {
        const response = await api.put(`checkout?transactionId=${transactionId}`);
        const data = response.data.result;
        if (!data) {
          setError("Payment failed. Please try again.");
        }
      } catch (error) {
        setError("Payment processing failed. Please try again.");
      }
    };

    checkout();
  }, [transactionId]);

  return (
    <div className="payment-confirmation__body">
      <div className="payment-confirmation">
        {error ? (
          <div className="payment-confirmation__icon-container">
            <XCircle className="error-icon" color="red" size={64} />
          </div>
        ) : (
          <div className="payment-confirmation__icon-container">
            <CheckCircle className="check-icon" color="green" size={64} />
          </div>
        )}

        <h1 className="payment-confirmation__title">
          {error ? "PAYMENT FAILED" : "PAYMENT SUCCESSFUL"}
        </h1>

        <div className="payment-confirmation__details">
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              <p>
                Total amount: {formatPrice((result.vnp_Amount / 100).toString())} VND
              </p>
              <p>Payment method: VNPay</p>
            </>
          )}
        </div>

        <button
          className="payment-confirmation__dashboard-button"
          onClick={handleOnclick}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default StaffPaymentConfirm;
