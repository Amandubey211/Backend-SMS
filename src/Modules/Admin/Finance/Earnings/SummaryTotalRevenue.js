// src/components/SummaryTotalRevenue.jsx

import React, { useEffect, useState, useCallback } from "react";
import { Table, Input, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import debounce from "lodash.debounce";

const SummaryTotalRevenue = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      limit: 5, // Adjust as needed
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
    // Uncomment and adjust these columns if needed
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   sorter: (a, b) => a.description.localeCompare(b.description),
    //   render: (text) => <span>{text}</span>,
    // },
    // {
    //   title: "From",
    //   dataIndex: "from",
    //   key: "from",
    //   sorter: (a, b) => a.from.localeCompare(b.from),
    //   render: (text) => <span>{text}</span>,
    // },
    // {
    //   title: "Academic Year",
    //   dataIndex: "academicYear",
    //   key: "academicYear",
    //   sorter: (a, b) => a.academicYear.localeCompare(b.academicYear),
    //   render: (text) => <span>{text}</span>,
    // },
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
    // Uncomment and adjust if Earned Date is needed
    // {
    //   title: "Earned Date",
    //   dataIndex: "earnedDate",
    //   key: "earnedDate",
    //   sorter: (a, b) => new Date(a.earnedDate) - new Date(b.earnedDate),
    //   render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    // },
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
      limit: 5, // Adjust as needed
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
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">
          Summary of Total Revenue
        </h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            className="w-64"
            value={searchText}
            onChange={handleSearch}
            allowClear
          />
          {/* View More Button */}
          <button
            onClick={handleViewMore}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow hover:shadow-md transition cursor-pointer"
          >
            View More
          </button>
        </div>
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

      {/* Table */}
      {!loading && !error && (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current: currentPage,
            total: totalRecords,
            pageSize: 5, // Adjust as needed
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          className="rounded-lg"
          bordered
          scroll={{ x: "max-content" }}
          onRow={onRowClick} // Attach the row click handler here
        />
      )}
    </div>
  );
};

export default SummaryTotalRevenue;
