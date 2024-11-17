import React from "react";
import { Menu } from "antd";
import {
  InsertRowAboveOutlined,
  PlusOutlined,
  ScissorOutlined,
  ContactsOutlined,
  DashboardOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { RiCustomerService2Line } from "react-icons/ri";

import { Link, useLocation } from "react-router-dom";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

function MenuSider() {
  const location = useLocation();
  const currentPath = location.pathname;

  const items = [
    {
      label: <Link to="/manager/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "/manager/dashboard",
    },
    {
      label: "Employee",
      icon: <ContactsOutlined />,
      key: "Employee",
      children: [
        {
          label: <Link to="/manager/stylist">Stylist</Link>,
          icon: <ScissorOutlined />,
          key: "/manager/stylist",
        },
        {
          label: <Link to="/manager/staff">Staff</Link>,
          icon: <RiCustomerService2Line />,
          key: "/manager/staff",
        },
      ],
    },
    {
      label: "Booking",
      icon: <InsertRowAboveOutlined />,
      key: "Booking",
      children: [
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "yellow", marginRight: 8 }} />
              <Link to="/manager/booking/pending">Pending</Link>
            </span>
          ),
          key: "/manager/booking/pending",
        },
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "blue", marginRight: 8 }} />
              <Link to="/manager/booking/in-process">In Process</Link>
            </span>
          ),
          key: "/manager/booking/in-process",
        },
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "green", marginRight: 8 }} />
              <Link to="/manager/booking/complete">Complete</Link>
            </span>
          ),
          key: "/manager/booking/complete",
        },
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "red", marginRight: 8 }} />
              <Link to="/manager/booking/cancel">Cancel</Link>
            </span>
          ),
          key: "/manager/booking/cancel",
        },
      ],
    },

    {
      label: <Link to="/manager/shift">Shift</Link>,
      icon: <ScheduleOutlined />,
      key: "/manager/shift",
    },
    {
      label: <Link to="/manager/salary">Salary</Link>,
      icon: <FaRegMoneyBillAlt />,
      key: "/manager/salary",
    },
  ];

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={["Employee"]}
      selectedKeys={[currentPath]}
      items={items}
      style={{ height: "100%", borderRight: 0 }}
    />
  );
}

export default MenuSider;
