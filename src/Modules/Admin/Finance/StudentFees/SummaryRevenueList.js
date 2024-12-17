// src/Modules/Admin/Finance/StudentFees/SummaryRevenueList.js

import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import SortPopModal from "./Components/SortPopModal"; // Corrected import
import StudentFeesPaidModal from "./Components/StudentFeesPaidModal";
import StudentFeesUnpaidModal from "./Components/StudentFeesUnpaidModal";
import { FiUserPlus } from "react-icons/fi";
import {
  deleteStudentFees,
  fetchAllStudentFees,
} from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import moment from "moment"; // Replaced dayjs with moment

const SummaryRevenueList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { records, loading, error } = useSelector(
    (state) => state.admin.studentFees
  ); // Adjust the path based on your store

  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isStudentDetailsModalVisible, setStudentDetailsModalVisible] =
    useState(false);
  const [isStudentUnpaidModalVisible, setStudentUnpaidModalVisible] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState("newest");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    // Fetch all student fee records when the component mounts
    dispatch(fetchAllStudentFees({ page: 1, limit: 20 })); // Adjust params as needed
  }, [dispatch]);

  const handleRowClick = (record) => {
    // Clean base amount by removing "QR" and converting to a number
    const baseAmount = parseFloat(
      record?.amount?.replace("QR", "").trim() || 0
    );

    // Clean penalty, tax, and discount fields
    const penalty = parseFloat(record?.penalty?.replace("QR", "").trim() || 0);
    const taxPercentage = parseFloat(record?.tax?.replace("%", "").trim() || 0);
    const discountPercentage = parseFloat(
      record?.discount?.replace("%", "").trim() || 0
    );

    // Calculate tax and discount amounts
    const taxAmount = (baseAmount * taxPercentage) / 100;
    const discountAmount = (baseAmount * discountPercentage) / 100;

    // Calculate total amount
    const totalAmount = baseAmount + taxAmount - discountAmount + penalty;

    const studentDetails = {
      name: record?.name || "N/A",
      class: record?.class || "N/A",
      section: record?.section || "N/A",
      fees_type: record?.feesType || "N/A",
      due_date: record?.dueDate || "N/A",
      total_amount: totalAmount ? `${totalAmount.toFixed(2)} QR` : "N/A",
      penalty: record?.penalty || "N/A",
      paid_status: record?.status || "N/A",
      tax: record?.tax || "N/A", // Keep the original tax string
      discount: record?.discount || "N/A", // Keep the original discount string
      paid_by: "Card", // Example data, adjust as needed
      transaction_id: "12345", // Example data, adjust as needed
      payment_method: "Stripe", // Example data, adjust as needed
    };

    setSelectedStudentDetails(studentDetails);

    if (record?.status === "Paid") {
      setStudentDetailsModalVisible(true); // Open Paid Modal
    } else if (record?.status === "Unpaid") {
      setStudentUnpaidModalVisible(true); // Open Unpaid Modal
    }
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: "No Selection",
        content: "Please select at least one fee record to delete.",
      });
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete the selected fee records?",
      onOk: () => {
        dispatch(deleteStudentFees(selectedRowKeys))
          .unwrap()
          .then(() => {
            // Refresh the data after deletion
            dispatch(fetchAllStudentFees({ page: 1, limit: 20 }));
            setSelectedRowKeys([]);
          })
          .catch((err) => {
            // Error handling is managed by the slice
            console.error("Delete failed:", err);
          });
      },
    });
  };

  // Function to handle single record deletion
  const handleDeleteSingleRecord = (feeId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this fee record?",
      onOk: () => {
        dispatch(deleteStudentFees([feeId]))
          .unwrap()
          .then(() => {
            // Refresh the data after deletion
            dispatch(fetchAllStudentFees({ page: 1, limit: 20 }));
            setSelectedRowKeys((prevKeys) =>
              prevKeys.filter((key) => key !== feeId)
            );
          })
          .catch((err) => {
            console.error("Delete failed:", err);
          });
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      sorter: (a, b) => a.class.localeCompare(b.class),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      sorter: (a, b) => a.section.localeCompare(b.section),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Fees Type",
      dataIndex: "feesType",
      key: "feesType",
      sorter: (a, b) => a.feesType.localeCompare(b.feesType),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
      render: (value) => (typeof value === "string" ? `${value}` : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text) => (
        <span
          className={`px-2 py-1 rounded-lg text-sm font-medium ${
            text === "Paid"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      key: "penalty",
      sorter: (a, b) => parseFloat(a.penalty) - parseFloat(b.penalty),
      render: (value) => (typeof value === "string" ? `${value}` : "N/A"),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      sorter: (a, b) => parseFloat(a.tax) - parseFloat(b.tax),
      render: (value) => (typeof value === "string" ? `${value}` : "N/A"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => parseFloat(a.discount) - parseFloat(b.discount),
      render: (value) => (typeof value === "string" ? `${value}` : "N/A"),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      sorter: (a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount),
      render: (value) => (typeof value === "string" ? `${value}` : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            onClick={() => navigate(`/finance/studentfees/edit/${record._id}`)}
            className="text-blue-500"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteSingleRecord(record._id)}
            className="text-red-500"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        {/* Filters and Buttons Section */}
        <div className="flex justify-between items-start">
          {/* Left Side: Filters and Radio Buttons */}
          <div className="flex flex-col space-y-4">
            {/* Filters Row */}
            <div className="flex items-center space-x-4">
              {/* Class Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Class</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                  <option value="Ten">Ten</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              {/* Section Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Section</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                  <option value="A">A</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              {/* Fees Type Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-36">
                  <option value="Exam fees">Exam fees</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>

            {/* Radio Buttons Row */}
            <div className="flex space-x-6">
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="studentFilter"
                  className="form-radio text-green-600"
                  defaultChecked
                />
                <span className="text-green-600 font-medium">Everyone</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="studentFilter"
                  className="form-radio text-gray-500"
                />
                <span className="text-gray-700">Paid Student</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="studentFilter"
                  className="form-radio text-gray-500"
                />
                <span className="text-gray-700">Unpaid Student</span>
              </label>
            </div>
          </div>

          {/* Right Side: Buttons */}
          <div className="flex items-center space-x-4">
            {/* Sort Button */}
            <button
              className="flex items-center px-4 py-2 border rounded-lg text-gray-700 font-medium hover:shadow-md"
              style={{
                borderImage: "linear-gradient(to right, #FF007C, #8A2BE2) 1",
                borderRadius: "8px",
              }}
              onClick={() => setSortModalVisible(true)}
            >
              Sort
              <span className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 17l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
              </span>
            </button>

            {/* Export Button */}
            <button
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90"
              onClick={() => console.log("Exporting data...")} // Implement export functionality
            >
              Export
              <span className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </span>
            </button>

            {/* Add New Fee Button */}
            <button
              onClick={() =>
                navigate("/finance/studentfees/total-revenue/addFees")
              }
              className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">Add New Fee</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                <FiUserPlus size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center my-4">
              <Spin tip="Loading..." />
            </div>
          ) : error ? (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              className="my-4"
            />
          ) : (
            <Table
              dataSource={records}
              columns={columns}
              pagination={{ pageSize: 10 }}
              rowKey="_id"
              className="rounded-lg overflow-hidden"
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
            />
          )}
        </div>

        {/* SortPopModal */}
        <SortPopModal
          visible={isSortModalVisible}
          onClose={() => setSortModalVisible(false)}
          onApply={() => {
            console.log("Sort Applied with option:", selectedOption);
            setSortModalVisible(false);
            // Implement sorting logic here based on selectedOption
          }}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        {/* StudentFeesPaidModal */}
        <StudentFeesPaidModal
          visible={isStudentDetailsModalVisible}
          onClose={() => setStudentDetailsModalVisible(false)}
          onDownload={() => console.log("Downloading PDF...")}
          onSendInvoice={() => console.log("Sending Invoice...")}
          studentDetails={selectedStudentDetails}
          paymentDetails={[
            {
              date: "2024-12-01",
              time: "08:34:56 AM",
              amount: "1214.4 QR",
              penalty: "N/A",
              status: "Successful",
              payment_method: "Stripe",
            },
          ]}
        />

        {/* StudentFeesUnpaidModal */}
        <StudentFeesUnpaidModal
          visible={isStudentUnpaidModalVisible}
          onClose={() => setStudentUnpaidModalVisible(false)}
          onSendReminder={() => console.log("Sending Reminder...")}
          studentDetails={selectedStudentDetails}
        />
      </div>
    </AdminLayout>
  );
};

export default SummaryRevenueList;
