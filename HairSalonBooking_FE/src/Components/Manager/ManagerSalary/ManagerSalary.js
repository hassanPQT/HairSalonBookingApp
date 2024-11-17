/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./ManagerSalary.scss";
import api from "../../../config/axios";
import { BiSearchAlt } from "react-icons/bi";
import { Calendar, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";


const ManagerSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [originalSalaries, setOriginalSalaries] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [manager, setManager] = useState([]);
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM"));
  const navigate = useNavigate();
  const [salaryLoading, setSalaryLoading] = useState(false);
  
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
        }
      };
      fetchManagerData();
    }, []);
  
    useEffect(() => {
      setSalaryLoading(true);
      if (manager.salonId !== undefined) {
      const fetchSalaries = async (page) => {
        try {
          const response = await api.get(
            `stylist/salaries/${manager.salonId}/${selectDay}`
          ); 
          const data = response.data.result;
          if (data) {
            setSalaries(data);
            setOriginalSalaries(data);
          }
        } catch (error) {
          console.log(error);
        }finally{
          setSalaryLoading(false);
        }
      };
  
      fetchSalaries();
       }
       
    }, [manager, selectDay]);
  
  
    const sortBy = (key) => {
      let direction = "ascending";
  
      if (sortConfig.key === key) {
        if (sortConfig.direction === "ascending") {
          direction = "descending";
        } else if (sortConfig.direction === "descending") {
          direction = null;
        }
      }
  
      setSortConfig({ key, direction });
  
      let sortedSalaries;
  
      if (direction === null) {
        sortedSalaries = [...originalSalaries];
      } else {
        sortedSalaries = [...salaries].sort((a, b) => {
          if (key === "discountAmount") {
            return direction === "ascending"
              ? parseFloat(a[key]) - parseFloat(b[key])
              : parseFloat(b[key]) - parseFloat(a[key]);
          }
          if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
          if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
          return 0;
        });
      }
  
      setSalaries(sortedSalaries);
    };
  
    const getSortIndicator = (key) => {
      if (sortConfig.key === key) {
        if (sortConfig.direction === "ascending") return " ▲";if (sortConfig.direction === "descending") return " ▼";
      }
      return "";
    };

    const formatDateForDisplay = (dateString) => {
      return dayjs(dateString).format("DD/MM/YYYY");
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
        const formattedDate = value.format("YYYY-MM-DD");
        setSelectedDay(formattedDate);
      };
  
      return (
        <div style={wrapperStyle} onClick={stopPropagation}>
          <Calendar
            fullscreen={false}
            onSelect={onSelect}
            value={dayjs(selectDay)}
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
    const calculateSalary = () => {
      navigate("/manager/salary/calculate");
    };

    const formatPrice = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
    return (
      <>
        <div className="manager-salary">
          <div className="manager-salary__header">
           
            <div className="manager-salary__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />
              {/* <i class="fas fa-search"></i> */}
              <input placeholder="Search here..." type="text" />
            </div>
            <div className="manager-salary__header-filter">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["hover"]}
              className="manager-salary__header-filter--select"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {formatDateForDisplay(selectDay)}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>

            <button onClick={calculateSalary}>Calculate Salary</button>
            </div>
          </div>
          <div className="manager-salary__container">
            <div className="manager-salary__content">
              <table className="manager-salary__table">
                <thead>
                  <tr>
                  <th onClick={() => sortBy("id")}>
                    ID{getSortIndicator("id")}
                  </th>
                  <th onClick={() => sortBy("stylistName")}>
                    Stylist Name{getSortIndicator("stylistName")}
                  </th>
                  <th onClick={() => sortBy("baseSalary")}>
                    Base salary{getSortIndicator("baseSalary")}
                  </th>
                  <th onClick={() => sortBy("bonus")}>
                    Bonus{getSortIndicator("bonus")}
                  </th>
                  <th onClick={() => sortBy("totalSalary")}>
                  Total salary{getSortIndicator("totalSalary")}
                  </th>
                  </tr>
                </thead>
  
                <tbody>
                {salaryLoading
                  ? [...Array(9)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <Skeleton width={40} />
                        </td>
                        <td>
                          <Skeleton width={180} />
                        </td>
                        <td>
                          <Skeleton width={140} />
                        </td>
                        <td>
                          <Skeleton width={140} />
                        </td>
                        <td>
                          <Skeleton width={140} />
                        </td>
                      </tr>
                    ))
                  :
                  (salaries.map((salary, index) => (
                    <tr key={index}><td className="manager-salary__id">{salary.stylistId}</td>
                    <td>
                      <div className="manager-salary__customer">
                        <span className="manager-salary__customer-name">
                          {salary.stylistName}
                        </span>
                      </div>
                    </td>
                    <td className="manager-salary__status">
                        {formatPrice(salary.salary)}
                      </td>
                    <td className="manager-salary__discountAmount">
                      {formatPrice(salary.bonus)}
                    </td>
                    <td>
                      <span className={`manager-salary__quantity`}>
                        {formatPrice(salary.totalSalary)}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </>
    );
  };
  
  export default ManagerSalary;