// src/Modules/Admin/Finance/StudentFees/SummaryRevenueList.js

import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  Tooltip} from "antd";
import {EditOutlined,DeleteOutlined,} from "@ant-design/icons";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import SortPopModal from "./Components/SortPopModal"; // Corrected import
import StudentFeesPaidModal from "./Components/StudentFeesPaidModal";
import StudentFeesUnpaidModal from "./Components/StudentFeesUnpaidModal";
import { FiUserPlus } from "react-icons/fi";
import { deleteStudentFees } from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import moment from "moment"; // Replaced dayjs with moment
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";

const SummaryRevenueList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage,setCurrentPage] = useState(1)
  useEffect(() => {
     dispatch(fetchAllIncomes({ page: 1, limit: 20,categoryId:"675bc4e3e7901c873905fd2f"})); 
  }, [dispatch]);
  const { incomes, loading, error, totalRecords,totalPages
  } = useSelector(
    (state) => state.admin.earnings
  );

  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isStudentDetailsModalVisible, setStudentDetailsModalVisible] =
    useState(false);
  const [isStudentUnpaidModalVisible, setStudentUnpaidModalVisible] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState("newest");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

   

  const handleRowClick = (record) => {
    const penalty = parseFloat(record?.penalty || 0);
    const taxAmount = (parseFloat(record?.final_amount || 0) * parseFloat(record?.tax || 0)) / 100;
    const discountAmount =
      record.discountType === "percentage"
        ? (parseFloat(record?.final_amount || 0) * parseFloat(record?.discount || 0)) / 100
        : parseFloat(record?.discount || 0);
  
    const totalAmount = parseFloat(record?.final_amount || 0) + penalty - discountAmount + taxAmount;
  
    const studentDetails = {
      category: record?.category.map((cat) => cat.categoryName).join(", ") || "N/A",
      subCategory: record?.subCategory || "N/A",
      paymentStatus: record?.paymentStatus || "N/A",
      paymentType: record?.paymentType || "N/A",
      finalAmount: `${totalAmount.toFixed(2)} QR`,
      paidAmount: `${record?.paid_amount?.toFixed(2) || 0} QR`,
      penalty: `${penalty} QR`,
      tax: `${record?.tax || 0}%`,
      discount: record?.discount || "N/A",
    };
  
    setSelectedStudentDetails(studentDetails);
  
    if (record?.paymentStatus === "paid") {
      setStudentDetailsModalVisible(true);
    } else {
      setStudentUnpaidModalVisible(true);
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
            dispatch(fetchAllIncomes({ page: 1, limit: 20 }));
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
            dispatch(fetchAllIncomes({ page: 1, limit: 20 }));
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
      title: "Subcategory",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-lg text-sm font-medium ${
            status === "paid"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Final Amount",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => (a.final_amount || 0) - (b.final_amount || 0),
      render: (amount) => <span>{`${amount.toFixed(2)} QR`}</span>,
    },
    {
      title: "Paid Amount",
      dataIndex: "paid_amount",
      key: "paid_amount",
      sorter: (a, b) => new Date(a.paid_amount) - new Date(b.paid_amount),
      render: (amount) => <span>{`${amount.toFixed(2)} QR`}</span>,
    },
  {
      title: "Date",
      dataIndex: "paidDate",
      key: "paidDate",
      sorter: (a, b) => new Date(a.paidDate) - new Date(b.paidDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount, record) => (
        <span>
          {discount
            ? record.discountType === "percentage"
              ? `${discount}%`
              : `${discount} QR`
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                // onClick={() => {
                //   const incomeToEdit = incomeIdMap[record.key];
                //   if (incomeToEdit) {
                //     dispatch(setReadOnly(true)); // Set readOnly to true for viewing
                //     dispatch(setSelectedIncome(incomeToEdit)); // Dispatch the selected income to Redux
                //     navigate("/finance/earning/add"); // Navigate without passing state
                //   } else {
                //     toast.error("Selected income not found.");
                //   }
                // }}
                className="text-blue-600 hover:text-blue-800 p-0"
                aria-label="Edit"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                // onClick={() => {
                //   const incomeToDelete = incomeIdMap[record.key];
                //   if (incomeToDelete) {
                //     setSelectedIncomeForDeletion(incomeToDelete); // Set income for deletion
                //     setIsDeleteModalVisible(true);
                //   } else {
                //     toast.error("Selected income not found.");
                //   }
                // }}
                className="text-red-600 hover:text-red-800 p-0"
                aria-label="Delete"
              />
            </Tooltip>
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
        <div className="flex justify-between items-start ">
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
          <div className="flex items-center space-x-4 justify-center">
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
                navigate("/finance/studentfees/add/form")
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
            dataSource={incomes}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize: 20,
              total: totalRecords,
              onChange: (page) => {
                setCurrentPage(page)
                dispatch(fetchAllIncomes({ page, limit: 20,categoryId:"675bc4e3e7901c873905fd2f"}));
              },
            }}
            rowKey="_id"
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
