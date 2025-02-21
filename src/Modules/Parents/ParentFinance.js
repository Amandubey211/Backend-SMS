import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { fetchParentFinanceData } from "../../Store/Slices/Parent/Finance/finance.action.js";
import Spinner from "../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";

// ---- antd imports ----
import { Table, Skeleton, Tag } from "antd";

const ParentFinanceTable = () => {
  const { t } = useTranslation("prtFinance");
  const dispatch = useDispatch();

  const { financeData, totalUnpaidFees, totalPaidFees, loading, error } =
    useSelector((state) => state?.Parent?.finance || {});

  // Filter states (radio buttons)
  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });

  // For searching table rows in real-time
  const [searchTerm, setSearchTerm] = useState("");

  useNavHeading(t("Child Fees"));

  // Color array for random tags
  const tagColors = ["purple", "red", "blue", "green", "orange", "cyan", "magenta", "gold", "lime"];

  // Function to return a colorful tag based on status
  const getStatusTag = (status) => {
    const statusColorMap = {
      Unpaid: "red",
      Paid: "green",
      Partial: "gold",
    };

    // Use predefined color or random from tagColors array
    const color = statusColorMap[status] || tagColors[Math.floor(Math.random() * tagColors.length)];

    return (
      <Tag color={color} style={{ fontWeight: 500, borderRadius: "12px", padding: "4px 10px" }}>
        {status}
      </Tag>
    );
  };

  useEffect(() => {
    dispatch(fetchParentFinanceData());
  }, [dispatch]);

  // Filtered data by status (radio) and then by searchTerm
  const filteredFeesDetails = useMemo(() => {
    if (!financeData) return [];

    // First filter by status
    let data = financeData.filter(
      (item) =>
        (filters.status === "Everyone" || item?.status === filters.status) &&
        (!filters.feesType || item?.feeType === filters.feesType)
    );

    // Then filter by searchTerm across columns (feeType, paidBy, amount, etc.)
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

  // For "No Data" messages
  const noDataMessage = useMemo(() => {
    if (filters.status === "Paid") return t("No Paid Entries Available");
    if (filters.status === "Unpaid") return t("No Unpaid Entries Available");
    return t("No Finance Data Available for Now");
  }, [filters.status, t]);

  // Handler for radio button changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // AntD table columns
  const columns = [
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
          getStatusTag(text || "No Status") // Updated to use colorful tags
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

  // If loading, build a skeleton data array with rowCount
  const rowCount = 5;
  const skeletonData = Array.from({ length: rowCount }, (_, i) => ({
    key: `skeleton-${i}`,
    skeleton: true,
  }));

  // For error rendering in table
  const renderError = () => {
    const isNetworkError = error?.toLowerCase().includes("network error");
    return (
      <div className="flex flex-col items-center justify-center my-8">
        {isNetworkError ? (
          <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
        ) : (
          <MdAccessTime className="text-gray-400 text-8xl mb-6" />
        )}
        <p className="text-gray-600 text-lg">
          {error}: {t("Failed to fetch finance data")}
        </p>
      </div>
    );
  };

  // Final data for the table
  let tableData = [];
  if (loading) {
    // show skeleton rows
    tableData = skeletonData;
  } else if (error) {
    // show empty data to hide normal rows
    tableData = [];
  } else {
    // show filtered data
    tableData = filteredFeesDetails.map((item, index) => ({
      ...item,
      key: `fee-${index}`,
    }));
  }

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
              <span className="text-sm text-center">
                {t("Total Unpaid Fees")}
              </span>
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
              <span className="text-sm text-center">
                {t("Total Paid Fees")}
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text text-center">
                {totalPaidFees || "0"}
              </span>
            </div>
          </div>

          {/* ---- FILTERS & SEARCH BAR ROW ---- */}
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
                      className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                        filters.status === status
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
                      className={`transition-colors duration-200 ${
                        filters.status === status
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                      style={{ paddingLeft: "2px" }}
                    >
                      {t(status)}
                    </span>
                  </label>
                </div>
              ))}
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
              renderError()
            ) : (
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={{ pageSize: 5 }} // Customize pageSize as needed
                // Hide default loading spinner so we can use custom skeleton
                loading={false}
                locale={{
                  emptyText: loading ? null : (
                    <div className="flex flex-col items-center justify-center mt-8">
                      <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                      <p className="text-gray-600 text-lg">{noDataMessage}</p>
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default ParentFinanceTable;
