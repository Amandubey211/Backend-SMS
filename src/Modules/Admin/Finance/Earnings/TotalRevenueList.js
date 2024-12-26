// src/Components/Admin/Finance/Earnings/TotalRevenueList.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Spin,
  Alert,
  Tooltip,
  Card,
  Tag,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarCircleOutlined,
  PieChartOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  CloudOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  BlockOutlined,
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
  setSelectedIncome,
} from "../../../../Store/Slices/Finance/Earnings/earningsSlice";
import toast from "react-hot-toast";
import Layout from "../../../../Components/Common/Layout";

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

  // State for selected row key (single selection)
  const [selectedRowKey, setSelectedRowKey] = useState(null);

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
      includeDetails: true,
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

  // Render action buttons (View, Edit, Delete) for each row
  const renderActionIcons = (record) => (
    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip title="View">
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            const incomeToView = incomeIdMap[record.key];
            if (incomeToView) {
              dispatch(setReadOnly(true)); // Set readOnly to true for viewing
              dispatch(setSelectedIncome(incomeToView)); // Dispatch the selected income to Redux
              navigate("/finance/earning/add"); // Navigate to view page
            } else {
              toast.error("Selected income not found.");
            }
          }}
          className="text-gray-600 hover:text-gray-800 p-0"
          aria-label="View"
        />
      </Tooltip>
      <Tooltip title="Edit">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            const incomeToEdit = incomeIdMap[record.key];
            if (incomeToEdit) {
              dispatch(setReadOnly(false)); // Set readOnly to false for editing
              dispatch(setSelectedIncome(incomeToEdit)); // Dispatch the selected income to Redux
              navigate("/finance/earning/add"); // Navigate to edit page
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

  // Define table columns with a separate selection column using Checkboxes
  const columns = useMemo(
    () => [
      // Selection Column
      {
        title: "",
        key: "selection",
        width: 60,
        render: (_, record) => {
          const isSelected = selectedRowKey === record.key;
          if (record.paymentStatus === "unpaid") {
            return (
              <div className="flex items-center justify-center">
                <Tooltip title="Not selectable">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        setSelectedRowKey(record.key);
                      } else {
                        setSelectedRowKey(null);
                      }
                    }}
                    aria-label={isSelected ? "Unselect" : "Select"}
                  />
                </Tooltip>
              </div>
            );
          } else {
            return (
              <div className="flex items-center justify-center">
                <Tooltip title="Not selectable">
                  <Checkbox disabled />
                </Tooltip>
                {/* <BlockOutlined className="ml-1 text-red-500" /> */}
              </div>
            );
          }
        },
      },
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
      // Discount Column
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
      // Penalty Column
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
      // Status Column
      {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
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
        width: 80,
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
        width: 120,
        ellipsis: true,
      },
      {
        title: "Remaining Amount (QR)",
        dataIndex: "remainingAmount",
        key: "remainingAmount",
        render: (value) => (
          <span className="text-xs text-red-600">{value || "0"} QR</span>
        ),
        width: 120,
        ellipsis: true,
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => renderActionIcons(record),
        fixed: "right",
        width: 120,
      },
    ],
    [selectedRowKey, incomeIdMap]
  );

  // Map incomes to data source with camelCase fields, including subcategory-specific ones
  const dataSource = useMemo(
    () =>
      incomes?.map((income) => ({
        key: income._id,
        categoryName: income.category?.categoryName || "N/A",
        subCategory: income.subCategory || "N/A",
        paymentType: income.paymentType || "N/A",
        discount: income.discount || 0,
        discountType: income.discountType || "percentage",
        finalAmount: income.final_amount || 0,
        paidAmount: income.paid_amount || 0,
        remainingAmount: income.remaining_amount || 0,
        penalty: income.penalty || 0,
        paymentStatus: income.paymentStatus || "N/A",
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
        <Table.Summary.Cell index={0} colSpan={4}>
          <strong>Totals:</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <strong>{formatCurrency(totalPenalty)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5} />
        <Table.Summary.Cell index={6}>
          <strong>{formatCurrency(totalFinalAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7}>
          <strong>{formatCurrency(totalPaidAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8}>
          <strong>{formatCurrency(totalRemainingAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={9} />
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


  const transformIncomeData = (incomes) =>
    incomes?.map(({ _id, category, ...income }, index) => ({
      sNo: index + 1,
      category: category?.[0]?.categoryName || "N/A",
      ...income, 
      subCategory: income.subCategory || "N/A",
      paymentType: income.paymentType || "N/A",
      discount: income.discount || 0, 
      discountType: income.discountType || "percentage",
      finalAmount: income.final_amount || 0,
      paidAmount: income.paid_amount || 0,
      remainingAmount: income.remaining_amount || 0,
      penalty: income.penalty || 0, 
      // earnedDate: income.paidDate || income.generateDate || "N/A",
      totalAmount: income.total_amount || 0,
      academicYearDetails: income.academicYearDetails?.[0]?.year || "N/A",
    })) || [];


  return (
    <Layout title="Earning List | Student Diwan">
      <AdminLayout>
        <div className="p-4 space-y-3">
          {/* Top Cards Row */}
          <div className="w-full h-full flex flex-wrap justify-center items-stretch gap-4 p-2">
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
                    padding: "0.2rem", // Reduced padding for compactness
                  }}
                >
                  <p className={`${currentColor.text} text-lg font-bold`}>
                    {card.amount}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="flex items-center gap-4">
              <div
                className="cursor-pointer text-xl font-semibold transition"
                onClick={() => navigate(-1)}
              >
                Total Revenue List
              </div>

              <Input
                placeholder="Search by Subcategory"
                prefix={<SearchOutlined />}
                className="w-full md:w-64 text-xs"
                value={searchText}
                onChange={handleSearch}
                allowClear
                style={{
                  borderRadius: "0.375rem",
                  height: "35px",
                  borderColor: "#ff6bcb",
                  boxShadow: "0 2px 4px rgba(255, 105, 180, 0.2)",
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedRowKey && (
                <Tooltip title="Create an invoice for the selected unpaid record">
                  <Button
                    type="primary"
                    icon={<DollarCircleOutlined />}
                    onClick={() => {
                      const selectedIncome = incomeIdMap[selectedRowKey];
                      if (selectedIncome) {
                        // Navigate to the invoice creation page with selectedRow data
                        navigate("/finance/invoices/add-new-invoice", {
                          state: { income: selectedIncome },
                        });
                      } else {
                        toast.error("Selected income not found.");
                      }
                    }}
                    className="flex items-center bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-2 rounded-md shadow-md"
                  >
                    Create Invoice
                  </Button>
                </Tooltip>
              )}
              <Button
                className="flex items-center px-4 py-3 rounded-md text-xs bg-gradient-to-r from-pink-400 to-pink-300 text-white border-none shadow-md hover:from-pink-500 hover:to-pink-400 transition duration-200"
                icon={<FilterOutlined />}
                onClick={() => setIsFilterModalVisible(true)}
              >
                Filter
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => setIsExportModalVisible(true)}
                className="flex items-center bg-gradient-to-r  from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-3 rounded-md shadow-md"
              >
                Export
              </Button>
              {/* Uncomment for Bulk Entries */}
              {/* <Button
      className="flex items-center px-3 py-1 bg-gradient-to-r from-pink-500 to-pink-400 text-white font-bold rounded-md hover:opacity-90 transition text-xs shadow-md"
      icon={<UploadOutlined />}
      onClick={() => setIsBulkEntriesModalVisible(true)}
      size="small"
    >
      Bulk Entries
    </Button> */}
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
              loading={{
                spinning: loading,
                indicator: <Spin size="large" />,
                tip: "Loading...",
              }}
              summary={summary}
              // Removed rowSelection and rowClassName
              onRow={(record) => ({
                onClick: () => {
                  if (record.paymentStatus !== "unpaid") {
                    // toast.error("Only unpaid records can be selected.");
                    return;
                  }
                  setSelectedRowKey(record.key);
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
<<<<<<< HEAD
      </AdminLayout>
    </Layout>
=======

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
          dataToExport={transformIncomeData(incomes)}
          title="EarningsData"
          sheet="earnings_report"
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
>>>>>>> 6ca9ee063ee467aca6dec9faf85d307a76a8098f
  );
};

export default TotalRevenueList;
