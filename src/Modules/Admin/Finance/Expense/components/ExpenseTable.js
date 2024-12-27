import React, { useEffect, useCallback } from "react";
import { Table, Spin, Alert, Button, Tag, Tooltip } from "antd";
import {
  DollarOutlined,
  CloudOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllExpenses } from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import debounce from "lodash.debounce";
import { setCurrentPage } from "../../../../../Store/Slices/Finance/Expenses/expensesSlice";

// Mapping payment types to corresponding icons
const paymentTypeIcons = {
  cash: <DollarOutlined />,
  online: <CloudOutlined />,
  credit: <CreditCardOutlined />,
};

const ExpenseTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extracting necessary state from Redux store
  const { expenses, loading, error, totalRecords } = useSelector(
    (state) => state.admin.expenses
  );

  // Debounced function to fetch expenses with a fixed limit of 5
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllExpenses(params));
    }, 300),
    [dispatch]
  );

  // Fetch data on component mount with limit set to 5
  useEffect(() => {
    const params = {
      page: 1, // Always fetch the first page
      limit: 5, // Limit to 5 records
      sortBy: "date",
      sortOrder: "desc",
    };
    debouncedFetch(params);
  }, [debouncedFetch]);

  // Handle "View More" button click
  const handleViewMore = () => {
    navigate("/finance/expenses/total-expense-list");
  };

  // Define table columns with fixed widths and ellipsis
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
          title={`Payment Type: ${
            text.charAt(0).toUpperCase() + text.slice(1)
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
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span
          className={
            status === "paid"
              ? "text-green-600"
              : status === "unpaid"
              ? "text-red-600"
              : "text-yellow-600"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
      width: 120,
      ellipsis: true,
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (value) => `${value || 0} QAR`,
      width: 120,
      ellipsis: true,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (value) => (
        <span className="text-xs text-green-600">{value || 0} QAR</span>
      ),
      width: 120,
      ellipsis: true,
    },
    {
      title: "Remaining Amount",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (value) => (
        <span className="text-xs text-red-600">{value || 0} QAR</span>
      ),
      width: 140,
      ellipsis: true,
    },
  ];

  // Transform expenses data to table dataSource and limit to 5 records
  const dataSource = expenses?.slice(0, 5).map((expense) => ({
    key: expense._id,
    description: expense.description,
    paymentType: expense.paymentType || "N/A",
    paymentStatus: expense.paymentStatus || "N/A",
    finalAmount: expense.finalAmount || 0,
    paidAmount: expense.paidAmount || 0,
    remainingAmount: expense.remainingAmount || 0,
  }));

  return (
    <div className="bg-white p-4 rounded-lg space-y-4 mt-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">
          Summary of Expenses ({dataSource?.length || 5}/{totalRecords})
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
      {loading && (
        <div className="flex justify-center">
          <Spin tip="Loading..." />
        </div>
      )}
      {/* Error Message */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
        />
      )}
      {/* No Data Placeholder */}
      {!loading && expenses.length === 0 && !error && (
        <div className="text-center text-gray-500 text-xs py-4">
          No records found.
        </div>
      )}
      {/* Table */}
      {!loading && !error && expenses.length > 0 && (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false} // Removed pagination controls
          className="rounded-lg shadow text-xs"
          bordered
          size="small"
          tableLayout="fixed" // Fixed table layout
        />
      )}
    </div>
  );
};

export default ExpenseTable;
