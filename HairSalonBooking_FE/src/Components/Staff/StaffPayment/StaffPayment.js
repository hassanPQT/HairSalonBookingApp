/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./StaffPayment.scss";
import api from "../../../config/axios";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Swal from "sweetalert2";

const paymentMethod = [
  {
    id: "1",
    name: "Cash",
  },
  {
    id: "2",
    name: "VNPay",
  },
];

const StaffPayment = () => {
  const { bookingId } = useParams();
  const [services, setServices] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [finish, setFinish] = useState([]);

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await api.get(endpoint);
        if (response.data) {
          setter(response.data.result);
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchData("service", setServices);
    fetchData("vouchers", setVouchers);
  }, []);

  useEffect(() => {
    const fetchFinish = async () => {
      try {
        const response = await api.post(`${bookingId}/finish`);
        const data = response.data.result;
        if (data) {
          if (data.voucher) {
            const foundVoucher = vouchers.find(
              (item) => item.code === data.voucher
            );
            setDiscountAmount(Number(foundVoucher.discountAmount));
          }
          setSubtotal(data.totalAmount);
          setFinish(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFinish();
  }, []);

  const handlePaymentChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const formatPrice = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleConfirm = () => {
    if (selectedMethod === "Cash") {
      handleCashPayment();
    } else if (selectedMethod === "VNPay") {
      handleVNPayPayment();
    }
  };
  const navigate = useNavigate();
  const handleCashPayment = async () => {
    try {
      const response = await api.put(`checkout?bookingId=${bookingId}`);
      const data = response.data.result;
      if (data) {
        Swal.fire({
          icon: "success",
          title: data,
          timer: 2500,
        });
        navigate("/staff/booking/complete");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPay = async () => {
    try {
      const response = await api.get(`Pay/${bookingId}`);
      // const paymentUrl = response.data;
      return response.data;
      // window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);
    }
  };

  const handleVNPayPayment = async () => {
    const paymentUrl = await fetchPay();
    const totalAmount =
      discountAmount > 0
        ? Math.floor(subTotal - (subTotal * discountAmount) / 100)
        : subTotal;

    navigate("/payment/VNPay", {
      state: { paymentUrl, totalAmount, bookingId },
    });
  };

  const roundToNearestThousand = (amount) => {
    return Math.round(amount / 1000) * 1000;
  };

  return (
    <>
      <div className="staff-payment">
        <div className="staff-payment__container">
          <div className="staff-payment__left">
            <h2>Booking Information</h2>
            <div className="staff-payment__form-section">
              <div className="staff-payment__form-grid">
                <div className="staff-payment__form-grid staff-payment__form-grid--half-width">
                  <div className="staff-payment__form-group">
                    <label
                      htmlFor="customerName"
                      className="staff-payment__label"
                    >
                      Customer Name:
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      className="staff-payment__input"
                      placeholder="Customer Name"
                      defaultValue={finish.customerName}
                      disabled
                    />
                  </div>
                  <div className="staff-payment__form-group">
                    <label
                      htmlFor="voucherCode"
                      className="staff-payment__label"
                    >
                      Voucher Code:
                    </label>
                    <input
                      type="text"
                      id="voucherCode"
                      className="staff-payment__input"
                      placeholder="Voucher Code"
                      defaultValue={finish.voucher}
                      disabled
                    />
                  </div>
                </div>
                <div className="staff-payment__form-grid staff-payment__form-grid--half-width">
                  <div className="staff-payment__form-group">
                    <label
                      htmlFor="customerName"
                      className="staff-payment__label"
                    >
                      Stylist Name:
                    </label>
                    <input
                      type="text"
                      id="stylistName"
                      className="staff-payment__input"
                      placeholder="Stylist Name"
                      defaultValue={finish.stylistName}
                      disabled
                    />
                  </div>
                  <div className="staff-payment__form-group">
                    <label
                      htmlFor="bookingDate"
                      className="staff-payment__label"
                    >
                      Booking Date:
                    </label>
                    <input
                      type="text"
                      id="bookingDate"
                      className="staff-payment__input"
                      placeholder="Booking Date"
                      defaultValue={formatDateString(finish.bookingDate)}
                      disabled
                    />
                  </div>
                </div>
                <div
                  className="staff-payment__form-grid
                staff-payment__form-grid--full-width"
                >
                  <div className="staff-payment__form-group staff-payment__form-group--full-width">
                    <label htmlFor="salon" className="staff-payment__label">
                      Salon:
                    </label>
                    <input
                      type="text"
                      id="salon"
                      className="staff-payment__input"
                      placeholder="Salon"
                      defaultValue={finish.salonAddress}
                      disabled
                    />
                  </div>
                </div>

                <div className="staff-payment__form-grid staff-payment__form-grid--full-width">
                  <div className="staff-payment__form-group">
                    <label htmlFor="time" className="staff-payment__label">
                      Payment Method:
                    </label>
                    <div className="staff-payment__slots-list">
                      {(paymentMethod || []).map((item, index) => (
                        <label
                          key={index}
                          className={`staff-payment__slots-option`}
                        >
                          <input
                            type="radio"
                            name="time"
                            value={item.name}
                            onChange={handlePaymentChange}
                            className={`staff-payment__radio`}
                          />
                          <span>{item.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="staff-payment__right">
            <h2>Booking Summary</h2>
            <div className="staff-payment__booking-summary">
              {(finish.services || []).map((item, index) => (
                <React.Fragment key={index}>
                  <div className="staff-payment__booking-item">
                    <img alt={item.serviceName} src={item.image} />
                    <div className="staff-payment__booking-item--details">
                      <div>{item.serviceName}</div>
                    </div>
                    <div className="staff-payment__booking-item--price">
                      {formatPrice(item.price)} VND
                    </div>
                  </div>
                  {index < services.length && <hr />}
                </React.Fragment>
              ))}
              <div className="staff-payment__booking-summary--totals">
                <div>Subtotal</div>
                <div>{formatPrice(subTotal)} VND</div>
              </div>
              <div className="staff-payment__booking-summary--totals">
                <div>Discount Amount</div>
                <div>{discountAmount}%</div>
              </div>
              <div className="staff-payment__booking-summary--totals">
                <div>Total (VND)</div>
                <div>
                  {formatPrice(
                    roundToNearestThousand(
                      discountAmount > 0
                        ? Math.floor(
                            subTotal - (subTotal * discountAmount) / 100
                          )
                        : subTotal
                    )
                  )}{" "}
                  VND
                </div>
              </div>
              <div className="staff-payment__confirm-booking">
                <button onClick={handleConfirm}>Confirm Payment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffPayment;
