import { Layout } from "antd";
import "./StylistLayout.scss";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuSider from "../../Components/Stylist/MenuSider";
import StylistFooter from "../../Components/Stylist/StylistFooter/StylistFooter";
import StylistHeader from "../../Components/Stylist/StylistHeader/StylistHeader";

const { Content, Sider } = Layout;

function StylistLayout() {
  const collapse = useSelector((state) => state.collapseReducer);

  return (
    <Layout className="stylist-layout" style={{ minHeight: "100vh" }}>
      <StylistHeader />
      <Layout className="stylist-layout__inner">
        <Sider
          theme="light"
          collapsed={collapse}
          className="stylist-layout__sider"
          style={{
            overflow: "auto",
            height: "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
          }}
        >
          <MenuSider />
        </Sider>
        <Layout
          className={`stylist-layout__content ${
            collapse
              ? "stylist-layout__content--collapsed"
              : "stylist-layout__content--expanded"
          }`}
        >
          <Content className="stylist-layout__content-inner">
            <Outlet />
          </Content>
          <div className="stylist-layout__footer">
            <StylistFooter />
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default StylistLayout;
