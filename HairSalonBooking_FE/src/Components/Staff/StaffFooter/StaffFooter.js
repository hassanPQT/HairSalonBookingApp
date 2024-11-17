import React from "react";
import "./StaffFooter.scss";
import { Layout } from "antd";

const { Footer } = Layout;

const StaffFooter = () => {
  return (
    <Footer className="staff-footer">
      <div className="staff-footer__content">
        <p className="staff-footer__text">
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
      </div>
    </Footer>
  );
};

export default StaffFooter;
