// src/Components/Admin/Finance/Earnings/TotalRevenueList.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Input, Button, Spin, Alert, Tooltip, Card, Tag } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  PieChartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  CloudOutlined,
  CreditCardOutlined,
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
  setReadOnly,
  clearFilters,
  setSelectedIncome, // Import the action to set selected income
} from "../../../../Store/Slices/Finance/Earnings/earningsSlice";
import toast from "react-hot-toast";

// Mapping payment types to corresponding icons
const paymentTypeIcons = {
  cash: <DollarOutlined />,
  online: <CloudOutlined />,
  credit: <CreditCardOutlined />,
};

// Predefined color classes to handle dynamic Tailwind CSS classes
const colorClasses = {
  purple: {
    text: "text-purple-800",
    bg: "bg-purple-100",
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
  },
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
  },
};

// Custom header cell for table
const CustomHeaderCell = (props) => (
  <th {...props} className="bg-pink-100 py-1 px-2 text-xs" />
);

const TotalRevenueList = () => {
  // State variables
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isBulkEntriesModalVisible, setIsBulkEntriesModalVisible] =
    useState(false);
  const [selectedIncomeForDeletion, setSelectedIncomeForDeletion] =
    useState(null);

  // Navigation and dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const {
    incomes,
    loading,
    error,
    totalRecords,
    totalPages,
    currentPage,
    pageSize,
    filters,
    // New statistics
    totalRevenue,
    remainingPartialPaidRevenue,
    totalPaidAmount,
    unpaidRevenue,
  } = useSelector((state) => state.admin.earnings);

  // Memoize a mapping from _id to income object for faster lookup
  const incomeIdMap = useMemo(() => {
    const map = {};
    incomes.forEach((income) => {
      map[income._id] = income;
    });
    return map;
  }, [incomes]);

  // Debounced fetch function to reduce API calls
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllIncomes(params));
    }, 500),
    [dispatch]
  );

  // Fetch incomes on component mount and when dependencies change
  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: 10,
      // sortBy: "earnedDate",
      // sortOrder: "desc",
      ...filters,
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage, pageSize, filters]);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Handle filter application
  const handleFilterApply = (appliedFilters) => {
    if (Object.keys(appliedFilters).length === 0) {
      dispatch(clearFilters());
    } else {
      dispatch(setFilters(appliedFilters));
    }
  };

  // Render action buttons (Edit and Delete) for each row
  const renderActionIcons = (record) => (
    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Edit">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            const incomeToEdit = incomeIdMap[record.key];
            if (incomeToEdit) {
              dispatch(setReadOnly(true)); // Set readOnly to true for viewing
              dispatch(setSelectedIncome(incomeToEdit)); // Dispatch the selected income to Redux
              navigate("/finance/earning/add"); // Navigate without passing state
            } else {
              toast.error("Selected income not found.");
            }
          }}
          className="text-blue-600 hover:text-blue-800 p-0"
          aria-label="Edit"
        />
      </Tooltip>
      <Tooltip title="Delete">
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => {
            const incomeToDelete = incomeIdMap[record.key];
            if (incomeToDelete) {
              setSelectedIncomeForDeletion(incomeToDelete); // Set income for deletion
              setIsDeleteModalVisible(true);
            } else {
              toast.error("Selected income not found.");
            }
          }}
          className="text-red-600 hover:text-red-800 p-0"
          aria-label="Delete"
        />
      </Tooltip>
    </div>
  );

  // Formatting functions
  const formatCurrency = (value) =>
    value !== undefined && value !== null
      ? `${value.toLocaleString()} QR`
      : "N/A";

  const formatPercentage = (value) =>
    value !== undefined && value !== null ? `${value}%` : "N/A";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  // Define table columns
  const columns = useMemo(
    () => [
      {
        title: "Category",
        dataIndex: "categoryName",
        key: "categoryName",
        render: (text) => <span className="text-xs">{text}</span>,
        width: 150,
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
      // Uncomment the following block if you wish to display Payment Type

      // {
      //   title: "Payment Type",
      //   dataIndex: "paymentType",
      //   key: "paymentType",
      //   render: (text) => (
      //     <Tooltip
      //       title={`Payment Type: ${
      //         text.charAt(0).toUpperCase() + text.slice(1)
      //       }`}
      //     >
      //       <span className="text-xs flex items-center gap-1">
      //         {paymentTypeIcons[text.toLowerCase()] || <CreditCardOutlined />}
      //         {text.charAt(0).toUpperCase() + text.slice(1)}
      //       </span>
      //     </Tooltip>
      //   ),
      //   width: 150,
      //   ellipsis: true,
      // },
      // Uncomment the following block if you wish to display Discount
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
        width: 70,
        ellipsis: true,
      },
      {
        title: "Final Amount (QR)",
        dataIndex: "finalAmount",
        key: "finalAmount",
        render: (value) => <span className="text-xs">{value || "0"} QR</span>,
        width: 150,
        ellipsis: true,
      },
      {
        title: "Paid Amount (QR)",
        dataIndex: "paidAmount",
        key: "paidAmount",
        render: (value) => (
          <span className="text-xs text-green-600">{value || "0"} QR</span>
        ),
        width: 150,
        ellipsis: true,
      },
      {
        title: "Remaining Amount (QR)",
        dataIndex: "remainingAmount",
        key: "remainingAmount",
        render: (value) => (
          <span className="text-xs text-red-600">{value || "0"} QR</span>
        ),
        width: 160,
        ellipsis: true,
      },
      {
        title: "Penalty",
        dataIndex: "penalty",
        key: "penalty",
        render: (value) => (
          <span className="text-xs text-red-600">{formatCurrency(value)}</span>
        ),
        width: 100,
        ellipsis: true,
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => renderActionIcons(record),
        fixed: "right",
        width: 80,
      },
    ],
    [navigate, dispatch, incomeIdMap]
  );

  // Map incomes to data source with camelCase fields, including subcategory-specific ones
  const dataSource = useMemo(
    () =>
      incomes?.map((income) => ({
        key: income._id,
        categoryName: income.category?.[0]?.categoryName || "N/A",
        subCategory: income.subCategory || "N/A",
        paymentType: income.paymentType || "N/A",
        discount: income.discount || 0,
        discountType: income.discountType || "percentage",
        finalAmount: income.final_amount || 0,
        paidAmount: income.paid_amount || 0,
        remainingAmount: income.remaining_amount || 0,
        penalty: income.penalty || 0,
        earnedDate: income.paidDate || income.generateDate || null,
        totalAmount: income.total_amount || 0,
      })),
    [incomes]
  );

  // Custom components for table headers
  const components = {
    header: {
      cell: CustomHeaderCell,
    },
  };

  // Table summary (totals row)
  const summary = (pageData) => {
    let totalFinalAmount = 0;
    let totalPaidAmount = 0;
    let totalRemainingAmount = 0;
    let totalPenalty = 0;

    pageData.forEach(
      ({ finalAmount, paidAmount, remainingAmount, penalty }) => {
        totalFinalAmount += finalAmount;
        totalPaidAmount += paidAmount;
        totalRemainingAmount += remainingAmount;
        totalPenalty += penalty;
      }
    );

    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>
          <strong>Totals:</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} />
        {/* Uncomment the following blocks if Payment Type and Discount are displayed */}
        <Table.Summary.Cell index={2} />
        {/* <Table.Summary.Cell index={3} /> */}

        <Table.Summary.Cell index={2}>
          <strong>{formatCurrency(totalFinalAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3}>
          <strong>{formatCurrency(totalPaidAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <strong>{formatCurrency(totalRemainingAmount)}</strong>
        </Table.Summary.Cell>
        {/* <Table.Summary.Cell index={5} /> */}
        <Table.Summary.Cell index={5}>
          <strong>{formatCurrency(totalPenalty)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6} />
      </Table.Summary.Row>
    );
  };

  // Compute pageSize from totalRecords and totalPages to reflect backend pagination
  const computedPageSize =
    totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;

  // Retrieve statistics from Redux store and map to color classes
  const cardData = useMemo(
    () => [
      {
        title: "Total Revenue",
        icon: <DollarCircleOutlined />,
        color: "purple",
        amount: formatCurrency(totalRevenue),
      },
      {
        title: "Remaining Partial Paid",
        icon: <PieChartOutlined />,
        color: "yellow",
        amount: formatCurrency(remainingPartialPaidRevenue),
      },
      {
        title: "Unpaid Amount",
        icon: <ExclamationCircleOutlined />,
        color: "red",
        amount: formatCurrency(unpaidRevenue),
      },
      {
        title: "Paid Amount",
        icon: <CheckCircleOutlined />,
        color: "green",
        amount: formatCurrency(totalPaidAmount),
      },
    ],
    [totalRevenue, remainingPartialPaidRevenue, unpaidRevenue, totalPaidAmount]
  );

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        {/* Top Cards Row */}
        <div className="w-full h-full flex flex-wrap justify-center items-stretch gap-4 p-4">
          {cardData.map((card, index) => {
            const currentColor =
              colorClasses[card.color] || colorClasses["purple"];
            return (
              <Card
                key={index}
                title={
                  <div
                    className={`flex items-center gap-2 ${currentColor.text} font-bold`}
                  >
                    {card.icon}
                    {card.title}
                  </div>
                }
                className={`${currentColor.bg} shadow-sm border-none flex-grow`}
                headStyle={{ borderBottom: "none" }}
                style={{
                  flex: "1 1 200px",
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                <p className={`${currentColor.text} text-xl font-bold`}>
                  {card.amount}
                </p>
              </Card>
            );
          })}
        </div>

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

        {/* Error Message */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            // Use computedPageSize to show correct number of pages as per backend
            pagination={{
              current: currentPage,
              total: totalRecords,
              pageSize: computedPageSize,
              showSizeChanger: false,
              size: "small",
              showTotal: () =>
                `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
            }}
            onChange={(pagination) => {
              const newPage = pagination.current;
              dispatch(setCurrentPage(newPage));
            }}
            className="rounded-lg shadow text-xs"
            bordered
            size="small"
            tableLayout="fixed" // Fixed table layout for compactness
            components={components}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            loading={{
              spinning: loading,
              indicator: <Spin size="large" />,
              tip: "Loading...",
            }}
            summary={summary}
            onRow={(record) => ({
              onClick: () => {
                console.log("Row clicked:", record); // Debugging line
                const incomeToView = incomeIdMap[record.key];
                if (incomeToView) {
                  dispatch(setReadOnly(true));
                  dispatch(setSelectedIncome(incomeToView)); // Dispatch selected income to Redux
                  navigate("/finance/earning/add"); // Navigate to AddEarnings without state
                } else {
                  toast.error("Selected income not found.");
                }
              },
            })}
          />
        </div>

        {/* Modals */}
        <DeleteModal
          visible={isDeleteModalVisible}
          onClose={() => {
            setIsDeleteModalVisible(false);
            setSelectedIncomeForDeletion(null);
          }}
          income={selectedIncomeForDeletion}
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
