import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParentFinanceData,
  fetchParentFeeBreakdown,
} from "../../Store/Slices/Parent/Finance/finance.action.js";
import { fetchChildren } from "../../Store/Slices/Parent/Children/children.action";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { RiErrorWarningFill, RiSignalWifiErrorFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";
import { FaMoneyBillWave } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";

function filterAndSearchData(data, filters, searchTerm, isChildBreakdown) {
  if (!data) return [];
  let result = data;

  // Filter by status
  if (filters.status !== "All") {
    result = result.filter((item) => item.status === filters.status);
  }

  // Search
  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    result = result.filter((item) => {
      const feeTypeOrCategory = isChildBreakdown
        ? (item.category || "").toLowerCase()
        : (item.feeType || "").toLowerCase();
      const paidBy = (item.paidBy || "").toLowerCase();
      const dueDate = (item.dueDate || "").toLowerCase();
      const amount = String(item.amount || "").toLowerCase();
      const status = (item.status || "").toLowerCase();

      return (
        feeTypeOrCategory.includes(lower) ||
        paidBy.includes(lower) ||
        dueDate.includes(lower) ||
        amount.includes(lower) ||
        status.includes(lower)
      );
    });
  }

  return result;
}

/** Renders a colored status badge using Tailwind classes. */
function getStatusBadge(status) {
  const colorMap = {
    Unpaid: "bg-red-100 text-red-600",
    Paid: "bg-green-100 text-green-600",
    Partial: "bg-yellow-100 text-yellow-600",
  };
  const colorClass = colorMap[status] || "bg-blue-100 text-blue-600";
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
}

/** Determines text color for amounts in the expanded row. */
function getAmountColorClass(label, value) {
  switch (label) {
    case "Paid Amount":
      return "text-green-600 font-semibold";
    case "Remaining Amount":
      return value > 0
        ? "text-red-600 font-semibold"
        : "text-green-600 font-semibold";
    case "Total Amount":
      return "text-blue-600 font-semibold";
    default:
      return "text-gray-800";
  }
}

/** A single row item in the expanded section. */
const RowItem = ({ label, value }) => {
  const colorClass = getAmountColorClass(label, value);
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={colorClass}>{value}</span>
    </div>
  );
};

const ParentFinanceTable = () => {
  const { t } = useTranslation("prtFinance");
  const dispatch = useDispatch();

  const {
    financeData,
    totalUnpaidFees,
    totalPaidFees,
    loading: financeLoading,
    error,
  } = useSelector((state) => state?.Parent?.finance || {});

  const currentUserId = useSelector((state) => state?.Auth?.user?.id);

  // Child-related states
  const [childList, setChildList] = useState([]);
  const [childLoading, setChildLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({ status: "All" });
  const [searchTerm, setSearchTerm] = useState("");

  // Child selection
  const [selectedChildId, setSelectedChildId] = useState("");

  // Child Fee Breakdown
  const [childFeeBreakdown, setChildFeeBreakdown] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState(null);

  // For expanding rows
  const [expandedRowKey, setExpandedRowKey] = useState(null);

  useNavHeading(t("Children Fees"));

  // 1) Fetch Finance Data
  useEffect(() => {
    dispatch(fetchParentFinanceData());
  }, [dispatch]);

  // 2) Fetch Child List
  useEffect(() => {
    setChildLoading(true);
    dispatch(fetchChildren(currentUserId))
      .then((resultAction) => {
        const payload = resultAction?.payload;
        setChildList(payload || []);
      })
      .catch(() => {
        setChildList([]);
      })
      .finally(() => {
        setChildLoading(false);
      });
  }, [currentUserId, dispatch]);

  // 3) Handle Child Select => fetch child breakdown or revert to default
  const handleChildSelect = async (childId) => {
    // If user chooses "All Children" => revert to default data
    if (!childId) {
      setSelectedChildId("");
      setChildFeeBreakdown(null);
      setBreakdownError(null);
      setBreakdownLoading(false);
      return;
    }

    setSelectedChildId(childId);
    setChildFeeBreakdown(null);
    setBreakdownError(null);
    setBreakdownLoading(true);

    try {
      const resultAction = await dispatch(
        fetchParentFeeBreakdown({ studentId: childId })
      );
      const payload = resultAction?.payload;

      if (payload?.success) {
        const childData = payload.feeBreakdown[0];
        if (!childData) {
          setChildFeeBreakdown([]);
        } else {
          const rows = Object.entries(childData.feeCategories).map(
            ([catName, catVal]) => {
              let rowStatus = "Paid";
              if (catVal.remainingAmount > 0 && catVal.paidAmount > 0) {
                rowStatus = "Partial";
              } else if (
                catVal.remainingAmount > 0 &&
                catVal.paidAmount === 0
              ) {
                rowStatus = "Unpaid";
              }
              return {
                key: catName,
                category: catName,
                paidBy: childData.student,
                dueDate: catVal.dueDates?.[0]
                  ? catVal.dueDates[0].slice(0, 10)
                  : "N/A",
                amount: catVal.finalAmount || 0,
                status: rowStatus,
                cycle: catVal.cycle || "N/A",
                totalAmount: catVal.totalAmount || 0,
                paidAmount: catVal.paidAmount || 0,
                remainingAmount: catVal.remainingAmount || 0,
                allDueDates: catVal.dueDates || [],
              };
            }
          );
          setChildFeeBreakdown(rows);
        }
      } else {
        setChildFeeBreakdown([]);
        setBreakdownError(payload?.message || "");
      }
    } catch (err) {
      setChildFeeBreakdown([]);
      setBreakdownError(err.message || "Error fetching fee breakdown.");
    } finally {
      setBreakdownLoading(false);
    }
  };

  // Determine which data to show
  const isUsingBreakdown =
    Boolean(selectedChildId) && childFeeBreakdown !== null;
  let rawData = [];
  let isChildData = false;

  if (isUsingBreakdown) {
    rawData = childFeeBreakdown;
    isChildData = true;
  } else {
    if (error) {
      rawData = [];
    } else if (financeLoading) {
      // Show skeleton placeholders
      rawData = Array.from({ length: 5 }, (_, i) => ({
        key: `skeleton-${i}`,
        skeleton: true,
      }));
    } else {
      rawData = financeData || [];
    }
  }

  // Filter & Search
  const finalTableData = useMemo(() => {
    if (rawData.some((item) => item.skeleton)) return rawData;
    return filterAndSearchData(rawData, filters, searchTerm, isChildData);
  }, [rawData, filters, searchTerm, isChildData]);

  // Expand or collapse a row
  const handleExpandRow = (rowKey) => {
    setExpandedRowKey((prev) => (prev === rowKey ? null : rowKey));
  };

  /** Renders a skeleton row if data is still loading. */
  const renderSkeletonRow = (key) => {
    return (
      <tr key={key} className="animate-pulse">
        {/* Each cell is a gray block for placeholder */}
        <td className="py-3 px-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </td>
        <td className="py-3 px-4">
          <div className="h-4 bg-gray-200 rounded w-12" />
        </td>
        <td className="py-3 px-4">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </td>
        <td className="py-3 px-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </td>
        <td className="py-3 px-4">
          <div className="h-4 bg-gray-200 rounded w-14" />
        </td>
        <td className="py-3 px-4">
          <div className="h-8 bg-gray-200 rounded w-16" />
        </td>
      </tr>
    );
  };

  /** Expanded row content (e.g. cycle, total amount, etc.) */
  const renderExpandedRow = (record) => (
    <tr className="bg-white">
      <td colSpan={6} className="p-4 border border-gray-200">
        <div className="flex flex-col gap-2">
          <RowItem label="Cycle" value={record.cycle} />
          <RowItem label="Total Amount" value={record.totalAmount} />
          <RowItem label="Paid Amount" value={record.paidAmount} />
          <RowItem label="Remaining Amount" value={record.remainingAmount} />
          <RowItem
            label="All Due Dates"
            value={
              record.allDueDates.length
                ? record.allDueDates.map((d) => d.slice(0, 10)).join(", ")
                : "N/A"
            }
          />
        </div>
      </td>
    </tr>
  );

  const getNumericValue = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      return Number(value.replace(/\D/g, "")) || 0;
    }
    return 0;
  };

  const unpaidFeesAmount = getNumericValue(totalUnpaidFees);

  return (
    <Layout title={t("Parents | Children Fees")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="flex flex-col gap-6 w-full px-2">
          {/* Two-box layout with min-h-screen */}
          <div className="flex flex-col md:flex-row gap-2 min-h-screen">
            {/* Left Box: Finance Part with right border */}
            <div className="md:w-3/4 md:border-r md:border-gray-300 p-4">
              {/* Top Controls Row */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                {/* Left: Search box */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
                    style={{ minWidth: "350px" }}
                  />
                  <CiSearch className="absolute right-3 text-gray-500" />
                </div>

                {/* Right: Child & Status selects */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm mb-1">Select Your Children</span>
                    {childLoading ? (
                      <div className="w-40 h-10 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <select
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none"
                        style={{ width: "160px" }}
                        value={selectedChildId}
                        onChange={(e) => handleChildSelect(e.target.value)}
                      >
                        {/* All Children Option */}
                        <option value="">All Children</option>
                        {childList.map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm mb-1">Status</span>
                    <select
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none"
                      style={{ width: "100px" }}
                      value={filters.status}
                      onChange={(e) => setFilters({ status: e.target.value })}
                    >
                      {["All", "Paid", "Unpaid", "Partial"].map((status) => (
                        <option key={status} value={status}>
                          {t(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="w-full overflow-x-auto">
                {error ? (
                  <div className="flex flex-col items-center justify-center my-8">
                    <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
                    <p className="text-gray-600 text-lg">
                      Failed to fetch finance data
                    </p>
                  </div>
                ) : (
                  <>
                    {breakdownError && (
                      <p className="text-red-500 mb-2">{breakdownError}</p>
                    )}
                    <table className="min-w-full bg-white border border-gray-200 text-sm rounded-lg">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th className="py-2 px-3 text-left">Fee Type</th>
                          <th className="py-2 px-3 text-left">Paid By</th>
                          <th className="py-2 px-3 text-left">Due Date</th>
                          <th className="py-2 px-3 text-left">Amount</th>
                          <th className="py-2 px-3 text-left">Status</th>
                          <th className="py-2 px-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {finalTableData.some((item) => item.skeleton) &&
                          finalTableData.map((item) =>
                            renderSkeletonRow(item.key)
                          )}

                        {!finalTableData.some((item) => item.skeleton) &&
                          finalTableData.map((record) => {
                            const isExpanded = expandedRowKey === record.key;
                            return (
                              <React.Fragment key={record.key}>
                                <tr
                                  className="border-b border-gray-200 hover:bg-gray-50"
                                  onClick={() =>
                                    isUsingBreakdown
                                      ? handleExpandRow(record.key)
                                      : null
                                  }
                                >
                                  <td className="py-3 px-4">
                                    {record.feeType ?? record.category ?? "—"}
                                  </td>
                                  <td className="py-3 px-4">
                                    {record.paidBy || "—"}
                                  </td>
                                  <td className="py-3 px-4">
                                    {record.dueDate || "N/A"}
                                  </td>
                                  <td className="py-3 px-4">
                                    {record.amount || 0}
                                  </td>
                                  <td className="py-3 px-4">
                                    {record.status
                                      ? getStatusBadge(record.status)
                                      : "No Status"}
                                  </td>
                                  <td className="py-3 px-4">
                                    {record.skeleton ? (
                                      <div className="w-16 h-8 bg-gray-200 animate-pulse rounded" />
                                    ) : record.status === "Paid" ? (
                                      <button
                                        className="bg-green-100 text-green-700 font-semibold px-4 py-1 rounded-md"
                                        disabled
                                      >
                                        {t("Completed")}
                                      </button>
                                    ) : (
                                      <button className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-semibold px-4 py-1 rounded-md">
                                        {t("Pay Now")}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                                {isExpanded && renderExpandedRow(record)}
                              </React.Fragment>
                            );
                          })}

                        {!finalTableData.length &&
                          !financeLoading &&
                          !breakdownLoading && (
                            <tr>
                              <td
                                colSpan={6}
                                className="py-6 px-4 text-center text-gray-500"
                              >
                                <div className="flex flex-col items-center">
                                  <FcMoneyTransfer className="w-12 h-12 mb-2" />
                                  <span>No Fees Found</span>
                                </div>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>

            {/* Right Box: Cards */}
            <div className="md:w-1/4 flex flex-col gap-4 p-2 py-4">
              {/* Card 1: Total Unpaid Fees */}
              <div className="flex flex-col p-4 border border-gray-300 rounded-lg transition-transform">
                <div className="flex items-center justify-center mb-2">
                  <MdAccessTime className="text-2xl text-red-400" />
                </div>
                <span className="text-sm text-center">
                  {t("Total Unpaid Fees")}
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center">
                  {unpaidFeesAmount} QR
                </span>
                {unpaidFeesAmount > 0 ? (
                  <button className="flex items-center bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white p-1 w-full justify-center px-5 rounded-full mt-2">
                    {t("Pay Now")}
                  </button>
                ) : (
                  <div className="bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold text-center rounded-full mt-2 mx-auto w-1/2">
                    {t("All Cleared")}
                  </div>
                )}
              </div>

              {/* Card 2: Total Paid Fees */}
              <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg transition-transform">
                <div className="flex items-center justify-center mb-2">
                  <GiExpense className="text-3xl text-red-400" />
                </div>
                <span className="text-md font-medium text-gray-700">
                  {t("Total Paid Fees")}
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center mt-1">
                  {totalPaidFees || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default ParentFinanceTable;
