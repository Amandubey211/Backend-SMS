// src/Modules/Admin/Finance/Components/TotalExpenseList.jsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  Spin,
  Tooltip,
  Tag,
  Checkbox,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { AiFillAccountBook } from "react-icons/ai";
import { BiDonateHeart } from "react-icons/bi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlineMoneyOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import debounce from "lodash.debounce";
import {
  fetchAllExpenses,
  deleteExpense,
} from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import {
  setCurrentPage,
  setFilters,
  setReadOnly,
  clearFilters,
  setSelectedExpense,
} from "../../../../../Store/Slices/Finance/Expenses/expensesSlice";
import toast from "react-hot-toast";
import Card from "../components/Card";
import ExportModal from "../../Earnings/Components/ExportModal";
import DeleteModal from "../../Earnings/Components/DeleteModal";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const TotalExpenseList = () => {
  useNavHeading("Finance", "Expense List");

  // State variables
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [selectedExpenseForDeletion, setSelectedExpenseForDeletion] =
    useState(null);

  // State for selected row key (single selection)
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  // Navigation and dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const {
    expenses,
    loading,
    error,
    totalRecords,
    totalPages,
    currentPage,
    pageSize,
    filters,
    totalExpenseAmount,
    remainingPartialPaidExpense,
    totalPaidAmount,
    unpaidExpense,
  } = useSelector((state) => state.admin.expenses);

  // Initialize local state for computedPageSize
  const [computedPageSize, setComputedPageSize] = useState(pageSize || 10);

  // Memoize a mapping from _id to expense object for faster lookup
  const expenseIdMap = useMemo(() => {
    const map = {};
    expenses.forEach((expense) => {
      map[expense._id] = expense;
    });
    return map;
  }, [expenses]);

  // Debounced fetch function to reduce API calls
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllExpenses(params));
    }, 500),
    [dispatch]
  );

  // Fetch expenses on component mount and when dependencies change
  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: computedPageSize,
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

  // Handle View Action
  const handleView = (record) => {
    const expenseToView = expenseIdMap[record.key];
    if (expenseToView) {
      dispatch(setSelectedExpense(expenseToView));
      dispatch(setReadOnly(true));
      navigate("/finance/expenses/add"); // Adjust the route if necessary
    } else {
      toast.error("Selected expense not found.");
    }
  };

  // Handle Edit Action
  const handleEdit = (record) => {
    const expenseToEdit = expenseIdMap[record.key];
    if (expenseToEdit) {
      dispatch(setSelectedExpense(expenseToEdit));
      dispatch(setReadOnly(false));
      navigate("/finance/expenses/add"); // Adjust the route if necessary
    } else {
      toast.error("Selected expense not found.");
    }
  };

  // Show delete confirmation modal
  const showDeleteModal = (record) => {
    const expenseToDelete = expenseIdMap[record.key];
    if (expenseToDelete) {
      setSelectedExpenseForDeletion(expenseToDelete);
      setIsDeleteModalVisible(true);
    } else {
      toast.error("Selected expense not found.");
    }
  };

  // Render action buttons (View, Edit, Delete) for each row
  const renderActionIcons = (record) => (
    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip title="View">
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          className="text-blue-600 hover:text-blue-800 p-0"
          aria-label="View"
        />
      </Tooltip>
      <Tooltip title="Edit">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="text-green-600 hover:text-green-800 p-0"
          aria-label="Edit"
        />
      </Tooltip>
      <Tooltip title="Delete">
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteModal(record)}
          className="text-red-600 hover:text-red-800 p-0"
          aria-label="Delete"
        />
      </Tooltip>
    </div>
  );

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
        title: "Sub-Category/Name",
        dataIndex: "subCategoryName",
        key: "subCategoryName",
        render: (text) => <span className="text-xs">{text}</span>,
        width: 120,
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
        title: "Total Amount (QR)",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (value) => <span className="text-xs">{value || "0"} QR</span>,
        width: 100,
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
      // Final Amount Column
      {
        title: "Final Amount (QR)",
        dataIndex: "finalAmount",
        key: "finalAmount",
        render: (value) => <span className="text-xs">{value || "0"} QR</span>,
        width: 150,
        ellipsis: true,
      },
      // Paid Amount Column
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
      // Remaining Amount Column
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

      // Action Column
      {
        title: "Action",
        key: "action",
        render: (_, record) => renderActionIcons(record),
        fixed: "right",
        width: 120,
      },
    ],
    [selectedRowKey, expenseIdMap]
  );

  // Transform expense data for export
  const transformExpenseData = (expenses) =>
    expenses?.map(({ _id, category, ...expense }, index) => ({
      sNo: index + 1,
      category: category?.[0]?.categoryName || "N/A",
      description: expense.description || "N/A",
      paymentType: expense.paymentType || "N/A",
      discount: expense.discount || 0,
      discountType: expense.discountType || "percentage",
      finalAmount: expense.finalAmount || 0,
      paidAmount: expense.paidAmount || 0,
      remainingAmount: expense.remainingAmount || 0,
      penalty: expense.penalty || 0,
      earnedDate: expense.paidDate || expense.generateDate || "N/A",
      totalAmount: expense.totalAmount || 0,
      academicYearDetails: expense.academicYearDetails?.year || "N/A",
    })) || [];

  // Map expenses to data source with camelCase fields
  const dataSource = useMemo(
    () =>
      expenses?.map((expense) => ({
        key: expense._id,
        categoryName: expense.category?.categoryName || "N/A",
        subCategoryName: expense?.subcategory || "N/A",
        description: expense.description || (
          <span className="text-yellow-600">No Description</span>
        ),
        paymentType: expense.paymentType || "N/A",
        totalAmount: expense.totalAmount || 0,
        discount: expense.discount || 0,
        discountType: expense.discountType || "percentage",
        finalAmount: expense.finalAmount || 0,
        paidAmount: expense.paidAmount || 0,
        remainingAmount: expense.remainingAmount || 0,
        penalty: expense.penalty || 0,
        paymentStatus: expense.paymentStatus || "N/A",
        earnedDate: expense.paidDate || expense.generateDate || null,
        totalAmount: expense.totalAmount || 0,
        academicYearDetails: expense.academicYearDetails?.year || "N/A",
      })),
    [expenses]
  );

  // Custom components for table headers
  const components = {
    // header: {
    //   cell: CustomHeaderCell,
    // },
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
        <Table.Summary.Cell index={0} colSpan={6}>
          <strong>Totals:</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <strong>{formatCurrency(totalPenalty)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5}>
          <strong>{formatCurrency(totalFinalAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6}>
          <strong>{formatCurrency(totalPaidAmountSum)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7}>
          <strong>{formatCurrency(totalRemainingAmount)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8}></Table.Summary.Cell>
        <Table.Summary.Cell index={9} />
      </Table.Summary.Row>
    );
  };

  // Retrieve statistics from Redux store and map to color classes
  const cardDataWithValues = useMemo(() => {
    const cards = [
      {
        title: "Total Paid Amount",
        value: formatCurrency(totalPaidAmount, "QR"),
        icon: <FaRegMoneyBillAlt />,
        color: "green",
      },
      {
        title: "Remaining Partial Paid",
        value: formatCurrency(remainingPartialPaidExpense, "QR"),
        icon: <BiDonateHeart />,
        color: "yellow",
      },
      {
        title: "Unpaid Amount",
        value: formatCurrency(unpaidExpense, "QR"),
        icon: <MdOutlineMoneyOff />,
        color: "red",
      },
      {
        title: "Total Expense",
        value: formatCurrency(totalExpenseAmount, "QR"),
        icon: <AiFillAccountBook />,
        color: "purple",
      },
      // Add more cards if necessary
    ];

    return cards;
  }, [
    totalExpenseAmount,
    totalPaidAmount,
    remainingPartialPaidExpense,
    unpaidExpense,
  ]);

  return (
    <Layout title="Expense List | Student Diwan">
      <DashLayout>
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
                placeholder="Search by Description"
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
                      const selectedExpense = expenseIdMap[selectedRowKey];
                      if (selectedExpense) {
                        // Navigate to the invoice creation page with selectedRow data
                        navigate("/finance/invoices/add-new-invoice", {
                          state: { expense: selectedExpense },
                        });
                      } else {
                        toast.error("Selected expense not found.");
                      }
                    }}
                    className="flex items-center bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-2 rounded-md shadow-md"
                  >
                    Create Invoice
                  </Button>
                </Tooltip>
              )}
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => setIsExportModalVisible(true)}
                className="flex items-center bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-3 rounded-md shadow-md"
              >
                Export
              </Button>
              <Button
                className="flex items-center px-4 py-3 rounded-md text-xs bg-gradient-to-r from-pink-400 to-pink-300 text-white border-none shadow-md hover:from-pink-500 hover:to-pink-400 transition duration-200"
                icon={<FilterOutlined />}
                disabled
                // onClick={() => setIsFilterModalVisible(true)}
              >
                Filter
              </Button>
            </div>
          </div>

          {/* No Data Placeholder */}
          {!loading && expenses.length === 0 && !error && (
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
              onRow={(record) => ({
                onClick: () => {
                  if (record.paymentStatus !== "unpaid") {
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
              setSelectedExpenseForDeletion(null);
            }}
            onConfirm={() => {
              if (selectedExpenseForDeletion) {
                const { _id, category } = selectedExpenseForDeletion;
                const categoryName = category?.categoryName || category;
                dispatch(deleteExpense({ category: categoryName, id: _id }));
              } else {
                toast.error("No expense selected for deletion.");
              }
            }}
            type="Expense"
          />

          <ExportModal
            visible={isExportModalVisible}
            onClose={() => setIsExportModalVisible(false)}
            dataToExport={transformExpenseData(expenses)}
            title="ExpensesData"
            sheet="expenses_report"
          />
          {/* Add other modals like FilterExpenseModal or BulkEntriesModal if needed */}
        </div>
      </DashLayout>
    </Layout>
  );
};

export default TotalExpenseList;
