import React from "react";
import { Menu } from "antd";
import {
  InsertRowAboveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { FiUser } from "react-icons/fi";

function MenuSider() {
  const location = useLocation();
  const currentPath = location.pathname;

  const items = [
    {
      label: "Booking",
      icon: <InsertRowAboveOutlined />,
      key: "Booking",
      children: [
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "yellow", marginRight: 8 }} />
              <Link to="/staff/booking/pending">Pending</Link>
            </span>
          ),
          key: "/staff/booking/pending",
        },
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "blue", marginRight: 8 }} />
              <Link to="/staff/booking/in-process">In Process</Link>
            </span>
          ),
          key: "/staff/booking/in-process",
        },
        {
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <GoDotFill style={{ color: "green", marginRight: 8 }} />
              <Link to="/staff/booking/complete">Complete</Link>
            </span>
          ),
          key: "/staff/booking/complete",
        },
      ],
    },
    {
      label: <Link to="/staff/customer">Customer</Link>,
      icon: <FiUser />,
      key: "/staff/customer",
    },
  ];

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={["Booking"]}
      selectedKeys={[currentPath]}
      items={items}
      style={{ height: "100%", borderRight: 0 }}
    />
  );
}

export default MenuSider;
