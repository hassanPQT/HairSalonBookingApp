import React from "react";
import "./AdminFooter.scss";
import { Layout } from "antd";

const { Footer } = Layout;

const AdminFooter = () => {
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

export default AdminFooter;
