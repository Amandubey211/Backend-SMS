// src/Modules/Admin/Finance/Components/ExpenseTable.jsx

import React, { useEffect, useCallback, useMemo } from "react";
import { Table, Spin, Button, Tooltip, Tag } from "antd";
import {
  DollarOutlined,
  CloudOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllExpenses } from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import debounce from "lodash.debounce";

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

  // Formatting function for dates
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  // Define table columns with fixed widths and ellipsis
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Sub-Category/Name",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text) => <span className="text-xs capitalize">{text}</span>,
      width: 150,
      ellipsis: true,
    },
    // New Expense Date Column (Third Position)
    {
      title: "Expense Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      render: (date) => <span className="text-xs">{formatDate(date)}</span>,
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
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 100,
      ellipsis: true,
      render: (status) => {
        let color = "default";
        switch (status) {
          case "paid":
            color = "green";
            break;
          case "partial":
            color = "yellow";
            break;
          case "unpaid":
            color = "red";
            break;
          default:
            color = "default";
        }
        return (
          <Tag color={color} className="text-xs capitalize">
            {status || "N/A"}
          </Tag>
        );
      },
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (value) => `${value || 0} QR`,
      width: 120,
      ellipsis: true,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (value) => (
        <span className="text-xs text-green-600">{value || 0} QR</span>
      ),
      width: 120,
      ellipsis: true,
    },
    {
      title: "Remaining Amount",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (value) => (
        <span className="text-xs text-red-600">{value || 0} QR</span>
      ),
      width: 140,
      ellipsis: true,
    },
  ];

  // Transform expenses data to table dataSource and limit to 5 records
  const dataSource = useMemo(
    () =>
      expenses?.slice(0, 5).map((expense) => ({
        key: expense._id,
        category: expense.category?.categoryName || "N/A",
        subCategory: expense.subcategory || "N/A",
        paymentType: expense.paymentType || "N/A",
        paymentStatus: expense.paymentStatus || "N/A",
        finalAmount: expense.finalAmount || 0,
        paidAmount: expense.paidAmount || 0,
        remainingAmount: expense.remainingAmount || 0,
        expenseDate: expense.createdAt || "N/A", // Mapped from createdAt
      })),
    [expenses]
  );

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
      {!loading && expenses.length === 0 && !error && (
        <div className="text-center text-gray-500 text-xs py-4">
          No records found.
        </div>
      )}

      {/* Table */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false} // Removed pagination controls
        className="rounded-lg shadow text-xs"
        bordered
        size="small"
        tableLayout="fixed" // Fixed table layout
        loading={loading} // Show spinner on loading
      />
    </div>
  );
};

export default ExpenseTable;
