import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { Select, Avatar, Table, Skeleton, Tag, Empty } from "antd";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";

// Destructure Option from Select
const { Option } = Select;

// A helper to unify the filtering + searching logic
function filterAndSearchData(data, filters, searchTerm, isChildBreakdown) {
  if (!data) return [];

  // 1) Filter by status: Everyone, Paid, Unpaid, Partial
  let result = data;
  if (filters.status !== "Everyone") {
    result = result.filter((item) => item.status === filters.status);
  }

  // 2) Filter by searchTerm
  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    // For child breakdown, fields: category, paidBy, dueDate, amount, status
    // For finance data, fields: feeType, paidBy, dueDate, amount, status
    // We'll unify by checking isChildBreakdown
    result = result.filter((item) => {
      // unify the text fields
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

const ParentFinanceTable = () => {
  const { t } = useTranslation("prtFinance");
  const dispatch = useDispatch();

  // -----------------------------
  // 1. FETCH DEFAULT FINANCE DATA
  // -----------------------------
  var { financeData, totalUnpaidFees, totalPaidFees, loading, error } =
    useSelector((state) => state?.Parent?.finance || {});

  // For the default table filters (radio + search)
  const [filters, setFilters] = useState({
    feesType: "",
    // ADDED "Partial" as an option => see radio group below
    status: "Everyone",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // On mount, fetch the default finance data
  useEffect(() => {
    dispatch(fetchParentFinanceData());
  }, [dispatch]);

  // 2) We'll keep the raw financeData in store, but we filter it here
  //    if user hasn't selected a child
  //    (the child selection logic is separate)
  // ------------------------------------------------------

  // -----------------------------
  // 2. FETCH CHILDREN
  // -----------------------------
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

  // -----------------------------
  // 3. CHILD BREAKDOWN LOGIC
  // -----------------------------
  const [selectedChildId, setSelectedChildId] = useState("");
  const [childFeeBreakdown, setChildFeeBreakdown] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState(null);

  // On child selection => fetch the child's fee breakdown
  const handleChildSelect = async (childId) => {
    setSelectedChildId(childId);
    setBreakdownError(null);
    setChildFeeBreakdown(null);

    if (!childId) {
      // user cleared the dropdown => revert to default
      setBreakdownLoading(false);
      return;
    }

    setBreakdownLoading(true);
    try {
      const resultAction = await dispatch(fetchParentFeeBreakdown({ studentId: childId }));
      const payload = resultAction?.payload;

      if (payload?.success) {
        // Usually only one child object if a single studentId is used
        const childData = payload.feeBreakdown[0];
        if (!childData) {
          // No fees => empty => triggers <Empty />
          setChildFeeBreakdown([]);
        } else {
          // Convert each feeCategory into a row
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
        setBreakdownError(payload?.message || "No Fees at the Moment for this Child, Please Check later.");
      }
    } catch (err) {
      setBreakdownError(err.message || "Error fetching fee breakdown.");
    } finally {
      setBreakdownLoading(false);
    }
  };

  // Renders child in dropdown with avatar + name
  const renderChildOption = (child) => (
    <div className="flex items-center gap-2">
      <Avatar src={child.profile} size="small" />
      <span>{child.name}</span>
    </div>
  );

  // True if child is selected + we have data (or empty array) + no error
  const isUsingBreakdown = Boolean(selectedChildId) && childFeeBreakdown && !breakdownError;

  // A helper to color the status
  const tagColors = ["purple", "red", "blue", "green", "orange", "cyan", "magenta", "gold", "lime"];
  const getStatusTag = (status) => {
    const map = { Unpaid: "red", Paid: "green", Partial: "gold" };
    const color = map[status] || tagColors[Math.floor(Math.random() * tagColors.length)];
    return (
      <Tag color={color} style={{ fontWeight: 500, borderRadius: "12px", padding: "4px 10px" }}>
        {status}
      </Tag>
    );
  };

  // We define final data either from child breakdown or the default finance
  // Then we apply the same filterAndSearchData for radio + search
  // This ensures "Partial" filter also works for child data
  let rawData;
  let isChildData = false;

  if (isUsingBreakdown) {
    rawData = childFeeBreakdown; // array or []
    isChildData = true;
  } else {
    // default finance data
    if (error) {
      // if top-level error => no rows
      rawData = [];
    } else if (loading) {
      // show skeleton rows
      rawData = Array.from({ length: 5 }, (_, i) => ({ key: `skeleton-${i}`, skeleton: true }));
    } else {
      rawData = financeData || [];
    }
  }

  // Apply the same radio + search filtering to rawData
  const finalTableData = useMemo(() => {
    // If we have skeleton rows, just return them
    if (rawData.some((item) => item.skeleton)) {
      return rawData;
    }
    // Otherwise, do actual filter + search
    return filterAndSearchData(rawData, filters, searchTerm, isChildData);
  }, [rawData, filters, searchTerm, isChildData]);

  // Expand row for child breakdown
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

  const RowItem = ({ label, value }) => (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );

  // Build columns differently if child breakdown is in use
  const mainColumns = useMemo(() => {
    if (!isChildData) {
      // Original columns for finance data
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

    // If we are using the child's breakdown columns
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

  useNavHeading(t("Children Fees"));
  totalPaidFees = 0;
  return (
    <Layout title={t("Child Fees | Parents")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="flex flex-col w-full">

          {/* ---- TOP CARDS ---- */}
          <div className="grid grid-cols-2 gap-4 w-full px-4 py-4">
            {/* Card 1: Total Unpaid Fees */}
            {/* Card 1: Total Unpaid Fees */}
            <div className="flex flex-col p-4 border border-gray-300 rounded-lg transition-transform">
              <div className="flex items-center justify-center mb-2">
                <MdAccessTime className="text-2xl text-red-400" />
              </div>

              {/* Title */}
              <span className="text-sm text-center">{t("Total Unpaid Fees")}</span>

              {/* Fees Amount */}
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center">
                {totalUnpaidFees || "0"}
              </span>

              {/* Conditional Rendering */}
              {totalUnpaidFees > 0 ? (
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
              {/* Centered Icon */}
              <div className="flex items-center justify-center mb-2">
                <GiExpense className="text-3xl text-red-400" />
              </div>

              {/* Centered Title */}
              <span className="text-md font-medium text-gray-700">{t("Total Paid Fees")}</span>

              {/* Centered Amount */}
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center mt-1">
                {totalPaidFees || "0"}
              </span>
            </div>

          </div>

          {/* ---- FILTERS, CHILD DROPDOWN & SEARCH BAR ---- */}
          <div className="flex p-[10px] justify-between items-center">
            {/* Left: Radio filters => ADDED PARTIAL */}
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
            {/* If there's a top-level error from fetchParentFinanceData => show no table */}
            {error ? (
              <div className="flex flex-col items-center justify-center my-8">
                <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
                <p className="text-gray-600 text-lg">Failed to fetch finance data</p>
              </div>
            ) : (
              <>
                {/* If the child breakdown fails => show red error once */}
                {breakdownError && <p className="text-red-500 mb-2">{breakdownError}</p>}

                <Table
                  columns={mainColumns}
                  dataSource={finalTableData}
                  pagination={{ pageSize: 5 }}
                  loading={false} // We handle skeleton rows ourselves
                  // Expand rows only if child data is in use
                  expandable={
                    isUsingBreakdown
                      ? {
                        expandedRowRender,
                        rowExpandable: (record) => !record.skeleton,
                      }
                      : undefined
                  }
                  locale={{
                    // If finalTableData is empty => show default "No Data" icon
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
