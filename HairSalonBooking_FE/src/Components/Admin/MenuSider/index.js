import React from "react";
import { Menu } from "antd";
import {
  HighlightOutlined,
  ContactsOutlined,
  DashboardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { TbPigMoney } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { LiaUserTieSolid } from "react-icons/lia";
import { FiUser } from "react-icons/fi";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineDiscount } from "react-icons/md";

function MenuSider() {
  const location = useLocation();
  const currentPath = location.pathname;

  const items = [
    {
      label: <Link to="/admin/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "/admin/dashboard",
    },
    {
      label: "Employee",
      icon: <ContactsOutlined />,
      key: "Employee",
      children: [
        {
          label: <Link to="/admin/manager">Manager</Link>,
          icon: <LiaUserTieSolid />,
          key: "/admin/manager",
        },
      ],
    },
    {
      label: <Link to="/admin/service">Service</Link>,
      icon: <HighlightOutlined />,
      key: "/admin/service",
    },
    {
      label: <Link to="/admin/voucher">Voucher</Link>,
      icon: <MdOutlineDiscount />,
      key: "/admin/voucher",
    },
    {
      label: <Link to="/admin/customer">Customer</Link>,
      icon: <FiUser />,
      key: "/admin/customer",
    },
    {
      label: <Link to="/admin/branch">Branch</Link>,
      icon: <HomeOutlined />,
      key: "/admin/branch",
    },
    {
      label: <Link to="/admin/slot">Slot</Link>,
      icon: <IoTimeOutline />,
      key: "/admin/slot",
    },
    {
      label: <Link to="/admin/kpi">KPI</Link>,
      icon: <TbPigMoney />,
      key: "/admin/kpi",
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
