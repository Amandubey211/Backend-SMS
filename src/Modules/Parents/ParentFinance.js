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
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { Select, Avatar, Table, Skeleton, Tag, Empty } from "antd";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";

const { Option } = Select;

/* 
  1) filterAndSearchData:
     - Filters data by "Everyone", "Paid", "Unpaid", "Partial".
     - Applies searchTerm across either 'feeType' or 'category' plus other fields.
*/
function filterAndSearchData(data, filters, searchTerm, isChildBreakdown) {
  if (!data) return [];
  let result = data;

  // Filter by status
  if (filters.status !== "Everyone") {
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

/*
  2) getStatusTag:
     Renders a colored tag for "Paid", "Unpaid", or "Partial".
*/
function getStatusTag(status) {
  const map = { Unpaid: "red", Paid: "green", Partial: "gold" };
  return (
    <Tag
      color={map[status] || "blue"}
      style={{ fontWeight: 500, borderRadius: "12px", padding: "4px 10px" }}
    >
      {status}
    </Tag>
  );
}

/*
  3) getAmountColorClass:
     Returns a Tailwind class for color-coding amounts in the expanded row.
     - "Paid Amount" => green
     - "Remaining Amount" => red if > 0 else green
     - "Total Amount" => blue
*/
function getAmountColorClass(label, value) {
  switch (label) {
    case "Paid Amount":
      return "text-green-600 font-semibold";
    case "Remaining Amount":
      return value > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold";
    case "Total Amount":
      return "text-blue-600 font-semibold";
    default:
      return "text-gray-800";
  }
}

/*
  4) RowItem:
     - Used in the expanded row to show label + colored value
*/
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

  // -------------- Finance Data (Redux) --------------
  const {
    financeData,
    totalUnpaidFees,
    totalPaidFees,
    loading: financeLoading,
    error,
  } = useSelector((state) => state?.Parent?.finance || {});

  // -------------- Children (Redux) --------------
  // We always fetch the latest children from the API.
  const { children: childList = [], loading: childLoading } = useSelector(
    (state) => state?.Parent?.children || {}
  );
  const currentUserId = useSelector((state) => state?.Auth?.user?.id);

  // -------------- Table Filters --------------
  const [filters, setFilters] = useState({ status: "Everyone" });
  const [searchTerm, setSearchTerm] = useState("");

  // -------------- 1) Fetch Finance Data --------------
  useEffect(() => {
    dispatch(fetchParentFinanceData());
  }, [dispatch]);

  // -------------- 2) Fetch Children Always --------------
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchChildren(currentUserId));
    }
  }, [currentUserId, dispatch]);

  // -------------- 3) Child Fee Breakdown --------------
  const [selectedChildId, setSelectedChildId] = useState("");
  const [childFeeBreakdown, setChildFeeBreakdown] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState(null);

  // On selecting a child => fetch fee breakdown
  const handleChildSelect = async (childId) => {
    setSelectedChildId(childId);
    setChildFeeBreakdown(null);
    setBreakdownError(null);

    if (!childId) {
      // Clearing the dropdown => revert to default
      setBreakdownLoading(false);
      return;
    }

    setBreakdownLoading(true);
    try {
      const resultAction = await dispatch(fetchParentFeeBreakdown({ studentId: childId }));
      const payload = resultAction?.payload;

      if (payload?.success) {
        const childData = payload.feeBreakdown[0];
        if (!childData) {
          // No fees => triggers "No Data"
          setChildFeeBreakdown([]);
        } else {
          // Convert each feeCategory into a table row
          const rows = Object.entries(childData.feeCategories).map(([catName, catVal]) => {
            let rowStatus = "Paid";
            if (catVal.remainingAmount > 0 && catVal.paidAmount > 0) {
              rowStatus = "Partial";
            } else if (catVal.remainingAmount > 0 && catVal.paidAmount === 0) {
              rowStatus = "Unpaid";
            }
            return {
              key: catName,
              category: catName,
              paidBy: childData.student,
              dueDate: catVal.dueDates?.[0] ? catVal.dueDates[0].slice(0, 10) : "N/A",
              amount: catVal.finalAmount || 0,
              status: rowStatus,
              cycle: catVal.cycle || "N/A",
              totalAmount: catVal.totalAmount || 0,
              paidAmount: catVal.paidAmount || 0,
              remainingAmount: catVal.remainingAmount || 0,
              allDueDates: catVal.dueDates || [],
            };
          });
          setChildFeeBreakdown(rows);
        }
      } else {
        // e.g. { "message": "Invalid studentId..." }
        // => triggers "No Data"
        setChildFeeBreakdown([]);
        setBreakdownError(payload?.message || "");
      }
    } catch (err) {
      // On error => empty => "No Data"
      setChildFeeBreakdown([]);
      setBreakdownError(err.message || "Error fetching fee breakdown.");
    } finally {
      setBreakdownLoading(false);
    }
  };

  // If child is selected + we have breakdown data => use child data
  const isUsingBreakdown = Boolean(selectedChildId) && childFeeBreakdown !== null;
  let rawData;
  let isChildData = false;

  if (isUsingBreakdown) {
    rawData = childFeeBreakdown; // array or []
    isChildData = true;
  } else {
    // default finance data
    if (error) {
      rawData = [];
    } else if (financeLoading) {
      // skeleton placeholders
      rawData = Array.from({ length: 5 }, (_, i) => ({
        key: `skeleton-${i}`,
        skeleton: true,
      }));
    } else {
      rawData = financeData || [];
    }
  }

  // -------------- Filter + Search --------------
  const finalTableData = useMemo(() => {
    if (rawData.some((item) => item.skeleton)) return rawData;
    return filterAndSearchData(rawData, filters, searchTerm, isChildData);
  }, [rawData, filters, searchTerm, isChildData]);

  // -------------- Expanded Row --------------
  const expandedRowRender = (record) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
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
    </div>
  );

  // -------------- Table Columns --------------
  const mainColumns = useMemo(() => {
    if (!isChildData) {
      // Default finance data columns
      return [
        {
          title: t("Fee Type"),
          dataIndex: "feeType",
          key: "feeType",
          render: (text, record) =>
            record.skeleton ? (
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            ) : (
              text || t("No Fee Type")
            ),
        },
        {
          title: t("Paid By"),
          dataIndex: "paidBy",
          key: "paidBy",
          render: (text, record) =>
            record.skeleton ? (
              <Skeleton.Input active size="small" style={{ width: 70 }} />
            ) : (
              text || "------"
            ),
        },
        {
          title: t("Due Date"),
          dataIndex: "dueDate",
          key: "dueDate",
          render: (text, record) =>
            record.skeleton ? (
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            ) : (
              text || "No Due Date"
            ),
        },
        {
          title: t("Amount"),
          dataIndex: "amount",
          key: "amount",
          render: (text, record) =>
            record.skeleton ? (
              <Skeleton.Input active size="small" style={{ width: 60 }} />
            ) : (
              text || "No Amount"
            ),
        },
        {
          title: t("Status"),
          dataIndex: "status",
          key: "status",
          render: (text, record) =>
            record.skeleton ? (
              <Skeleton.Input active size="small" style={{ width: 60 }} />
            ) : (
              getStatusTag(text || "No Status")
            ),
        },
        {
          title: t("Action"),
          dataIndex: "action",
          key: "action",
          render: (_, record) =>
            record.skeleton ? (
              <Skeleton.Button active size="small" shape="round" />
            ) : record.status === "Paid" ? (
              <button
                className="bg-[#E9F8EB] text-[#0D9755] font-semibold px-4 py-1 rounded-md"
                disabled
              >
                {t("Completed")}
              </button>
            ) : (
              <button className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-semibold px-4 py-1 rounded-md">
                {t("Pay Now")}
              </button>
            ),
        },
      ];
    }

    // Child breakdown columns
    return [
      {
        title: t("Fee Type"),
        dataIndex: "category",
        key: "category",
        render: (text, record) =>
          record.skeleton ? (
            <Skeleton.Input active size="small" style={{ width: 80 }} />
          ) : (
            text || t("No Fee Type")
          ),
      },
      {
        title: t("Paid By"),
        dataIndex: "paidBy",
        key: "paidBy",
        render: (text, record) =>
          record.skeleton ? (
            <Skeleton.Input active size="small" style={{ width: 70 }} />
          ) : (
            text || "------"
          ),
      },
      {
        title: t("Due Date"),
        dataIndex: "dueDate",
        key: "dueDate",
        render: (text, record) =>
          record.skeleton ? (
            <Skeleton.Input active size="small" style={{ width: 80 }} />
          ) : (
            text || "N/A"
          ),
      },
      {
        title: t("Amount"),
        dataIndex: "amount",
        key: "amount",
        render: (text, record) =>
          record.skeleton ? (
            <Skeleton.Input active size="small" style={{ width: 60 }} />
          ) : (
            text || 0
          ),
      },
      {
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        render: (text, record) =>
          record.skeleton ? (
            <Skeleton.Input active size="small" style={{ width: 60 }} />
          ) : (
            getStatusTag(text || "No Status")
          ),
      },
      {
        title: t("Action"),
        dataIndex: "action",
        key: "action",
        render: (_, record) => {
          if (record.skeleton) {
            return <Skeleton.Button active size="small" shape="round" />;
          }
          if (record.status === "Paid") {
            return (
              <button
                className="bg-[#E9F8EB] text-[#0D9755] font-semibold px-4 py-1 rounded-md"
                disabled
              >
                {t("Completed")}
              </button>
            );
          }
          return (
            <button className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-semibold px-4 py-1 rounded-md">
              {t("Pay Now")}
            </button>
          );
        },
      },
    ];
  }, [isChildData, t]);

  // Update nav heading
  useNavHeading(t("Children Fees"));

  const getNumericValue = (value) => {
    if (!value) return 0; // Handle null, undefined, empty string
    if (typeof value === "number") return value; // Already a number, return as is
    if (typeof value === "string") {
      return Number(value.replace(/\D/g, "")) || 0; // Remove non-numeric characters (e.g., "QR")
    }
    return 0; // Fallback case
  };

  const unpaidFeesAmount = getNumericValue(totalUnpaidFees);


  return (
    <Layout title={t("Child Fees | Parents")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="flex flex-col w-full">
          {/* ---- TOP CARDS ---- */}
          <div className="grid grid-cols-2 gap-4 w-full px-4 py-4">
            {/* Card 1: Total Unpaid Fees */}
            <div className="flex flex-col p-4 border border-gray-300 rounded-lg transition-transform">
              <div className="flex items-center justify-center mb-2">
                <MdAccessTime className="text-2xl text-red-400" />
              </div>
              <span className="text-sm text-center">{t("Total Unpaid Fees")}</span>

              {/* Display Cleaned Unpaid Fees */}
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center">
                {unpaidFeesAmount} QR
              </span>

              {/* Corrected Conditional Rendering */}
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
              <span className="text-md font-medium text-gray-700">{t("Total Paid Fees")}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center mt-1">
                {totalPaidFees || "0"}
              </span>
            </div>
          </div>

          {/* ---- FILTERS, CHILD DROPDOWN & SEARCH BAR ---- */}
          <div className="flex p-[10px] justify-between items-center">
            {/* Left: Radio filters */}
            <div className="flex gap-[0.5rem]">
              {["Everyone", "Paid", "Unpaid", "Partial"].map((status) => (
                <div key={status}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={filters.status === status}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                      }
                      className="hidden"
                    />
                    <div
                      className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${filters.status === status
                        ? "border-green-500 bg-white"
                        : "border-gray-300 bg-white"
                        }`}
                      style={{ position: "relative" }}
                    >
                      {filters.status === status && (
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: "#0D9755",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        ></div>
                      )}
                    </div>
                    <span
                      className={`transition-colors duration-200 ${filters.status === status ? "text-green-700" : "text-gray-700"
                        }`}
                      style={{ paddingLeft: "2px" }}
                    >
                      {t(status)}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            {/* Middle: Child Dropdown (always from Redux, always re-fetched) */}
            <div className="relative flex items-center max-w-xs w-full mr-4">
              {childLoading ? (
                <Skeleton.Input active style={{ width: 200 }} />
              ) : (
                <Select
                  placeholder="Select Child"
                  style={{ width: 200 }}
                  value={selectedChildId || undefined}
                  onChange={handleChildSelect}
                  allowClear
                >
                  {childList.map((child) => (
                    <Option key={child.id} value={child.id}>
                      <div className="flex items-center gap-2">
                        <Avatar src={child.profile} size="small" />
                        <span>{child.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              )}
            </div>

            {/* Right: Search bar */}
            <div className="relative flex items-center max-w-xs w-full mr-4">
              <input
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
              />
              <button className="absolute right-3">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* ---- TABLE SECTION ---- */}
          <div className="px-4 pb-4">
            {error ? (
              <div className="flex flex-col items-center justify-center my-8">
                <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
                <p className="text-gray-600 text-lg">Failed to fetch finance data</p>
              </div>
            ) : (
              <>
                {/* If breakdownError => show it once (but still show table if childFeeBreakdown is empty) */}
                {breakdownError && (
                  <p className="text-red-500 mb-2">{breakdownError}</p>
                )}

                <Table
                  columns={mainColumns}
                  dataSource={finalTableData}
                  pagination={{ pageSize: 5 }}
                  loading={breakdownLoading}
                  expandable={
                    isUsingBreakdown
                      ? {
                        expandedRowRender,
                        rowExpandable: (record) => !record.skeleton,
                      }
                      : undefined
                  }
                  locale={{
                    emptyText: <Empty />,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default ParentFinanceTable;
