import React from "react";
import "./ManagerFooter.scss";
import { Layout } from "antd";

const { Footer } = Layout;

const ManagerFooter = () => {
  return (
    <Footer className="manager-footer">
      <div className="manager-footer__content">
        <p className="manager-footer__text">
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
      </div>
    </Footer>
  );
};

export default ManagerFooter;
