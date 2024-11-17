import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { Spin } from "antd";
import { Badge, Calendar } from "antd";
import Swal from "sweetalert2";
import "./StylistShift.scss";
import api from "../../../config/axios";

export default function StylistShift() {
  const today = new Date();
  const [value, setValue] = useState(dayjs(today));

  const [shifts, setShifts] = useState({});
  const [stylistId, setStylistId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectShift, setSelectShift] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [selectMonth, setSelectMonth] = useState(today.getMonth() + 1);
  const [isWeekScheduled, setIsWeekScheduled] = useState("");
  const navigate = useNavigate();
  const [hasExistingShift, setHasExistingShift] = useState(false);

  const calculateWeekDays = (selectedDate) => {
    const startOfWeek = selectedDate.startOf("week");
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, "day"));
    }
    return days;
  };

  const [weekDays, setWeekDays] = useState(calculateWeekDays(dayjs(today)));

  const handleSelect = (date) => {
    const selectedWeekDays = calculateWeekDays(date);
    setWeekDays(selectedWeekDays);
    setValue(date);
  };

  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const response = await api.get(`stylist/profile`);
        const data = response.data.result;

        if (data) {
          setStylistId(data.accountid);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStylistData();
  }, [stylistId]);

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
          stylistId: stylistId,
          workingDate: dataValue.date,
          shiftId: dataValue.shift,
        };
        const response = await api.post("stylist/schedule", shiftData);
        if (response.data) {
          Swal.fire({
            title: "Create!",
            text: "The shift has been create.",
            icon: "success",
          });
        }
        return response.data;
      });
      const results = await Promise.all(promises);
      if (results) {
        setSelectShift([]);
        await fetchShiftData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchShiftData = async () => {
    try {
      console.log(stylistId);
      console.log(selectMonth);
      const response = await api.get(
        `stylist/schedule/month/${stylistId}/${selectMonth}`
      );
      const data = response.data.result;

      if (data) {
        setShiftData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (stylistId) {
      fetchShiftData();
    }
  }, [selectMonth, stylistId]);

  const getListData = (value) => {
    let listData = [];

    const currentDate = value.format("YYYY-MM-DD");

    shiftData.forEach((item) => {
      if (item.workingDate === currentDate) {
        item.shiftId.forEach((shiftId) => {
          switch (shiftId) {
            case 1:
              listData.push({ type: "success" });
              break;
            case 2:
              listData.push({ type: "warning" });
              break;
            case 3:
              listData.push({ type: "error" });
              break;
            default:
              break;
          }
        });
      }
    });

    return listData;
  };

  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const handleShiftChange = (date, shift) => (event) => {
    const dateStr = date.format("YYYY-MM-DD");
    setShifts((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [shift]: event.target.checked,
      },
    }));
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const handleSelectAllShift = (shift) => {
    const newShifts = { ...shifts };
    let allSelected = true;

    weekDays.forEach((day) => {
      if (!day.isBefore(dayjs(), "day")) {
        const dateStr = day.format("YYYY-MM-DD");
        if (!newShifts[dateStr] || !newShifts[dateStr][shift]) {
          allSelected = false;
        }
      }
    });

    weekDays.forEach((day) => {
      if (!day.isBefore(dayjs(), "day")) {
        const dateStr = day.format("YYYY-MM-DD");
        if (!newShifts[dateStr]) {
          newShifts[dateStr] = {};
        }
        newShifts[dateStr][shift] = !allSelected;
      }
    });

    setShifts(newShifts);
  };

  const getShiftChecked = (date, shift) => {
    const dateStr = date.format("YYYY-MM-DD");

    const existingShift = shiftData.find(
      (item) => item.workingDate === dateStr
    );
    if (existingShift) {
      switch (shift) {
        case "morning":
          return existingShift.shiftId.includes(1);
        case "afternoon":
          return existingShift.shiftId.includes(2);
        case "evening":
          return existingShift.shiftId.includes(3);
        default:
          return false;
      }
    }
    return shifts[dateStr]?.[shift] || false;
  };

  const checkIfWeekHasExistingShift = () => {
    return weekDays.some((day) => {
      const dateStr = day.format("YYYY-MM-DD");
      return shiftData.some((item) => item.workingDate === dateStr);
    });
  };

  const checkIfNewShiftsSelected = () => {
    return weekDays.some((day) => {
      const dateStr = day.format("YYYY-MM-DD");

      const existingShift = shiftData.find(
        (item) => item.workingDate === dateStr
      );
      if (!existingShift) {
        return (
          shifts[dateStr]?.morning ||
          shifts[dateStr]?.afternoon ||
          shifts[dateStr]?.evening
        );
      }
      return false;
    });
  };

  useEffect(() => {
    const existingShift = checkIfWeekHasExistingShift();
    const newSelected = checkIfNewShiftsSelected();
    setIsWeekScheduled(!existingShift && newSelected);
  }, [weekDays, shiftData]);

  const SelectShiftsData = () => {
    const result = [];
    const newSelected = checkIfNewShiftsSelected();

    weekDays.forEach((day) => {
      const dateStr = day.format("YYYY-MM-DD");
      const shiftArray = [];

      const existingShift = shiftData.find(
        (item) => item.workingDate === dateStr
      );
      if (existingShift) {
        shiftArray.push(...existingShift.shiftId); // Giữ lại ca làm việc đã có từ API
      } else {
        // Kiểm tra nếu có ca mới được chọn trong ngày hiện tại
        if (shifts[dateStr]?.morning) shiftArray.push(1);
        if (shifts[dateStr]?.afternoon) shiftArray.push(2);
        if (shifts[dateStr]?.evening) shiftArray.push(3);
      }

      if (shiftArray.length > 0) {
        result.push({ date: dateStr, shift: shiftArray });
      }
    });

    setSelectShift(result);

    const existingShiftInWeek = checkIfWeekHasExistingShift();
    setIsWeekScheduled(!existingShiftInWeek && newSelected);
  };

  useEffect(() => {
    SelectShiftsData();
  }, [shifts]);

  const handleSubmit = (e) => {
    createShiftData(e);
  };

  return (
    <div className="StylistShift">
      <div className="StylistShift__calendar">
        <Calendar
          cellRender={cellRender}
          onSelect={handleSelect}
          onPanelChange={(value) => {
            setSelectMonth(value.month() + 1);
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="StylistShift__week">
        <div className="StylistShift__week-content">
          <div className="StylistShift__week-timeline">
            <div className="spacer"></div>
            <div className="time-marker">
              <button
                type="button"
                className="select-shift-btn morning "
                onClick={() => handleSelectAllShift("morning")}
              >
                Shift 1
              </button>
            </div>
            <div className="time-marker">
              <button
                type="button"
                className="select-shift-btn afternoon"
                onClick={() => handleSelectAllShift("afternoon")}
              >
                Shift 2
              </button>
            </div>
            <div className="time-marker">
              <button
                type="button"
                className="select-shift-btn evening"
                onClick={() => handleSelectAllShift("evening")}
              >
                Shift 3
              </button>
            </div>
          </div>

          <div className="StylistShift__week-days">
            {weekDays.map((day) => (
              <div className="day" key={day.format("YYYY-MM-DD")}>
                <div className="date">
                  <p className="date-num">{day.format("D")}</p>
                  <p className="date-day">{day.format("ddd")}</p>
                </div>
                <div className="events">
                  <div className="date-check">
                    <div className="shift-group">
                      <Checkbox
                        className="morning"
                        checked={getShiftChecked(day, "morning")}
                        onChange={handleShiftChange(day, "morning")}
                        disabled={day.isBefore(dayjs(), "day")}
                        inputProps={{ "aria-label": "Ca sáng (8h-12h)" }}
                      />
                      <span className="shift-label ">Morning</span>
                    </div>
                    <div className="shift-group">
                      <Checkbox
                        className="afternoon"
                        checked={getShiftChecked(day, "afternoon")}
                        onChange={handleShiftChange(day, "afternoon")}
                        disabled={day.isBefore(dayjs(), "day")}
                        inputProps={{ "aria-label": "Ca chiều (13h-17h)" }}
                      />
                      <span className="shift-label ">Afternoon</span>
                    </div>
                    <div className="shift-group">
                      <Checkbox
                        className="evening"
                        checked={getShiftChecked(day, "evening")}
                        onChange={handleShiftChange(day, "evening")}
                        disabled={day.isBefore(dayjs(), "day")}
                        inputProps={{ "aria-label": "Ca tối (18h-22h)" }}
                      />
                      <span className="shift-label ">Evening</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="StylistShift__week-action">
          {isWeekScheduled && (
            <button type="submit" disabled={loading} className="btn">
              {loading ? <Spin size="small" /> : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
