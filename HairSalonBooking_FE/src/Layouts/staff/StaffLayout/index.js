import { Layout } from "antd";
import "./StaffLayout.scss";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import StaffHeader from "../../../Components/Staff/StaffHeader/StaffHeader";
import MenuSider from "../../../Components/Staff/MenuSider";
import StaffFooter from "../../../Components/Staff/StaffFooter/StaffFooter";

const { Content, Sider } = Layout;

function StaffLayout() {
  const collapse = useSelector((state) => state.collapseReducer);

  return (
    <Layout className="staff-layout" style={{ minHeight: "100vh" }}>
      <StaffHeader/>
      <Layout className="staff-layout__inner">
        <Sider
          theme="light"
          collapsed={collapse}
          className="staff-layout__sider"
          style={{
            overflow: "auto",
            height: "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
          }}
        >
          <MenuSider/>
        </Sider>
        <Layout className={`staff-layout__content ${collapse ? "staff-layout__content--collapsed" : "staff-layout__content--expanded"}`}>
          <Content className="staff-layout__content-inner">
            <Outlet />
          </Content>
          <div className="staff-layout__footer">
            <StaffFooter/>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default StaffLayout;
