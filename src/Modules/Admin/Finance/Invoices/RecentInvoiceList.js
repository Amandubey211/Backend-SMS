import React, { useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Table, Spin, Input, Tooltip, Button } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Invoice from "./Components/Invoice";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchInvoice } from "../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { isCancel } from "axios";

const RecentInvoiceList = () => {
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isInvoiceVisible, setInvoiceVisible] = useState(false); // Control popup visibility
  const popupRef = useRef(null); // Reference for the Invoice popup
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, invoices } = useSelector((store) => store.admin.invoices);

  // Filtered data based on search query
  const filteredData = invoices.filter(
    (item) =>
      item?.invoiceNumber?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.receiver?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.finalAmount?.toString()?.includes(searchQuery.toLowerCase())
  );

  // Define Ant Design columns
  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (invoiceNumber) => `-${invoiceNumber.slice(-5)}`,
    },
    {
      title: "Recipient Name",
      dataIndex: "receiver",
      key: "receiver",
      render: (receiver) => receiver?.name || "N/A",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => (dueDate ? moment(dueDate).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (finalAmount) => finalAmount?.toFixed(2) + ' QR',
      sorter: (a, b) => a.finalAmount - b.finalAmount,
    },
    {
      title: "Category",
      dataIndex: "lineItems",
      key: "lineItems",
      render: (lineItems) =>
        lineItems?.length ? (
          <>
            {lineItems[0]?.revenueType}{" "}
            {lineItems[1]?.revenueType && <span><br />{lineItems[1]?.revenueType}</span>}
          </>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let style = {};
        let text = "Active";
        if (record.isReturn) {
          style = { backgroundColor: "#F3EAFF", color: "#3F2FF2" };
          text = "Return";
        } else if (record.isCancel) {
          style = { backgroundColor: "#FFE6E5", color: "#E70F00" };
          text = "Cancel";
        } else {
          style = { backgroundColor: "#cfe3d3", color: "#297538" };
        }
        return (
          <span className="px-4 py-2 rounded-md text-sm font-semibold" style={style}>
            {text}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="More Options">
          <Button
            shape="circle"
            icon={<MoreOutlined />}
            onClick={() => console.log("Action on", record)}
          />
        </Tooltip>
      ),
    },
  ];



  const openInvoice = () => {
    setInvoiceVisible(true); // Show Invoice popup
  };

  const closeInvoice = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setInvoiceVisible(false); // Close popup when clicking outside
    }
  };
const dispatch = useDispatch()
  // Attach click outside listener
  useEffect(() => {
    document.addEventListener("mousedown", closeInvoice);
    return () => document.removeEventListener("mousedown", closeInvoice);
  }, []);
  const filterOnchange = (e)=>{
  const {name,value} = e.target;
  if(value == "isCancel"){
    dispatch(fetchInvoice({isCancel:true}))
  }else if(value == "isReturn"){
    dispatch(fetchInvoice({isReturn:true}))
  }else{
    dispatch(fetchInvoice({}))
  }

  }

  return (
    <AdminLayout>
      <div className="p-4 bg-white rounded-lg ">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          {/* Filters and Buttons Section */}
          <div className="flex justify-between items-start">
         
            <div className="flex flex-col space-y-4">
              <div className="flex gap-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              <div className="flex space-x-6">
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="status"
                  className="form-radio text-green-600"
                  value="all"
                  defaultChecked
                  onChange={filterOnchange}
                />
                <span className="text-green-600 font-medium">All</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="status"
                  className="form-radio text-gray-500"
                  value="isCancel"
                  onChange={filterOnchange}
                />
                <span className="text-gray-700">Cancel</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="status"
                  className="form-radio text-gray-500"
                  value="isReturn"
                  onChange={filterOnchange}
                />
                <span className="text-gray-700">Return</span>
              </label>
            </div>
            </div>
            {/* Right Side: Buttons */}
            <div className="flex items-center space-x-4">
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
                  navigate("/finance/invoices/add-new-invoice")
                }
                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
              >
                <span className="text-gray-800 font-medium">Add New Invoice</span>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                  <FiUserPlus size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Table */}
        <div className="my-8 border shadow-sm rounded-lg ">
          {/* Table Section */}
          {loading ? (
            <Spin tip="Loading..." />
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="invoiceNumber"
              pagination={{ pageSize: 10 }}
              size="small"
              onRow={() => setSortModalVisible(true)}
            />
          )}
        </div>
        {isInvoiceVisible && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
            style={{ backdropFilter: "blur(8px)" }} // Enhanced blur
          >
            {/* Invoice Modal Container */}
            <div
              ref={popupRef}
              className="relative p-6 w-full max-w-[700px] max-h-[90vh] "
            >
              {/* Top-Right Buttons (Inside Invoice Container) */}
              <div className="absolute top-4 right-0 left-[43rem] mt-4 mr-4 flex flex-col items-start space-y-2">
                {/* Close Button */}
                <button
                  onClick={() => setInvoiceVisible(false)}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                >
                  ✕
                </button>

                {/* Action Buttons */}
                <button
                  className="w-40 py-2 text-white font-semibold rounded-md"
                  style={{ background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)" }}
                >
                  Download PDF
                </button>
                <button
                  className="w-40 py-2 text-white font-semibold rounded-md"
                  style={{ background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)" }}
                >
                  Send Invoice
                </button>
              </div>

              {/* Invoice Component */}
              <Invoice />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RecentInvoiceList;
