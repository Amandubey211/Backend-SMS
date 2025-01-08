// src/Components/Admin/Finance/Earnings/TotalRevenueList.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Spin,
  Alert,
  Tooltip,
  Tag,
  Checkbox,
  Descriptions,
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
import { AiFillAccountBook } from "react-icons/ai";
import { BiDonateHeart } from "react-icons/bi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlineMoneyOff } from "react-icons/md";
import {
  setCurrentPage,
  setFilters,
  setReadOnly,
  clearFilters,
  setSelectedIncome,
} from "../../../../Store/Slices/Finance/Earnings/earningsSlice";
import toast from "react-hot-toast";
import Layout from "../../../../Components/Common/Layout";
import Card from "../Expense/components/Card";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { flattenObject } from "../../../../Utils/xl";
import { setInvoiceData } from "../../../../Store/Slices/Finance/Invoice/invoiceSlice";

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
  // Set navigation heading
  useNavHeading("Finance", "Earning List");

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

  // Initialize local state for computedPageSize
  const [computedPageSize, setComputedPageSize] = useState(pageSize || 10);

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
      limit: computedPageSize, // Use computedPageSize here
      includeDetails: true,
      ...filters,
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage, computedPageSize, filters]);

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
  const renderActionIcons = (record) => {
    // Check if the category is "Student-Based Revenue"
    const isStudentBased = record.categoryName === "Student-Based Revenue";

    return (
      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
        {!isStudentBased && (
          <>
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
          </>
        )}
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
  };

  // Formatting functions with optional currency parameter
  const formatCurrency = (value, currency = "QR") =>
    value !== undefined && value !== null
      ? `${value.toLocaleString()} ${currency}`
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
                <Tooltip title="Selectable">
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
        email:income?.email
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
    let totalPaidAmountSum = 0;
    let totalRemainingAmount = 0;
    let totalPenalty = 0;

    pageData.forEach(
      ({ finalAmount, paidAmount, remainingAmount, penalty }) => {
        totalFinalAmount += finalAmount;
        totalPaidAmountSum += paidAmount;
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
          <strong>{formatCurrency(totalPaidAmountSum)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8}>
          <strong>{formatCurrency(totalRemainingAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={9} />
      </Table.Summary.Row>
    );
  };

  // Retrieve statistics from Redux store and map to color classes
  // Define card data directly without importing from cardsData
  const cardDataWithValues = useMemo(() => {
    const cards = [
      {
        title: "Total Paid Amount",
        value: formatCurrency(totalPaidAmount, "QAR"),
        icon: <FaRegMoneyBillAlt />,
        color: "green",
      },

      {
        title: "Remaining Partial Paid",
        value: formatCurrency(remainingPartialPaidRevenue, "QAR"),
        icon: <BiDonateHeart />,
        color: "yellow",
      },

      {
        title: "Unpaid Amount",
        value: formatCurrency(unpaidRevenue, "QAR"),
        icon: <MdOutlineMoneyOff />,
        color: "red",
      },
      {
        title: "Total Revenue",
        value: formatCurrency(totalRevenue, "QAR"),
        icon: <AiFillAccountBook />,
        color: "purple",
      },
      // Add more cards if necessary
    ];

    return cards;
  }, [
    totalRevenue,
    remainingPartialPaidRevenue,
    totalPaidAmount,
    unpaidRevenue,
  ]);

  const transformIncomeData = (incomes) =>
    incomes?.map(({ _id, category, collectBy, document, ...income }, index) => {
      const flattenedIncome = flattenObject(income);
      return {
        sNo: index + 1,
        category: category?.categoryName || "N/A",
        ...flattenedIncome,
        subCategory: flattenedIncome["subCategory"] || "N/A",
        description: flattenedIncome["description"] || "N/A",
        paymentType: flattenedIncome["paymentType"] || "N/A",
        paymentStatus: flattenedIncome["paymentStatus"] || "N/A",
        tax: flattenedIncome["tax"] || "N/A",
        penalty: flattenedIncome["penalty"] || 0,
        discount: flattenedIncome["discount"] || 0,
        discountType: flattenedIncome["discountType"] || "N/A",
        paidAmount: flattenedIncome["paid_amount"] || 0,
        remainingAmount: flattenedIncome["remaining_amount"] || 0,
        totalAmount: flattenedIncome["total_amount"] || 0,
        finalAmount: flattenedIncome["final_amount"] || 0,
        academicYearDetails:
          flattenedIncome["academicYearDetails.year"] || "N/A",
      };
    }) || [];

  return (
    <Layout title="Earning List | Student Diwan">
      <AdminLayout>
        <div className="p-4 space-y-3">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardDataWithValues.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                // Pass other props like comparison, percentage, icon, trend if needed
              />
            ))}
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="flex items-center gap-4 ms-4">
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
                       
                        navigate("/finance/invoices/add-new-invoice");
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
                className="flex items-center bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-3 rounded-md shadow-md"
              >
                Export
              </Button>
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
              // Updated pagination configuration
              pagination={{
                current: currentPage,
                total: totalRecords,
                pageSize: computedPageSize,
                showSizeChanger: true, // Enable size changer
                pageSizeOptions: ["5", "10", "20", "50"], // Define page size options
                size: "small",
                showTotal: (total, range) =>
                  `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
                onChange: (page, pageSize) => {
                  dispatch(setCurrentPage(page)); // Update the current page in Redux
                  setComputedPageSize(pageSize); // Update the local page size
                },
                onShowSizeChange: (current, size) => {
                  setComputedPageSize(size); // Handle page size change locally
                  dispatch(setCurrentPage(1)); // Optionally reset to first page
                },
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
                    return;
                  }
                  console.log(record);
                  
                  const invoiceData = {
                    dueDate: record?.dueDate?.slice(0,10),
                    receiver: {
                      name: record?.rentIncome?.nameOfRenter || record?.examCentreFees?.examName || '',
                      address: "",
                      contact: "",
                      email: record?.email,
                    },
                    description: record?.description || '',
                    lineItems: [{ revenueType: record?.categoryName, quantity: 1, amount: record?.totalAmount }],
                    discountType: record?.discountType,
                    discount: record?.discount,
                    penalty: record?.penalty,
                    tax: record?.tax,
                    totalAmount: 0,
                    finalAmount: record?.finalAmount,
                    paymentType: record?.paymentType,
                    paymentStatus:record?.paymentStatus,
                    mode:'create'
                  };
                  console.log(invoiceData,'id');
                  
                     dispatch(setInvoiceData(invoiceData));
                  setSelectedRowKey(record.key);
                    
                },
              })}
            />
          </div>

          {/* Modals */}
          <DeleteModal
            visible={isDeleteModalVisible}
            type="Earnings"
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
    </Layout>
  );
};

export default TotalRevenueList;
