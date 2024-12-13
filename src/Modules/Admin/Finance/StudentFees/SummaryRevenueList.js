import React, { useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import SortPopModal from "./Components/SortPopModal";
import StudentFeesPaidModal from "./Components/StudentFeesPaidModal";
import StudentFeesUnpaidModal from "./Components/StudentFeesUnpaidModal";
import { FiUserPlus } from "react-icons/fi";


const SummaryRevenueList = () => {
  const [dataSource] = useState([
    {
      key: "1",
      name: "Leslie Alexander",
      class: "10",
      section: "B",
      feesType: "Exam",
      dueDate: "12/02/24",
      amount: "100 QR",
      status: "Paid",
      penalty: "25 QR",
      tax: "12%",
      discount: "0%",
      total_amount: "100 QR",
    },
    {
      key: "2",
      name: "Leslie Alexander",
      class: "10",
      section: "B",
      feesType: "Exam",
      dueDate: "12/02/24",
      amount: "100 QR",
      status: "Unpaid",
      penalty: "12QR",
      tax: "2.5%",
      discount: "15%",
      total_amount: "100 QR",
    },
  ]);


  const [isStudentDetailsModalVisible, setStudentDetailsModalVisible] = useState(false);
  const [isStudentUnpaidModalVisible, setStudentUnpaidModalVisible] = useState(false); // New state
  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("newest");
  const navigate = useNavigate();



  const handleRowClick = (record) => {
    // Clean base amount by removing "QR" and converting to a number
    const baseAmount = parseFloat(record?.amount?.replace("QR", "").trim() || 0);

    // Clean penalty, tax, and discount fields
    const penalty = parseFloat(record?.penalty?.replace("QR", "").trim() || 0);
    const taxPercentage = parseFloat(record?.tax?.replace("%", "").trim() || 0);
    const discountPercentage = parseFloat(record?.discount?.replace("%", "").trim() || 0);

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
      paid_by: "Card", // Example data
      transaction_id: "12345", // Example data
      payment_method: "Stripe", // Example data
    };

    setSelectedStudentDetails(studentDetails);

    if (record.status === "Paid") {
      setStudentDetailsModalVisible(true); // Open Paid Modal
    } else if (record.status === "Unpaid") {
      setStudentUnpaidModalVisible(true); // Open Unpaid Modal
    }
  };



  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Fees Type",
      dataIndex: "feesType",
      key: "feesType",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={`px-2 py-1 rounded-lg text-sm font-medium ${text === "Paid"
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
    },
    {
      title: "Invoice",
      key: "invoice",
      render: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-purple-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 8h6M9 12h6M9 16h6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex">
          <button
            className="w-1/2 py-2 text-center text-black bg-purple-100 hover:bg-purple-200"
            onClick={() => console.log("Edit", record)}
          >
            Edit
          </button>
          <button
            className="w-1/2 py-2 text-center text-red-600 bg-red-100 hover:bg-red-200"
            onClick={() => console.log("Delete", record)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];


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
                </select>
              </div>

              {/* Section Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Section</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                  <option value="A">A</option>
                </select>
              </div>

              {/* Fees Type Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-36">
                  <option value="Exam fees">Exam fees</option>
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
                borderColor: "linear-gradient(to right, #FF007C, #8A2BE2)",
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
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90">
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

            {/* Add New Earning Button */}
            <button
              
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
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="key"
          className="rounded-lg overflow-hidden mt-6"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />

        {/* SortPopModal */}
        <SortPopModal
          visible={isSortModalVisible}
          onClose={() => setSortModalVisible(false)}
          onApply={() => {
            console.log("Sort Applied with option:", selectedOption);
            setSortModalVisible(false);
          }}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        {/* StudentDetailsModal */}
        <StudentFeesPaidModal
          visible={isStudentDetailsModalVisible}
          onClose={() => setStudentDetailsModalVisible(false)}
          onDownload={() => console.log("Downloading PDF...")}
          onSendInvoice={() => console.log("Sending Invoice...")}
          studentDetails={selectedStudentDetails}
          paymentDetails={[
            {
              date: "12/02/2024",
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
