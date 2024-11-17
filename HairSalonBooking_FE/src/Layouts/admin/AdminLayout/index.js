import { Layout } from "antd";
import "./AdminLayout.scss";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminHeader from "../../../Components/Admin/AdminHeader/AdminHeader";
import AdminFooter from "../../../Components/Admin/AdminFooter/AdminFooter";
import MenuSider from "../../../Components/Admin/MenuSider";

const { Content, Sider } = Layout;

function AdminLayout() {
  const collapse = useSelector((state) => state.collapseReducer);

  return (
    <Layout className="admin-layout" style={{ minHeight: "100vh" }}>
      <AdminHeader/>
      <Layout className="admin-layout__inner">
        <Sider
          theme="light"
          collapsed={collapse}
          className="admin-layout__sider"
          style={{
            overflow: "auto",
            height: "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
          }}
        >
          <MenuSider/>
        </Sider>
        <Layout className={`admin-layout__content ${collapse ? "admin-layout__content--collapsed" : "admin-layout__content--expanded"}`}>
          <Content className="admin-layout__content-inner">
            <Outlet/>
          </Content>
          <div className="admin-layout__footer">
            <AdminFooter/>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
