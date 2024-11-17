/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Calendar, Card, Col, Dropdown, Row, Space, Statistic, Tabs } from "antd";
import ReactECharts from 'echarts-for-react';
import "./ManagerDashboard.scss";
import dayjs from "dayjs";
import { DownOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { Skeleton } from "@mui/material";

const { TabPane } = Tabs;

const ManagerDashboard = () => {
  const [totalProfit, setTotalProfit] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM"));
  const [manager, setManager] = useState([]);
  const [profit, setProfit] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [finalValues, setFinalValues] = useState({
    profit: 0,
    bookings: 1832,
  });

  function formatDateToOrdinal(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
        suffix = 'st';
    } else if (day === 2 || day === 22) {
        suffix = 'nd';
    } else if (day === 3 || day === 23) {
        suffix = 'rd';
    }

    return day + suffix;
}

  useEffect(() => {
    if (finalValues.profit === 0) {
      setTotalProfit(0);
      return;
    }

    if (finalValues.bookings === 0) {
      setBookings(0);
      return;
    }

    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;

    const incrementProfit = finalValues.profit / steps;
    const incrementBookings = finalValues.bookings / steps;

    let currentProfit = 0;
    let currentBookings = 0;

    const interval = setInterval(() => {
      if (currentProfit < finalValues.profit) {
        currentProfit += incrementProfit;
        setTotalProfit(Math.round(currentProfit));
      }
      if (currentBookings < finalValues.customers) {
        currentBookings += incrementBookings;
        setBookings(Math.round(currentBookings));
      }

      if (
        currentProfit >= finalValues.profit &&
        currentBookings >= finalValues.bookings
      ) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [finalValues]);


  const getLineOptions = () => ({
    xAxis: {
      type: 'category',
      data: profit.map(item => formatDateToOrdinal(item.day)),
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
        data: profit.map(item => item.totalMoney),
        type: 'line',
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
        type: 'pie',
        radius: ['50%', '70%'],
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

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`manager/profile`);
        const data = response.data.result;
        if (data) {
          setManager(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
    fetchManagerData();
  }, []);

  const formatDateForDisplay = (dateString) => {
    return dayjs(dateString).format("MM/YYYY");
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
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
      <div style={wrapperStyle} onClick={stopPropagation}>
        <Calendar
          fullscreen={false}
          onSelect={onSelect}
          value={dayjs(selectDay)}
          mode="year"
        />
      </div>
    );
  };

   const items = [
    {
      key: "1",
      label: <CalendarDropdown />,
    },
  ];

  useEffect(() => {
    if (manager.salonId !== undefined) {
      const fetchTotalProfit = async () => {
        setLoading(true);
        const month = selectDay.split("-")[1];
        try {
          const response = await api.get(`booking/total-money/month/${month}/salon/${manager.salonId}`);
          const data = response.data.result;
          if (data) {
            setFinalValues(prev => ({
              ...prev,
              profit: data.totalMoney,
            }));
          } else {
            setFinalValues(prev => ({
              ...prev,
              profit: 0,
            }));
          }
        } catch (error) {
          console.log(error);
          setFinalValues(prev => ({
            ...prev,
            profit: 0,
          }));
        }finally{
          setLoading(false);
        }
       
      }

      const fetchProfit = async () => {
        setLoading(true);
        const month = selectDay.split("-")[1];
        try {
          const response = await api.get(`booking/total-money/day/month/${month}/salon/${manager.salonId}`);
          const data = response.data.result;
          if (data) {
           setProfit(data);
          }
        } catch (error) {
          console.log(error)
        }finally{
          setLoading(false);
        }
      }

      const fetchBookingsData = async () => {
        setLoading(true);
        try {
         const response = await api.get(`booking/count/completed/${selectDay}`);
         const data = response.data.result;
         if (data) {
          setBookings(data);
         }
        } catch (error) {
         console.log(error)
        }finally{
          setLoading(false);
        }
       }

      const fetchEmployeeData = async () => {
        setLoading(true);
        try {
         const response = await api.get(`manager/chart/${manager.salonId}`);
         const data = response.data.result;
         if (data) {
          setEmployeesData(data);
         }
        } catch (error) {
         console.log(error)
        }finally{
          setLoading(false);
        }
       }

      fetchTotalProfit();
      fetchProfit();
      fetchEmployeeData();
      fetchBookingsData();
    }

  
  }, [selectDay, manager]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  

  return (
    <div className="manager-dashboard">
       <div className="manager-dashboard__header-filter">
            <Dropdown
            className="manager-dashboard__header-filter--select"
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
      <Row gutter={16} className="manager-dashboard__container">
     
        <Col span={12}>
          <Card>
            <Statistic title="Profit" value={totalProfit && formatNumber(totalProfit)} suffix="VND" />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Bookings" value={bookings && formatNumber(bookings)} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="manager-dashboard__chart-container">
        <Col span={16}>
          <Card title="Total Profit">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Month" key="1">
              {loading ? <Skeleton variant="rectangular" height={300} /> : <ReactECharts option={getLineOptions()} />}
              </TabPane>
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

export default ManagerDashboard;
