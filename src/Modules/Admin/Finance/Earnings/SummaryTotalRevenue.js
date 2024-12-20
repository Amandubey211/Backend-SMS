// src/components/SummaryTotalRevenue.jsx

import React, { useEffect, useState, useCallback } from "react";
import { Table, Input, Spin, Alert, Button } from "antd";
import { SearchOutlined, FilterOutlined, ExportOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import debounce from "lodash.debounce";

const SummaryTotalRevenue = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modal visibility states
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isBulkEntriesModalVisible, setIsBulkEntriesModalVisible] = useState(false);

  // Selectors
  const { incomes, loading, error, totalRecords, totalPages, currentPage } =
    useSelector((state) => state.admin.earnings);

  // Debounced search to optimize API calls
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllIncomes(params));
    }, 300),
    [dispatch]
  );

  // Fetch incomes on component mount and when dependencies change
  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: 20, // Updated to match pagination in the table
      sortBy: "earnedDate", // Default sort field
      sortOrder: "desc", // Default sort order
      // Add more query params as needed
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage]);

  // Table columns with filters and sorting
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Subcategory",
      dataIndex: "subCategory",
      key: "subCategory",
      sorter: (a, b) => a.subCategory.localeCompare(b.subCategory),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      sorter: (a, b) => a.paymentType.localeCompare(b.paymentType),
      filters: [
        { text: "Cash", value: "cash" },
        { text: "Online", value: "online" },
      ],
      onFilter: (value, record) => record.paymentType === value,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
      filters: [
        { text: "Paid", value: "paid" },
        { text: "Unpaid", value: "unpaid" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
      render: (value, record) =>
        record.discountType === "percentage"
          ? `${value || 0}%`
          : `${value || 0} QR`,
    },
    {
      title: "Final Amount (QR)",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => a.final_amount - b.final_amount,
      render: (value) => <span>{value || "0"} QR</span>,
    },
    {
      title: "Paid Amount (QR)",
      dataIndex: "paid_amount",
      key: "paid_amount",
      sorter: (a, b) => a.paid_amount - b.paid_amount,
      render: (value) => <span>{value || "0"} QR</span>,
    },
    {
      title: "Remaining Amount (QR)",
      dataIndex: "remaining_amount",
      key: "remaining_amount",
      sorter: (a, b) => a.remaining_amount - b.remaining_amount,
      render: (value) => <span>{value || "0"} QR</span>,
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <span className="cursor-pointer text-gray-500 hover:text-gray-700">
          ...
        </span>
      ),
    },
  ];

  // Search input change handler
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    // Optionally, reset to first page on new search
    // dispatch(setCurrentPage(1)); if you have such an action
  };

  // Handle "View More" navigation
  const handleViewMore = () => {
    navigate("/finance/total-revenue-list");
  };

  // Handle table pagination and sorting change
  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newSortBy = sorter.field || "earnedDate";
    const newSortOrder = sorter.order === "descend" ? "desc" : "asc";

    const params = {
      search: searchText,
      page: newPage,
      limit: 20, // Updated to match pagination in the table
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      // Include any additional filters here
      ...filters,
    };

    dispatch(fetchAllIncomes(params));
  };

  // Map incomes data to table dataSource
  const dataSource = incomes.map((income) => ({
    key: income._id,
    category: income.category?.[0]?.categoryName || "N/A",
    subCategory: income.subCategory || "N/A",
    description: income.description || "N/A",
    from:
      income.collectBy ||
      `${income.studentDetails?.firstName || ""} ${
        income.studentDetails?.lastName || ""
      }`.trim() ||
      "N/A",
    academicYear: income.academicYearDetails?.[0]?.year || "N/A",
    paymentType: income.paymentType || "N/A",
    paymentStatus: income.paymentStatus || "N/A",
    tax: income.tax,
    discount: income.discount,
    discountType: income.discountType,
    penalty: income.penalty,
    total_amount: income.total_amount,
    final_amount: income.final_amount,
    paid_amount: income.paid_amount,
    remaining_amount: income.remaining_amount,
    earnedDate: income.paidDate || income.generateDate || "N/A",
  }));

  // Row click handler to navigate to AddEarnings.jsx with incomeData
  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate("/finance/earning/add", {
          state: { incomeData: record },
        });
      },
    };
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
        {/* Back Navigation */}
        <div
          className="cursor-pointer text-lg font-semibold"
          onClick={() => navigate(-1)}
        >
          Total Revenue List
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            className="flex items-center px-3 py-1 border-2 rounded-md hover:shadow-lg text-xs"
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
            className="w-full md:w-64 text-sm"
            value={searchText}
            onChange={handleSearch}
            allowClear
            style={{ borderRadius: "0.375rem" }}
          />
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => setIsExportModalVisible(true)}
            className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 border-none hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition duration-200 text-xs"
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

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <Spin tip="Loading..." size="small" />
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
          className="my-4 text-xs"
        />
      )}

      {/* Table Section */}
      {!loading && !error && (
        <div className="overflow-x-auto w-full">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: currentPage,
              total: totalRecords,
              pageSize: 20, // Updated to match fetch limit
              showSizeChanger: false,
              size: "small",
            }}
            onChange={handleTableChange}
            className="rounded-lg shadow text-sm w-full" // Added w-full for full-width
            bordered
            size="small"
            scroll={{ x: "max-content" }}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            onRow={onRowClick}
          />
        </div>
      )}
    </div>
  );
};

export default SummaryTotalRevenue;
