// src/components/TotalRevenueList.jsx

import React, { useEffect, useState, useCallback } from "react";
import { Table, Input, Button, Spin, Alert, Dropdown, Menu } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  UploadOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import DeleteModal from "./Components/DeleteModal";
import EditTotalRevenueSidebar from "./Components/EditTotalRevenueSidebar";
import ExportModal from "./Components/ExportModal";
import FilterRevenueModal from "./Components/FilterRevenueModal";
import SortRevenueModal from "./Components/SortRevenueModal";
import BulkEntriesModal from "./Components/BulkEntriesModal";
import debounce from "lodash.debounce";
import { setCurrentPage } from "../../../../Store/Slices/Finance/Earnings/earningsSlice";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";

/**
 * CustomHeaderCell Component
 * Applies a light pink background and reduced padding to the table header cells.
 */
const CustomHeaderCell = (props) => (
  <th {...props} className="bg-pink-100 py-2 px-3 text-sm" />
);

const TotalRevenueList = () => {
  const [searchText, setSearchText] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isBulkEntriesModalVisible, setIsBulkEntriesModalVisible] =
    useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null); // For Edit/Delete actions

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors - Adjust the state path based on your store configuration
  const { incomes, loading, error, totalRecords, totalPages, currentPage } =
    useSelector((state) => state.admin.earnings); // Ensure 'admin.earnings' is correct

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
      search: searchText, // This should target "Subcategory"
      page: currentPage,
      limit: 20, // Adjust as needed
      sortBy: "earnedDate", // Default sort field
      sortOrder: "desc", // Default sort order
      // Add more query params as needed
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage]);

  // Handler for search input
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1)); // Reset to first page on new search
  };

  // Menu for Action Dropdown
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => {
          setSelectedIncome(record);
          setIsSidebarVisible(true);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => {
          setSelectedIncome(record);
          setIsDeleteModalVisible(true);
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Table columns with filters and sorting
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (text) => <span className="text-sm">{text}</span>,
      width: 120,
    },
    {
      title: "Subcategory",
      dataIndex: "subCategory",
      key: "subCategory",
      sorter: (a, b) => a.subCategory.localeCompare(b.subCategory),
      render: (text) => <span className="text-sm">{text}</span>,
      width: 150,
    },
    {
      title: "Total Amount (QR)",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => a.final_amount - b.final_amount,
      render: (value) => (
        <span className="text-sm">
          {value !== undefined && value !== null ? `${value} QR` : "N/A"}
        </span>
      ),
      width: 150,
    },
    {
      title: "Paid Amount (QR)",
      dataIndex: "paid_amount",
      key: "paid_amount",
      sorter: (a, b) => a.paid_amount - b.paid_amount,
      render: (value) => (
        <span className="text-sm">
          {value !== undefined && value !== null ? `${value} QR` : "N/A"}
        </span>
      ),
      width: 150,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
      render: (value) =>
        value !== undefined && value !== null ? (
          <span className="text-green-600 text-sm">{`${value}%`}</span>
        ) : (
          "N/A"
        ),
      width: 100,
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      key: "penalty",
      sorter: (a, b) => a.penalty - b.penalty,
      render: (value) =>
        value !== undefined && value !== null ? (
          <span className="text-red-600 text-sm">{`${value} QR`}</span>
        ) : (
          "N/A"
        ),
      width: 100,
    },
    {
      title: "Earned Date",
      dataIndex: "earnedDate",
      key: "earnedDate",
      sorter: (a, b) => new Date(a.earnedDate) - new Date(b.earnedDate),
      render: (date) =>
        date ? (
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        ) : (
          "N/A"
        ),
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <Button type="link" icon={<EllipsisOutlined />} className="p-0" />
        </Dropdown>
      ),
      fixed: "right",
      width: 80,
    },
  ];

  // Handle table pagination and sorting change
  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newSortBy = sorter.field || "earnedDate";
    const newSortOrder = sorter.order === "descend" ? "desc" : "asc";

    const params = {
      search: searchText, // Ensure this targets "Subcategory"
      page: newPage,
      limit: 20, // Adjust as needed
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
    final_amount:
      income.final_amount !== undefined && income.final_amount !== null
        ? income.final_amount
        : "N/A",
    paid_amount:
      income.paid_amount !== undefined && income.paid_amount !== null
        ? income.paid_amount
        : "N/A",
    discount:
      income.discount !== undefined && income.discount !== null
        ? income.discount
        : "N/A",
    penalty:
      income.penalty !== undefined && income.penalty !== null
        ? income.penalty
        : "N/A",
    remaining_amount:
      income.remaining_amount !== undefined && income.remaining_amount !== null
        ? income.remaining_amount
        : "N/A",
    earnedDate: income.paidDate || income.generateDate || "N/A",
  }));

  // Define custom components for the Table to style the header
  const components = {
    header: {
      cell: CustomHeaderCell,
    },
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
          <div
            className="cursor-pointer text-lg font-semibold"
            onClick={() => navigate(-1)}
          >
            Total Revenue List
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
              style={{ borderRadius: "0.375rem" }} // Tailwind's rounded-md equivalent
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

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                current: currentPage,
                total: totalRecords,
                pageSize: 20, // Adjust as needed
                showSizeChanger: false,
                size: "small",
              }}
              onChange={handleTableChange}
              className="rounded-lg shadow text-sm"
              bordered
              size="small"
              scroll={{ x: "max-content" }}
              components={components} // Apply custom header styling
              rowClassName="hover:bg-gray-50"
            />
          </div>
        )}

        {/* Action Modals */}
        <DeleteModal
          visible={isDeleteModalVisible}
          onClose={() => {
            setIsDeleteModalVisible(false);
            setSelectedIncome(null);
          }}
          income={selectedIncome}
        />
        <EditTotalRevenueSidebar
          visible={isSidebarVisible}
          onClose={() => {
            setIsSidebarVisible(false);
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
        />
        <SortRevenueModal
          visible={isSortModalVisible}
          onClose={() => setIsSortModalVisible(false)}
          onSortChange={(sort) => console.log(sort)}
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
