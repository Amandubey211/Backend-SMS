import React, { useRef, useState, useEffect, useCallback } from "react";
import { Table, Spin, Button, Tooltip, Tag, Empty } from "antd";
import {
  DollarOutlined,
  CloudOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import debounce from "lodash.debounce";
import { setCurrentPage } from "../../../../Store/Slices/Finance/Earnings/earningsSlice";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
// Mapping payment types to corresponding icons
const paymentTypeIcons = {
  cash: <DollarOutlined />,
  online: <CloudOutlined />,
  credit: <CreditCardOutlined />,
};

const SummaryTotalRevenue = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extracting necessary state from Redux store
  const { incomes, loading, error, totalRecords } = useSelector(
    (state) => state.admin.earnings
  );

  // Debounced function to fetch incomes with a fixed limit of 5
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllIncomes(params));
    }, 300),
    [dispatch]
  );

  // Fetch data on component mount with limit set to 5
  useEffect(() => {
    const params = {
      page: 1, // Always fetch the first page
      limit: 5, // Limit to 5 records
      sortBy: "earnedDate",
      sortOrder: "desc",
    };
    debouncedFetch(params);
  }, [debouncedFetch]);

  // Handle "View More" button click
  const handleViewMore = () => {
    navigate("/finance/earning/total-revenue-list");
  };

  // Define table columns with fixed widths and ellipsis
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 120,
      ellipsis: true,
    },
    {
      title: "Subcategory",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text) => (
        <Tooltip
          title={`Payment Type: ${text.charAt(0).toUpperCase() + text.slice(1)
            }`}
        >
          <span className="text-xs flex items-center gap-1">
            {paymentTypeIcons[text.toLowerCase()] || <CreditCardOutlined />}
            {text.charAt(0).toUpperCase() + text.slice(1)}
          </span>
        </Tooltip>
      ),
      width: 130,
      ellipsis: true,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value, record) =>
        record.discountType === "percentage" ? (
          <Tag color="purple" className="text-xs">
            {value || 0}%
          </Tag>
        ) : (
          <Tag color="orange" className="text-xs">
            {value || 0} QR
          </Tag>
        ),
      width: 100,
      ellipsis: true,
    },
    {
      title: "Final Amount (QR)",
      dataIndex: "final_amount",
      key: "final_amount",
      render: (value) => <span className="text-xs">{value || "0"} QR</span>,
      width: 120,
      ellipsis: true,
    },
    {
      title: "Paid Amount (QR)",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (value) => (
        <span className="text-xs text-green-600">{value || "0"} QR</span>
      ),
      width: 120,
      ellipsis: true,
    },
    {
      title: "Remaining Amount (QR)",
      dataIndex: "remaining_amount",
      key: "remaining_amount",
      render: (value) => (
        <span className="text-xs text-red-600">{value || "0"} QR</span>
      ),
      width: 140,
      ellipsis: true,
    },
  ];

  // Transform incomes data to table dataSource and limit to 5 records
  const dataSource = incomes?.slice(0, 5).map((income) => ({
    key: income._id,
    category: income.category?.[0]?.categoryName || "N/A",
    subCategory: income.subCategory || "N/A",
    paymentType: income.paymentType || "N/A",
    discount: income.discount || 0,
    discountType: income.discountType || "percentage",
    final_amount: income.final_amount || 0,
    paid_amount: income.paid_amount || 0,
    remaining_amount: income.remaining_amount || 0,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">
          Summary of Total Revenue ({dataSource?.length || 5}/{totalRecords})
        </h2>
        <Button
          onClick={handleViewMore}
          className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md shadow hover:from-[#a3324e] hover:to-[#6e2384] transition text-xs"
          size="small"
        >
          View More ({totalRecords})
        </Button>
      </div>

      {/* Loading Indicator */}
      {/* {loading && (
        <div className="flex justify-center">
          <Spin tip="Loading..." />
        </div>
      )} */}
      {!loading && incomes.length === 0 && !error && (
        <div className="text-center text-gray-500 text-xs py-4">
          No records found.
        </div>
      )}
      {/* Table */}
      <ProtectedSection requiredPermission={PERMISSIONS.FINANCE_LIST_ALL_REVENUE}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false} // Removed pagination controls
          className="rounded-lg shadow text-xs"
          bordered
          size="small"
          tableLayout="fixed" // Fixed table layout
          loading={loading} // Show spinner on loading
        // locale={{
        //   emptyText: <Empty description="No Data Found" />, // Show default Ant Design empty icon + text
        // }}
        />
      </ProtectedSection>
    </div>
  );
};

export default SummaryTotalRevenue;
