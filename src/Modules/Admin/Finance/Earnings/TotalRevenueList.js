// src/Components/Admin/Finance/Earnings/TotalRevenueList.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Input, Button, Spin, Alert, Tooltip, Card } from "antd";
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
} from "../../../../Store/Slices/Finance/Earnings/earningsSlice";

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
    totalPages,
    currentPage,
    pageSize,
    filters,
  } = useSelector((state) => state.admin.earnings);

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
      limit: 10,
      // sortBy: "earnedDate",
      // sortOrder: "desc",
      ...filters,
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage, pageSize, filters]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleFilterApply = (appliedFilters) => {
    dispatch(setFilters(appliedFilters));
  };

  const renderActionIcons = (record) => (
    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Edit">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            dispatch(setReadOnly(false));
            navigate("/finance/earning/add", { state: { incomeData: record } });
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
            setSelectedIncome(record);
            setIsDeleteModalVisible(true);
          }}
          className="text-red-600 hover:text-red-800 p-0"
          aria-label="Delete"
        />
      </Tooltip>
    </div>
  );

  const formatCurrency = (value) =>
    value !== undefined && value !== null
      ? `${value.toLocaleString()} QR`
      : "N/A";

  const formatPercentage = (value) =>
    value !== undefined && value !== null ? `${value}%` : "N/A";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

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
          <span className="text-xs text-red-600">{formatCurrency(value)}</span>
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
      {
        title: "Action",
        key: "action",
        render: (_, record) => renderActionIcons(record),
        fixed: "right",
        width: 80,
      },
    ],
    [navigate, dispatch]
  );

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
      })),
    [incomes]
  );

  const components = {
    header: {
      cell: CustomHeaderCell,
    },
  };

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
        <Table.Summary.Cell index={5} />
        <Table.Summary.Cell index={6}>
          <strong>{formatCurrency(totalPenalty)}</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7} />
      </Table.Summary.Row>
    );
  };

  // Compute pageSize from totalRecords and totalPages to reflect backend pagination
  // This ensures pagination UI shows correct number of pages as per backend
  const computedPageSize =
    totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;

  const cardData = [
    {
      title: "Total Revenue",
      icon: <DollarCircleOutlined />,
      color: "purple",
      amount: "50,000 QR",
    },
    {
      title: "Remaining Partial Paid",
      icon: <PieChartOutlined />,
      color: "yellow",
      amount: "10,000 QR",
    },
    {
      title: "Unpaid Amount",
      icon: <ExclamationCircleOutlined />,
      color: "red",
      amount: "5,000 QR",
    },
    {
      title: "Paid Amount",
      icon: <CheckCircleOutlined />,
      color: "green",
      amount: "40,000 QR",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        {/* Top Cards Row */}
        <div className="w-full h-full flex flex-wrap justify-center items-stretch gap-4 p-4">
          {cardData.map((card, index) => (
            <Card
              key={index}
              title={
                <div
                  className={`flex items-center gap-2 text-${card.color}-800 font-bold`}
                >
                  {card.icon}
                  {card.title}
                </div>
              }
              className={`shadow-sm bg-gradient-to-br from-${card.color}-100 to-${card.color}-50 border-none flex-grow`}
              headStyle={{ borderBottom: "none" }}
              style={{
                flex: "1 1 200px",
                maxWidth: "400px",
                textAlign: "center",
              }}
            >
              <p className={`text-xl font-bold text-${card.color}-800`}>
                {card.amount}
              </p>
            </Card>
          ))}
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

        {!loading && incomes.length === 0 && !error && (
          <div className="text-center text-gray-500 text-xs py-4">
            No records found.
          </div>
        )}

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
            scroll={{ x: "max-content" }}
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
                dispatch(setReadOnly(true));
                navigate("/finance/earning/add", {
                  state: { incomeData: record },
                });
              },
            })}
          />
        </div>

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
