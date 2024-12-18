// src/Components/Admin/Finance/Earnings/TotalRevenueList.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Input, Button, Spin, Alert, Tooltip } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import DeleteModal from "./Components/DeleteModal";
import ExportModal from "./Components/ExportModal";
import FilterRevenueModal from "./Components/FilterRevenueModal";
import BulkEntriesModal from "./Components/BulkEntriesModal";
import debounce from "lodash.debounce";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import {
  setCurrentPage,
  setFilters,
} from "../../../../Store/Slices/Finance/Earnings/earningsSlice";

// Custom Header Cell with Light Pink Background
const CustomHeaderCell = (props) => (
  <th {...props} className="bg-pink-100 py-1 px-2 text-xs" />
);

const TotalRevenueList = () => {
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isBulkEntriesModalVisible, setIsBulkEntriesModalVisible] =
    useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    incomes,
    loading,
    error,
    totalRecords,
    currentPage,
    pageSize,
    filters,
  } = useSelector((state) => state.admin.earnings);

  // Debounced fetch to prevent excessive API calls
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllIncomes(params));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: pageSize,
      sortBy: "earnedDate",
      sortOrder: "desc",
      ...filters,
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage, pageSize, filters]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1)); // Reset to first page on search
  };

  const handleFilterApply = (filters) => {
    dispatch(setFilters(filters));
  };

  // Action Icons: Edit and Delete with Tooltips
  const renderActionIcons = (record) => (
    <div className="flex space-x-1">
      <Tooltip title="Edit">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() =>
            navigate("/finance/earning/add", {
              state: { incomeData: record },
            })
          }
          className="text-blue-600 hover:text-blue-800 p-0"
          aria-label="Edit"
        />
      </Tooltip>
      <Tooltip title="Delete">
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => {
            setSelectedIncome(record);
            setIsDeleteModalVisible(true);
          }}
          className="text-red-600 hover:text-red-800 p-0"
          aria-label="Delete"
        />
      </Tooltip>
    </div>
  );

  // Helper function to format currency
  const formatCurrency = (value) =>
    value !== undefined && value !== null
      ? `${value.toLocaleString()} QR`
      : "N/A";

  // Helper function to format percentage
  const formatPercentage = (value) =>
    value !== undefined && value !== null ? `${value}%` : "N/A";

  // Helper function to format date
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  // Memoize columns to prevent re-creation on every render
  const columns = useMemo(
    () => [
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (text) => <span className="text-xs">{text}</span>,
        width: 150,
      },
      {
        title: "Subcategory",
        dataIndex: "subCategory",
        key: "subCategory",
        render: (text) => <span className="text-xs">{text}</span>,
        width: 160,
      },
      {
        title: "Final Amount (QR)",
        dataIndex: "final_amount",
        key: "final_amount",
        render: (value, record) => (
          <Tooltip
            title={`Final Amount = Total Amount (${formatCurrency(
              record.total_amount
            )}) + Penalty (${formatCurrency(
              record.penalty
            )}) - Discount (${formatPercentage(record.discount)})`}
          >
            <span className="text-xs">{formatCurrency(value)}</span>
          </Tooltip>
        ),
        width: 140,
      },
      {
        title: "Paid Amount & Date",
        dataIndex: "paid_amount",
        key: "paid_amount",
        render: (value, record) => (
          <div>
            <span className="text-xs font-medium">{formatCurrency(value)}</span>
            <br />
            <span className="text-xxs text-gray-500">
              {formatDate(record.earnedDate)}
            </span>
          </div>
        ),
        width: 180,
      },
      {
        title: "Remaining Amount (QR)",
        dataIndex: "remaining_amount",
        key: "remaining_amount",
        render: (value) => (
          <span
            className={`text-xs ${
              value < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(value)}
          </span>
        ),
        width: 160,
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        render: (value) => (
          <span className="text-xs text-green-600">
            {formatPercentage(value)}
          </span>
        ),
        width: 100,
      },
      {
        title: "Penalty",
        dataIndex: "penalty",
        key: "penalty",
        render: (value) => (
          <span className="text-xs text-red-600">{formatCurrency(value)}</span>
        ),
        width: 100,
      },
      // {
      //   title: "Payment Status",
      //   dataIndex: "paymentStatus",
      //   key: "paymentStatus",
      //   render: (status) => (
      //     <Tag
      //       color={
      //         status === "paid"
      //           ? "green"
      //           : status === "pending"
      //           ? "orange"
      //           : "red"
      //       }
      //       className="text-xxs"
      //     >
      //       {status.toUpperCase()}
      //     </Tag>
      //   ),
      //   width: 140,
      // },
      // {
      //   title: "Documents",
      //   dataIndex: "document",
      //   key: "document",
      //   render: (docs) =>
      //     docs && docs.length > 0 ? (
      //       docs.map((doc, index) => (
      //         <a
      //           href={`/documents/${doc}`} // Adjust the path as necessary
      //           target="_blank"
      //           rel="noopener noreferrer"
      //           key={index}
      //           className="text-blue-600 hover:underline text-xs mr-1"
      //         >
      //           {doc}
      //         </a>
      //       ))
      //     ) : (
      //       "N/A"
      //     ),
      //   width: 180,
      // },
      {
        title: "Action",
        key: "action",
        render: (_, record) => renderActionIcons(record),
        fixed: "right",
        width: 80,
      },
    ],
    [navigate]
  );

  // Memoize data source to prevent re-creation on every render
  const dataSource = useMemo(
    () =>
      incomes?.map((income) => ({
        key: income._id,
        category: income.category?.[0]?.categoryName || "N/A",
        subCategory: income.subCategory || "N/A",
        final_amount: income.final_amount || 0,
        paid_amount: income.paid_amount || 0,
        remaining_amount: income.remaining_amount || 0,
        discount: income.discount || 0,
        penalty: income.penalty || 0,
        earnedDate: income.paidDate || income.generateDate || null,
        total_amount: income.total_amount || 0,
        // paymentStatus: income.paymentStatus || "N/A",
        // document: income.document || [],
      })),
    [incomes]
  );

  // Define table components for custom header styling
  const components = {
    header: {
      cell: CustomHeaderCell,
    },
  };

  // Summary row for totals
  const summary = (pageData) => {
    let totalFinalAmount = 0;
    let totalPaidAmount = 0;
    let totalRemainingAmount = 0;
    let totalDiscount = 0;
    let totalPenalty = 0;

    pageData.forEach(
      ({ final_amount, paid_amount, remaining_amount, discount, penalty }) => {
        totalFinalAmount += final_amount;
        totalPaidAmount += paid_amount;
        totalRemainingAmount += remaining_amount;
        totalDiscount += discount;
        totalPenalty += penalty;
      }
    );

    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>
          <strong>Totals:</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} />
        <Table.Summary.Cell index={2}>
          <strong>{formatCurrency(totalFinalAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3}>
          <strong>{formatCurrency(totalPaidAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <strong>{formatCurrency(totalRemainingAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5}>
          {/* <strong>{formatPercentage(totalDiscount)}</strong> */}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6}>
          <strong>{formatCurrency(totalPenalty)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7} />
      </Table.Summary.Row>
    );
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
          <div
            className="cursor-pointer text-xl font-semibold"
            onClick={() => navigate(-1)}
          >
            Total Revenue List
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="flex items-center px-3 py-1 border-2 rounded-lg hover:shadow-lg text-xs"
              style={{
                background: "white",
                borderImageSource:
                  "linear-gradient(to right, #C83B62, #46138A)",
                borderImageSlice: 1,
              }}
              icon={<FilterOutlined />}
              onClick={() => setIsFilterModalVisible(true)}
            >
              Filter
            </Button>
            <Input
              placeholder="Search by Subcategory"
              prefix={<SearchOutlined />}
              className="w-full md:w-64 text-xs"
              value={searchText}
              onChange={handleSearch}
              allowClear
              style={{ borderRadius: "0.375rem" }}
            />
            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={() => setIsExportModalVisible(true)}
              className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 border-none hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition duration-200 text-xs px-3 py-1"
              size="small"
            >
              Export
            </Button>
            <Button
              className="flex items-center px-3 py-1 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-lg hover:opacity-90 transition text-xs"
              icon={<UploadOutlined />}
              onClick={() => setIsBulkEntriesModalVisible(true)}
              size="small"
            >
              Bulk Entries
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            className="my-4 text-xs"
          />
        )}

        {/* No Data Placeholder */}
        {!loading && incomes.length === 0 && !error && (
          <div className="text-center text-gray-500 text-xs py-4">
            No records found.
          </div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: currentPage,
              total: totalRecords,
              pageSize: pageSize,
              showSizeChanger: false,
              size: "small",
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            onChange={(pagination) => {
              const newPage = pagination.current;
              dispatch(setCurrentPage(newPage));
            }}
            className="rounded-lg shadow text-xs"
            bordered
            size="small"
            scroll={{ x: "max-content" }}
            components={components}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            loading={{
              spinning: loading,
              indicator: <Spin size="large" />,
              tip: "Loading...",
            }}
            summary={summary}
          />
        </div>

        {/* Modals */}
        <DeleteModal
          visible={isDeleteModalVisible}
          onClose={() => {
            setIsDeleteModalVisible(false);
            setSelectedIncome(null);
          }}
          income={selectedIncome}
        />
        <ExportModal
          visible={isExportModalVisible}
          onClose={() => setIsExportModalVisible(false)}
        />
        <FilterRevenueModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onFilterApply={handleFilterApply}
        />
        <BulkEntriesModal
          visible={isBulkEntriesModalVisible}
          onClose={() => setIsBulkEntriesModalVisible(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default TotalRevenueList;
