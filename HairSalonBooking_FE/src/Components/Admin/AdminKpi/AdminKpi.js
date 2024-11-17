import React, { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import { Spin } from "antd";
import Swal from "sweetalert2";
import "./AdminKpi.scss";
import api from "../../../config/axios";

export default function AdminKpi() {
  const [slotLoading, setSlotLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kpi, setKpi] = useState([]);
  const [selectKpi, setSelectKpi] = useState([]);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kpiId, setKpiId] = useState(0);

  const fetchKpi = async () => {
    setKpiLoading(true);
    try {
      const response = await api.get("kpis");
      const data = response.data.result;

      if (data) {
        setKpi(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setKpiLoading(false);
    }
  };

  useEffect(() => {
    fetchKpi();
  }, []);

  const refreshed = () => {
    fetchKpi();
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const toggleModal = async (id) => {
    setKpiId(id);
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) await fetchSelectKpi(id);
  };

  const rowSpanMap = kpi.reduce((acc, curr) => {
    acc[curr.levelId] = (acc[curr.levelId] || 0) + 1;
    return acc;
  }, {});

  const fetchSelectKpi = async (levelId) => {
    try {
      const response = await api.get(`kpis/${levelId}`);
      const data = response.data.result;
      if (data) {
        setSelectKpi(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateKPI = async (level, value) => {
    console.log(level);
    console.log(value);
    try {
      const response = await api.put(`kpi/${level}`, value);
      if (response.data) {
        Swal.fire({
          title: "Updated!",
          text: "The KPI has been updated successfully.",
          icon: "success",
        });
        refreshed();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const kpiData = {
      levelId: kpiId,
      bonus: selectKpi.map((item) => ({
        performance_score: item.performance_score,
        revenue_from: item.revenue_from,
        revenue_to: item.revenue_to,
        bonus_percent: item.bonus_percent,
      })),
    };

    await updateKPI(kpiId, kpiData);
    setIsModalOpen(false);
  };

  const convertToNumber = (formattedValue) => {
    if (typeof formattedValue === "string") {
      return parseInt(formattedValue.replace(/\./g, ""), 10) || 0;
    }
    return Number(formattedValue) || 0;
  };

  const handleInputChange = (index, field, value) => {
    const updatedKpi = [...selectKpi];
    updatedKpi[index] = { ...updatedKpi[index], [field]: value };

    if (field === "revenue_to" && index < updatedKpi.length - 1) {
      const nextRevenueTo = convertToNumber(value) + 1;
      updatedKpi[index + 1] = {
        ...updatedKpi[index + 1],
        revenue_from: nextRevenueTo,
      };
    }

    setSelectKpi(updatedKpi);
  };

  const parseCurrencyInput = (input) => {
    const cleanedInput = input.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(cleanedInput.replace(/\./g, "")) || 0;
    return Math.round(numericValue);
  };

  const addNewRow = () => {
    const newRow = {
      revenue_from: 0,
      revenue_to: 0,
      bonus_percent: 0,
      performance_score: 0,
    };
    setSelectKpi([...selectKpi, newRow]);
  };

  const deleteRow = (index) => {
    const updatedKpi = selectKpi.filter((_, idx) => idx !== index);
    setSelectKpi(updatedKpi);
  };

  return (
    <>
      <div className="admin-kpi">
        <div className="admin-kpi__container">
          <div className="admin-kpi__content">
            <table className="admin-kpi__table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Score</th>
                  <th>Form</th>
                  <th>To</th>
                  <th>Bonus</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {slotLoading ? (
                  <tr>
                    {Array(6)
                      .fill("")
                      .map((_, idx) => (
                        <td key={idx}>
                          <Skeleton width={120} />
                        </td>
                      ))}
                  </tr>
                ) : (
                  kpi.map((kpiItem, index, array) => {
                    const isFirstOfLevel =
                      index === 0 ||
                      kpiItem.levelId !== array[index - 1].levelId;

                    return (
                      <tr key={index}>
                        {isFirstOfLevel && (
                          <td
                            className="admin-kpi__code"
                            rowSpan={rowSpanMap[kpiItem.levelId]}
                          >
                            {kpiItem.levelId}
                          </td>
                        )}
                        <td className="admin-kpi__date">
                          {kpiItem.performance_score}
                        </td>
                        <td className="admin-kpi__date">
                          {formatCurrency(kpiItem.revenue_from)} VND
                        </td>
                        <td className="admin-kpi__date">
                          {formatCurrency(kpiItem.revenue_to)} VND
                        </td>
                        <td className="admin-kpi__name">
                          {(kpiItem.bonus_percent * 100).toFixed(1)}%
                        </td>

                        {isFirstOfLevel && (
                          <td
                            className="admin-kpi__actions"
                            rowSpan={rowSpanMap[kpiItem.levelId]}
                          >
                            <button
                              className="admin-kpi__action-button"
                              onClick={() => toggleModal(kpiItem.levelId)}
                            >
                              ✎
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="admin-kpi-backdrop" onClick={toggleModal}>
          <div className="admin-kpi-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="admin-kpi-modal__header">
                <h2>Update KPI</h2>
                <h2>Level : {kpiId}</h2>
              </div>
              <table className="admin-kpi-modal__table">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>To</th>
                    <th>Bonus (%)</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectKpi || []).map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={formatCurrency(item.revenue_from)}
                          onChange={(e) => {
                            const value = parseCurrencyInput(e.target.value);
                            handleInputChange(index, "revenue_from", value);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formatCurrency(item.revenue_to)}
                          onChange={(e) => {
                            const value = parseCurrencyInput(e.target.value);
                            handleInputChange(index, "revenue_to", value);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={(item.bonus_percent * 100).toFixed(1)}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "bonus_percent",
                              e.target.value / 100
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          min={0}
                          max={10}
                          type="number"
                          value={item.performance_score || 0}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "performance_score",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-kpi__delete-button"
                          onClick={() => deleteRow(index)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>
                      <button
                        type="button"
                        className="admin-kpi-modal__add-button"
                        onClick={addNewRow}
                      >
                        ➕ Add Row
                      </button>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <div className="admin-kpi-modal__button-container">
                <button
                  type="submit"
                  className="admin-kpi-modal__button"
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
