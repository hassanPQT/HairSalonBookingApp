import React, { useState } from "react";
import "./ManagerCustomer.scss";
import { Link } from "react-router-dom";

const ManagerCustomer = () => {
  const initialOrders = [
    {
      id: "#5331",
      img: "https://enlink.themenate.net/assets/images/avatars/thumb-2.jpg",
      customer: "Erin Gonzales",
      date: "8 May 2019",
      amount: "$137.00",
      status: "approved",
    },

    {
      id: "#5333",
      img: "https://enlink.themenate.net/assets/images/avatars/thumb-6.jpg",
      customer: "Alice Johnson",
      date: "10 May 2019",
      amount: "$89.50",
      status: "rejected",
    },
    {
      id: "#5332",
      img: "https://enlink.themenate.net/assets/images/avatars/thumb-4.jpg",
      customer: "John Smith",
      date: "9 May 2019",
      amount: "$250.00",
      status: "pending",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortBy = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }
    setSortConfig({ key, direction });

    let sortedOrders;
    if (direction === null) {
      sortedOrders = [...initialOrders];
    } else {
      sortedOrders = [...orders].sort((a, b) => {
        if (key === "amount") {
          return direction === "ascending"
            ? parseFloat(a[key].replace("$", "")) -
                parseFloat(b[key].replace("$", ""))
            : parseFloat(b[key].replace("$", "")) -
                parseFloat(a[key].replace("$", ""));
        }
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setOrders(sortedOrders);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") return " ▲";
      if (sortConfig.direction === "descending") return " ▼";
    }
    return "";
  };

  return (
    <div className="manager-customer">
      <div className="manager-customer__container">
        <div className="manager-customer__breadcrumb">
          <Link to="#" className="manager-customer__breadcrumb-link">
            Dashboard
          </Link>{" "}
          &gt;
          <Link to="#" className="manager-customer__breadcrumb-link">
            Apps
          </Link>{" "}
          &gt;
          <Link to="#" className="manager-customer__breadcrumb-link">
            E-commerce
          </Link>{" "}
          &gt;
          <span className="manager-customer__breadcrumb-current">Booking</span>
        </div>
        <div className="manager-customer__content">
          <table className="manager-customer__table">
            <thead>
              <tr>
                <th onClick={() => sortBy("id")}>ID{getSortIndicator("id")}</th>
                <th onClick={() => sortBy("customer")}>
                  Customer{getSortIndicator("customer")}
                </th>
                <th onClick={() => sortBy("date")}>
                  Date{getSortIndicator("date")}
                </th>
                <th onClick={() => sortBy("amount")}>
                  Amount{getSortIndicator("amount")}
                </th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="manager-customer__id">{order.id}</td>
                  <td>
                    <div className="manager-customer__customer">
                      <img
                        src={order.img}
                        alt={order.customer}
                        className="manager-customer__customer-image"
                      />
                      <span className="manager-customer__customer-name">
                        {order.customer}
                      </span>
                    </div>
                  </td>
                  <td className="manager-customer__date">{order.date}</td>
                  <td className="manager-customer__amount">{order.amount}</td>
                  <td>
                    <span
                      className={`manager-customer__status manager-customer__status--${order.status}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="manager-customer__actions">
                    <button className="manager-customer__action-button">
                      ✎
                    </button>
                    <button className="manager-customer__action-button">
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerCustomer;
