import { Layout } from "antd";
import "./ManagerLayout.scss";
import { Outlet } from "react-router-dom";
import ManagerHeader from "../../../Components/Manager/ManagerHeader/ManagerHeader";
import MenuSider from "../../../Components/Manager/MenuSider/index";
import { useSelector } from "react-redux";
import ManagerFooter from "../../../Components/Manager/ManagerFooter/ManagerFooter";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const { Content, Sider } = Layout;

function ManagerLayout() {
  const collapse = useSelector((state) => state.collapseReducer);
  const [managerInfo, setManagerInfo] = useState([]);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        if (data) {
          setManagerInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchManagerData();
  }, []);

  return (
    <Layout className="manager-layout" style={{ minHeight: "100vh" }}>
      <ManagerHeader managerInfo={managerInfo}/>
      <Layout className="manager-layout__inner">
        <Sider
          theme="light"
          collapsed={collapse}
          className="manager-layout__sider"
          style={{
            overflow: "auto",
            height: "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
          }}
        >
          <MenuSider />
        </Sider>
        <Layout className={`manager-layout__content ${collapse ? "manager-layout__content--collapsed" : "manager-layout__content--expanded"}`}>
          <Content className="manager-layout__content-inner">
            <Outlet manager={managerInfo}/>
          </Content>
          <div className="manager-layout__footer">
            <ManagerFooter />
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default ManagerLayout;
