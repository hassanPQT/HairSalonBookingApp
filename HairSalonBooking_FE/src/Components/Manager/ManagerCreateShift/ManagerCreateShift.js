import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { BiSearchAlt } from "react-icons/bi";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Calendar, theme, Checkbox, Spin } from "antd";

import "./ManagerCreateShift.scss";

import api from "../../../config/axios";

export default function ManagerCreateShift() {
  //mảng có các stylist đã được xếp lịch
  const [selectShift, setSelectShift] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stylistsData, setStylistsData] = useState([]);
  const [availableStylist, setAvailableStylist] = useState([]);
  const [salonId, setSalonId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [isRightDay, setIsRightDay] = useState(true);

  const CalendarDropdown = () => {
    const { token } = theme.useToken();
    const wrapperStyle = {
      width: 330,
      borderRadius: token.borderRadiusLG,
      padding: "10px",
      backgroundColor: "#fff",
    };

    const onSelect = (value) => {
      const formattedDate = value.format("YYYY-MM-DD");
      setSelectedDay(formattedDate);
    };
    const disabledDate = (current) => {
      return current && current < dayjs().startOf("day");
    };

    return (
      <div style={wrapperStyle}>
        <Calendar
          fullscreen={false}
          onSelect={onSelect}
          value={dayjs(selectDay)}
          disabledDate={disabledDate}
        />
      </div>
    );
  };

  const items = [
    {
      key: "1",
      label: <CalendarDropdown />, // Replace dropdown item with the CalendarDropdown component
    },
  ];

  //-------------------API---------------------

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`manager-profile`);
        const data = response.data.result;
        if (data) {
          setSalonId(data.salonId);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchManagerData();
  }, []);

  useEffect(() => {
    fetchShiftData();
    console.log(availableStylist);
  }, [selectDay, stylistsData]);

  const fetchShiftData = async () => {
    try {
      ///stylist/schedule/{date}/{salonId}
      const response = await api.get(`shift?workingDate=${selectDay}`);
      const data = response.data;

      if (data) {
        const enrichedData = data.map((shift) => {
          const stylist = stylistsData.find(
            (stylist) => stylist.fullname === shift.stylistName
          );
          return {
            ...shift,
            stylistId: stylist ? stylist.id : null,
            image: stylist ? stylist.image : null,
          };
        });

        const filteredData = stylistsData.filter((stylist) => {
          return !enrichedData.some(
            (avai) => Number(avai.stylistId) === Number(stylist.id)
          );
        });
        setAvailableStylist(filteredData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStylistsData();
  }, [salonId]);

  //lấy tất cả stylist tại salon đó
  const fetchStylistsData = async () => {
    try {
      // const response = await api.get(`/stylist/salon/${salonId}`);
      // const data = response.data.result;

      const response = await api.get(`stylist-salon?salonId=${salonId}`);
      const data = response.data;
      if (data) {
        setStylistsData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (stylistId, shift, e) => {
    const isChecked = e.target.checked;

    // Cập nhật danh sách ca làm đã chọn
    setSelectShift((prevFormData) => {
      // Tìm xem stylist và ca làm hiện tại có trong mảng không
      const existingStylist = prevFormData.find(
        (entry) => entry.stylistId === stylistId
      );

      // TH thêm ca làm
      if (isChecked) {
        // Nếu stylist đã có update ca làm của nó
        if (existingStylist) {
          // Thêm ca làm nếu nó chưa có trong danh sách
          if (!existingStylist.shiftId.includes(shift)) {
            return prevFormData.map((entry) =>
              entry.stylistId === stylistId
                ? {
                    ...entry,
                    shiftId: [...existingStylist.shiftId, shift],
                  }
                : entry
            );
          }
        } else {
          // Nếu stylist ko tồn tại tạo đứa stylist mới
          return [
            ...prevFormData,
            { stylistId, workingDate: selectDay, shiftId: [shift] },
          ];
        }
      } else {
        // TH xóa ca làm
        if (existingStylist) {
          // Xóa ca vẫn còn ca khác
          const updatedShiftId = existingStylist.shiftId.filter(
            (s) => s !== shift
          );

          // Ko còn ca nào xóa thằng stylist
          if (updatedShiftId.length === 0) {
            return prevFormData.filter(
              (entry) => entry.stylistId !== stylistId
            );
          } else {
            return prevFormData.map((entry) =>
              entry.stylistId === stylistId
                ? { ...entry, shiftId: updatedShiftId }
                : entry
            );
          }
        }
      }
      return prevFormData;
    });
  };

  const createShiftData = async (e) => {
    e.preventDefault();

    if (selectShift.length === 0) {
      console.log("Error");
      return;
    }

    setLoading(true);

    try {
      const promises = selectShift.map(async (dataValue) => {
        const shiftData = {
          stylistId: dataValue.stylistId,
          workingDate: selectDay,
          shiftId: dataValue.shiftId,
        };
        console.log(shiftData);
        const response = await api.post("stylist/schedule", shiftData);
        return response.data.result;
      });

      const results = await Promise.all(promises);
      if (results) {
        console.log(results);
        setSelectShift([]);
        navigate("/manager/shift");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    createShiftData(e);
  };

  return (
    <>
      <div className="manager-create-shift__breadcrumb">
        <Link
          to="/manager/shift"
          className="manager-create-shift__breadcrumb-link"
        >
          Shift
        </Link>
        &gt;
        <span className="manager-create-shift__breadcrumb-current">
          New Shift
        </span>
      </div>

      <div className="manager-create-shift">
        <form onSubmit={handleSubmit}>
          <div className="manager-create-shift__header">
            <div className="manager-create-shift__header-searchBar">
              <BiSearchAlt className="searchBar-icon" />
              <input
                placeholder="Search stylist name here..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="manager-create-shift__header-filter">
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["hover"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {selectDay}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>

          <div className="manager-create-shift__content">
            <table className="manager-create-shift__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stylist Name</th>
                  <th>Shift 1</th>
                  <th>Shift 2</th>
                  <th>Shift 3</th>
                </tr>
              </thead>

              <tbody>
                {(availableStylist || []).map((stylist) => (
                  <tr key={stylist.id}>
                    <td className="manager-create-shift__id">{stylist.id}</td>
                    <td>
                      <div className="manager-create-shift__stylist">
                        <img
                          src={stylist.image}
                          alt={stylist.fullname}
                          className="manager-customer__customer-image"
                        />
                        <span className="manager-create-shift__stylist-name">
                          {stylist.fullname}
                        </span>
                      </div>
                    </td>
                    {[1, 2, 3].map((shift) => (
                      <td key={`${shift}-${stylist.id}`}>
                        <Checkbox
                          onChange={(e) => handleSelect(stylist.id, shift, e)}
                          checked={selectShift.some(
                            (entry) =>
                              entry.stylistId === stylist.id &&
                              entry.shiftId.includes(shift)
                          )}
                        >
                          {selectShift.some(
                            (entry) =>
                              entry.stylistId === stylist.id &&
                              entry.shiftId.includes(shift)
                          )
                            ? "Scheduled"
                            : "Available"}
                        </Checkbox>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {/* ) : (
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <div className="manager-create-shift__notValid">
                        <BiSolidMessageAltError className="notValid--icon" />
                        <p>Please Choose Another Date</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )} */}
            </table>
            {isRightDay && (
              <div className="manager-create-shift__button-container">
                <button
                  type="submit"
                  className="manager-create-shift__button"
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Save"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
