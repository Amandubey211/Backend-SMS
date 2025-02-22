import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParentFinanceData } from "../../Store/Slices/Parent/Finance/finance.action.js";
import { fetchChildren } from "../../Store/Slices/Parent/Children/children.action";
import { fetchParentFeeBreakdown } from "../../Store/Slices/Parent/Finance/finance.action.js";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Select, Avatar, Table, Skeleton, Tag } from "antd";
import Spinner from "../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";

const { Option } = Select;

/** Helper to avoid duplicates in filters (existing logic) */
const uniqueFilterOptions = (data, key) => {
  return [...new Set(data?.map((item) => item?.[key])?.filter(Boolean))].sort();
};

/** Render network error in the table if something fails */
const renderError = () => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
      <p className="text-gray-600 text-lg">Failed to fetch finance data</p>
    </div>
  );
};

const ParentFinanceTable = () => {
  const { t } = useTranslation("prtFinance");
  const dispatch = useDispatch();

  // ---------- Existing Finance Data (default) ----------
  const { financeData, totalUnpaidFees, totalPaidFees, loading, error } =
    useSelector((state) => state?.Parent?.finance || {});

  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useNavHeading(t("Child Fees"));

  // Tag colors for status
  const tagColors = ["purple", "red", "blue", "green", "orange", "cyan", "magenta", "gold", "lime"];

  // Convert "Paid", "Unpaid", "Partial" -> color; else random
  const getStatusTag = (status) => {
    const statusColorMap = {
      Unpaid: "red",
      Paid: "green",
      Partial: "gold",
    };
    const color = statusColorMap[status] || tagColors[Math.floor(Math.random() * tagColors.length)];
    return (
      <Tag color={color} style={{ fontWeight: 500, borderRadius: "12px", padding: "4px 10px" }}>
        {status}
      </Tag>
    );
  };

  // Fetch overall finance data on mount
  useEffect(() => {
    dispatch(fetchParentFinanceData());
  }, [dispatch]);

  // ---------- Filtering & Searching for the existing financeData ----------
  const filteredFeesDetails = useMemo(() => {
    if (!financeData) return [];
    let data = financeData.filter(
      (item) =>
        (filters.status === "Everyone" || item?.status === filters.status) &&
        (!filters.feesType || item?.feeType === filters.feesType)
    );
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item?.feeType?.toLowerCase().includes(lowerSearch) ||
          item?.paidBy?.toLowerCase().includes(lowerSearch) ||
          item?.dueDate?.toLowerCase().includes(lowerSearch) ||
          String(item?.amount)?.toLowerCase().includes(lowerSearch) ||
          item?.status?.toLowerCase().includes(lowerSearch)
      );
    }
    return data;
  }, [financeData, filters, searchTerm]);

  // "No Data" message if the existing data is empty
  const noDataMessage = useMemo(() => {
    if (filters.status === "Paid") return t("No Paid Entries Available");
    if (filters.status === "Unpaid") return t("No Unpaid Entries Available");
    return t("No Finance Data Available for Now");
  }, [filters.status, t]);

  // Handler for radio filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- CHILDREN DROPDOWN & FEE BREAKDOWN ----------
  const { children: childList = [], loading: childLoading } = useSelector(
    (state) => state?.Parent?.children || {}
  );
  const currentUserId = useSelector((state) => state?.Auth?.user?.id);

  const hasFetchedChildren = useRef(false);
  useEffect(() => {
    if (currentUserId && !hasFetchedChildren.current) {
      dispatch(fetchChildren(currentUserId));
      hasFetchedChildren.current = true;
    }
  }, [currentUserId, dispatch]);

  // The child selected in the dropdown
  const [selectedChildId, setSelectedChildId] = useState("");
  // The child's fee breakdown data (if any)
  const [childFeeBreakdown, setChildFeeBreakdown] = useState(null);
  // Loading & error states for the breakdown request
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState(null);

  /**
   * On child selection, fetch fee breakdown & adapt it to a data format
   * that can be displayed in the existing table with expand rows.
   */
  const handleChildSelect = async (childId) => {
    setSelectedChildId(childId);
    setBreakdownLoading(true);
    setBreakdownError(null);
    setChildFeeBreakdown(null);

    if (!childId) {
      // If user clears the dropdown, revert to default table
      setBreakdownLoading(false);
      return;
    }

    try {
      const resultAction = await dispatch(fetchParentFeeBreakdown({ studentId: childId }));
      const payload = resultAction?.payload;

      if (payload?.success) {
        // Usually payload.feeBreakdown is an array of 1 or more children
        // Each child has feeCategories: { "Tuition Fees": {...}, "Transport Fees": {...} }
        // We'll convert them into rows for the table.

        // For now, assume only 1 child object if a single studentId is used:
        const childData = payload.feeBreakdown[0];
        if (!childData) {
          // e.g. if no fees for that child
          setChildFeeBreakdown([]);
        } else {
          // Convert each feeCategories key into a row
          const rows = Object.entries(childData.feeCategories).map(([catName, catVal]) => {
            // Determine status: if remainingAmount > 0 -> "Unpaid"/"Partial" or "Paid"
            let rowStatus = "Paid";
            if (catVal.remainingAmount > 0 && catVal.paidAmount > 0) {
              rowStatus = "Partial";
            } else if (catVal.remainingAmount > 0 && catVal.paidAmount === 0) {
              rowStatus = "Unpaid";
            }

            // For the main columns:
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
        // e.g. Invalid studentId or some server error message
        // If there's a message in payload, show it; else fallback
        setBreakdownError(payload?.message || "No Fees Data available. Please check later.");
      }
    } catch (err) {
      setBreakdownError(err.message || "Error fetching fee breakdown.");
    } finally {
      setBreakdownLoading(false);
    }
  };

  // Renders each child in the dropdown with a small avatar + name
  const renderChildOption = (child) => (
    <div className="flex items-center gap-2">
      <Avatar src={child.profile} size="small" />
      <span>{child.name}</span>
    </div>
  );

  // ---------- Table Data Handling ----------
  // If no child is selected, we show existing finance data
  // If a child is selected & we have breakdown data, we show that instead
  const isChildSelected = Boolean(selectedChildId);
  const isUsingBreakdown = isChildSelected && childFeeBreakdown && !breakdownError;
  const finalTableData = useMemo(() => {
    if (isUsingBreakdown) {
      // Return the child's breakdown data
      return childFeeBreakdown;
    }
    // Otherwise, fallback to existing finance data or skeleton/error
    if (loading) {
      return Array.from({ length: 5 }, (_, i) => ({ key: `skeleton-${i}`, skeleton: true }));
    }
    if (error) {
      return []; // no rows if there's an error
    }
    // show filtered fees details
    return filteredFeesDetails.map((item, index) => ({
      ...item,
      key: `fee-${index}`,
    }));
  }, [isUsingBreakdown, childFeeBreakdown, breakdownError, loading, error, filteredFeesDetails]);

  // ---------- Expandable Row: show extra details for breakdown categories ----------
  // Only used if isUsingBreakdown = true
  const expandedRowRender = (record) => {
    // record = { category, cycle, totalAmount, paidAmount, remainingAmount, allDueDates, ... }
    return (
      <div className="p-2 bg-gray-50 rounded-md">
        <p className="text-sm">
          <strong>Cycle:</strong> {record.cycle}
        </p>
        <p className="text-sm">
          <strong>Total Amount:</strong> {record.totalAmount}
        </p>
        <p className="text-sm">
          <strong>Paid Amount:</strong> {record.paidAmount}
        </p>
        <p className="text-sm">
          <strong>Remaining Amount:</strong> {record.remainingAmount}
        </p>
        <p className="text-sm">
          <strong>All Due Dates:</strong>{" "}
          {record.allDueDates.length > 0
            ? record.allDueDates.map((d) => d.slice(0, 10)).join(", ")
            : "N/A"}
        </p>
      </div>
    );
  };

  // ---------- Define columns for final usage in <Table> ----------
  // We can reuse the existing columns, but override some dataIndex if using breakdown
  // Because breakdown data uses different field names:
  const mainColumns = useMemo(() => {
    if (!isUsingBreakdown) {
      // Original columns for financeData
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

    // If we are using breakdown data, adapt the columns
    // (some fields differ: category, paidBy, dueDate, amount, status)
    return [
      {
        title: t("Fee Type"),
        dataIndex: "category", // instead of "feeType"
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
          // If status is "Paid" => Completed, else Pay Now
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
  }, [isUsingBreakdown, childFeeBreakdown, loading, error, t]);

  return (
    <Layout title={t("Child Fees | Parents")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="flex flex-col w-full">
          {/* ---- TOP CARDS (like dashboard) ---- */}
          <div className="grid grid-cols-2 gap-4 w-full px-4 py-4">
            {/* Card 1: Total Unpaid Fees */}
            <div className="flex flex-col p-4 border border-gray-300 rounded-lg transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-2">
                <MdAccessTime className="text-2xl text-red-400" />
              </div>
              <span className="text-sm text-center">{t("Total Unpaid Fees")}</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center">
                {totalUnpaidFees || "0"}
              </span>
              <button className="flex items-center bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white p-1 w-full justify-center px-5 rounded-full mt-2">
                {t("Pay Now")}
              </button>
            </div>

            {/* Card 2: Total Paid Fees */}
            <div className="flex flex-col p-4 border border-gray-300 rounded-lg transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-2">
                <GiExpense className="text-2xl text-red-400" />
              </div>
              <span className="text-sm text-center">{t("Total Paid Fees")}</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center">
                {totalPaidFees || "0"}
              </span>
            </div>
          </div>

          {/* ---- FILTERS, CHILD DROPDOWN & SEARCH BAR ROW ---- */}
          <div className="flex p-[10px] justify-between items-center">
            {/* Left: Radio filters (Everyone, Paid, Unpaid) */}
            <div className="flex gap-4">
              {["Everyone", "Paid", "Unpaid"].map((status) => (
                <div key={status}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={filters.status === status}
                      onChange={handleFilterChange}
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

            {/* Middle: Child Dropdown */}
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
                      {renderChildOption(child)}
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
            {/* Show an error if there's a top-level error from fetchParentFinanceData */}
            {error ? (
              renderError()
            ) : (
              <>
                {/* Show a red error if the breakdown fails (like "Invalid studentId") */}
                {breakdownError && (
                  <p className="text-red-500 mb-2">{breakdownError}</p>
                )}

                <Table
                  columns={mainColumns}
                  dataSource={finalTableData}
                  pagination={{ pageSize: 5 }}
                  loading={false}
                  // Only use expand if we're using the breakdown data
                  expandable={
                    isUsingBreakdown
                      ? {
                        expandedRowRender,
                        rowExpandable: (record) => !record.skeleton, // no expand for skeleton rows
                      }
                      : undefined
                  }
                  locale={{
                    emptyText: loading
                      ? null
                      : (
                        <div className="flex flex-col items-center justify-center mt-8">
                          <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                          <p className="text-gray-600 text-lg">
                            {isUsingBreakdown
                              ? "No Breakdown Data"
                              : noDataMessage}
                          </p>
                        </div>
                      ),
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
