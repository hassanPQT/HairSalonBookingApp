import React from "react";
import "./StylistFooter.scss";
import { Layout } from "antd";

const { Footer } = Layout;

const StylistFooter = () => {
  return (
    <Footer className="admin-footer">
      <div className="admin-footer__content">
        <p className="admin-footer__text">
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
      </div>
    </Footer>
  );
};

export default StylistFooter;
