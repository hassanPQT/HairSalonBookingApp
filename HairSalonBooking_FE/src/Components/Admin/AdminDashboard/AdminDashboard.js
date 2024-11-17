/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Card,
  Col,
  Dropdown,
  Row,
  Space,
  Statistic,
  Tabs,
} from "antd";
import ReactECharts from "echarts-for-react";
import "./AdminDashboard.scss";
import dayjs from "dayjs";
import { DownOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { Skeleton } from "@mui/material";

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [totalProfit, setTotalProfit] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [services, setServices] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM"));
  const [employeesData, setEmployeesData] = useState([]);
  const [salons, setSalons] = useState([]);
  const [profits, setProfits] = useState({});
  const [loading, setLoading] = useState(false);

  const [finalValues, setFinalValues] = useState({
    profit: 0,
    services: 0,
    bookings: 0,
    customers: 0,
  });

  function formatDateToOrdinal(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    return day + suffix;
  }

  useEffect(() => {
    if (finalValues.profit === 0) {
      setTotalProfit(0);
      return;
    }

    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;

    const incrementProfit = finalValues.profit / steps;
    const incrementBookings = finalValues.bookings / steps;
    const incrementServices = finalValues.services / steps;
    const incrementCustomers = finalValues.customers / steps;

    let currentProfit = 0;
    let currentBookings = 0;
    let currentServices = 0;
    let currentCustomers = 0;

    const interval = setInterval(() => {
      if (currentProfit < finalValues.profit) {
        currentProfit += incrementProfit;
        setTotalProfit(Math.round(currentProfit));
      }
      if (currentServices < finalValues.services) {
        currentServices += incrementServices;
        setServices(Math.round(incrementServices));
      }
      if (currentBookings < finalValues.orders) {
        currentBookings += incrementBookings;
        setBookings(Math.round(currentBookings));
      }
      if (currentCustomers < finalValues.customers) {
        currentCustomers += incrementCustomers;
        setCustomers(Math.round(currentCustomers));
      }

      if (
        currentProfit >= finalValues.profit &&
        currentServices >= finalValues.services &&
        currentBookings >= finalValues.orders &&
        currentCustomers >= finalValues.customers
      ) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [finalValues]);

  const getLineOptions = (salonId) => ({
    xAxis: {
      type: "category",
      data:
        profits[salonId]?.map((item) => formatDateToOrdinal(item.day)) || [],
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => {
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
      },
    },
    series: [
      {
        data: profits[salonId]?.map((item) => item.totalMoney) || [],
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#2196F3",
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const value = params[0].data;
        return `${params[0].name}: ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
      },
    },
  });

  const getDoughnutOptions = () => ({
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "70%"],
        data: employeesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          formatter: "{c}",
        },
      },
    ],
  });

  const formatDateForDisplay = (dateString) => {
    return dayjs(dateString).format("MM/YYYY");
  };

  const CalendarDropdown = () => {
    const wrapperStyle = {
      width: 320,
      padding: "10px",
      backgroundColor: "#fff",
    };

    const onSelect = (value) => {
      const formattedDate = value.format("YYYY-MM");
      setSelectedDay(formattedDate);
    };

    return (
      <div style={wrapperStyle}>
        <Calendar
          fullscreen={false}
          onSelect={onSelect}
          value={dayjs(selectDay)}
          mode="year"
        />
      </div>
    );
  };

  const fetchTotalProfit = async () => {
    const month = selectDay.split("-")[1];
    try {
      const response = await api.get(
        `admin/booking/total-money/month/${month}`
      );
      const data = response.data.result;
      if (data) {
        setFinalValues((prev) => ({
          ...prev,
          profit: data,
        }));
      } else {
        setFinalValues((prev) => ({
          ...prev,
          profit: 0,
        }));
      }
    } catch (error) {
      console.log(error);
      setFinalValues((prev) => ({
        ...prev,
        profit: 0,
      }));
    }
  };

  const fetchBookings = async () => {
    const month = selectDay.split("-")[1];
    try {
      const response = await api.get(`admin/booking/count/${month}`);
      const data = response.data.result;
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get(`admin/service/count`);
      const data = response.data.result;
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get(`admin/customer/count`);
      const data = response.data.result;
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfit = async (salonId) => {
    setLoading(true);
    const month = selectDay.split("-")[1];
    try {
      const response = await api.get(
        `booking/total-money/day/month/${month}/salon/${salonId}`
      );
      const data = response.data.result;
      setProfits((prev) => ({
        ...prev,
        [salonId]: data,
      }));
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await api.get(`admin/chart/`);
      const data = response.data.result;
      if (data) {
        setEmployeesData(data);
      }
    } catch (error) {}
  };

  const fetchSalons = async () => {
    try {
      const response = await api.get(`salon`);
      const data = response.data.result;
      if (data) {
        setSalons(data);
      }
      data.forEach((salon) => fetchProfit(salon.id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTotalProfit();
    fetchProfit();
    fetchBookings();
    fetchServices();
    fetchCustomers();
    fetchEmployeeData();
    fetchSalons();
  }, [selectDay]);

  useEffect(() => {
    console.log(salons);
  }, [salons]);

  const items = [
    {
      key: "1",
      label: <CalendarDropdown />,
    },
  ];

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header-filter">
        <Dropdown
        className="admin-dashboard__header-filter--select"
          menu={{
            items,
          }}
          trigger={["hover"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
            {formatDateForDisplay(selectDay)}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <Row gutter={16} className="admin-dashboard__container">
        <Col span={6}>
          <Card>
            <Statistic title="Profit" value={totalProfit && formatNumber(totalProfit)} suffix="VND" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Services" value={services && formatNumber(services)} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Bookings" value={bookings && formatNumber(bookings)} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Customers" value={customers && formatNumber(customers)} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="admin-dashboard__chart-container">
        <Col span={16}>
          <Card title="Total Profit">
            <Tabs defaultActiveKey="1">
              {loading ? (
                <TabPane key="loading" tab="Loading">
                  <Skeleton variant="rectangular" height={300} />
                </TabPane>
              ) : (
                salons.map((salon) => (
                  <TabPane tab={`Salon ${salon.id}`} key={salon.id}>
                    <ReactECharts option={getLineOptions(salon.id)} />
                  </TabPane>
                ))
              )}
            </Tabs>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Employees">
            <ReactECharts option={getDoughnutOptions()} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
