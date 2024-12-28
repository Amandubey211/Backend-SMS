import React, { useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Table, Spin, Input, Tooltip, Button, Modal, Tag, Pagination, Select } from "antd";
import { ExportOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Invoice from "./Components/Invoice";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchInvoice } from "../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { isCancel } from "axios";

const RecentInvoiceList = () => {
  const [isInvoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const popupRef = useRef(null); 
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, invoices,pagination } = useSelector((store) => store.admin.invoices);

  // Filtered data based on search query
  const filteredData = invoices?.filter(
    (item) =>
      item?.invoiceNumber?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.receiver?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.finalAmount?.toString()?.includes(searchQuery.toLowerCase())
  );
  const handleAction = (action, record) => {
    if (action === "return") {
      console.log("Returning invoice", record);
    } else if (action === "cancel") {
      console.log("Cancelling invoice", record);
    }
  };
  useEffect(() => {
    const filters = {
        page,
        limit: pageSize,
    };
   
    dispatch(fetchInvoice(filters));
}, [ page, pageSize]);
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
      render: (finalAmount) => finalAmount?.toFixed(2) + ' QAR',
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
        let color = "green";
        let text = "Active";
        if (record.isCancel) { color = "red"; text = "Cancel" } else if(record.isReturn){
          color = "yellow"; text = "Return"
        }
        return (
          <Tag color={color} className="text-xs capitalize">
            {text}
          </Tag>
        );
      }
    },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Dropdown
        overlay={
          <Menu>
              <Menu.Item
              onClick={() => { setInvoiceVisible(true); }}
            >
              Preview
            </Menu.Item>
            <Menu.Item
              onClick={() => { navigate('/finance/penaltyAdjustment/add-new-penalty-adjustment') }}
            >
              Return
            </Menu.Item>
            <Menu.Item
              onClick={() => handleAction("cancel", record)}
            >
              Cancel
            </Menu.Item>
          </Menu>
        }
        trigger={["click"]}
      >
        <Button shape="circle" icon={<MoreOutlined />} />
      </Dropdown>
    ),
    },
  ];

const closeInvoice = (e) => {
  if (popupRef.current && !popupRef.current.contains(e.target)) {
    setInvoiceVisible(false); // Close popup when clicking outside
  }
};
const dispatch = useDispatch()
const filterOnchange = (e) => {
  const { name, value } = e.target;
  if (value == "isCancel") {
    dispatch(fetchInvoice({ isCancel: true }))
  } else if (value == "isReturn") {
    dispatch(fetchInvoice({ isReturn: true }))
  } else {
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
              className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90"
              onClick={() => console.log("Exporting data...")} 
            >
              <ExportOutlined />  Export
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
        ) : (<>
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="invoiceNumber"
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => { setSelectedInvoice(record) }
            })}
          />
      
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px',marginLeft:'2px' }}>
        <div>
          <span>Items per page: </span>
          <Select
            value={pagination.itemsPerPage}
            onChange={(value) =>{  setPage(pagination.currentPage);
              setPageSize(value);}}
            options={[
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
            ]}
            style={{ width: '80px' }}
          />
        </div>
        <Pagination
          current={pagination?.currentPage || 1}
          total={pagination?.totalItems || 0}
          pageSize={pagination?.itemsPerPage || 10}
          onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
          }}/>
      </div>
          </>
        )}
      </div>
      {isInvoiceVisible && selectedInvoice && (
        <Modal
          visible={isInvoiceVisible}
          onCancel={() => setInvoiceVisible(false)}
          footer={null}
          width={800}
        >
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-pink-600 text-white p-4 rounded-md">
              <div>
                <p className="text-lg font-bold">ABC Higher Secondary School</p>
                <p className="text-md">11th Street, Main Road, Pincode: 674258</p>
                <p className="text-md">Maharashtra, India</p>
              </div>
              <div>
                <img src="logo-placeholder.png" alt="Logo" className="h-12" />
              </div>
            </div>

            {/* Invoice Title */}
            <h2 className="text-center text-xl font-bold text-white bg-pink-600 py-2 my-4 rounded-md">INVOICE</h2>

            {/* Invoice Details */}
            <div className="flex  justify-between ">
              <div>
                <strong>Bill To:</strong>
                <p>{selectedInvoice.receiver.name}</p>
                <p>{selectedInvoice.receiver.address}</p>
              </div>
              <div>
                <strong>Invoice Number:</strong>
                <p>{selectedInvoice.invoiceNumber}</p>
                <strong>Invoice Date:</strong>
                <p>{moment(selectedInvoice.invoiceDate).format("YYYY-MM-DD")}</p>
                <strong>Due Date:</strong>
                <p>{moment(selectedInvoice.dueDate).format("YYYY-MM-DD")}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm mb-4">
              <thead>
                <tr className="bg-pink-200">
                  <th className="border border-gray-300 py-2">S.No</th>
                  <th className="border border-gray-300 py-2">Category</th>
                  <th className="border border-gray-300 py-2">Quantity</th>
                  <th className="border border-gray-300 py-2">Amount (QAR)</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.lineItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 py-2">{index + 1}</td>
                    <td className="border border-gray-300 py-2">{item.revenueType}</td>
                    <td className="border border-gray-300 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 py-2">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <table className="w-full text-sm mb-4">
              <tbody>
                <tr>
                  <td className="text-left font-bold">Subtotal:</td>
                  <td className="text-right">{selectedInvoice.subtotal} QAR</td>
                </tr>
                <tr>
                  <td className="text-left font-bold">Tax (12%):</td>
                  <td className="text-right">{selectedInvoice.tax} QAR</td>
                </tr>
                <tr>
                  <td className="text-left font-bold">Discount:</td>
                  <td className="text-right">{selectedInvoice.discount || 0} QAR</td>
                </tr>
                <tr>
                  <td className="text-left font-bold text-pink-700">Total:</td>
                  <td className="text-right font-bold text-pink-700">{selectedInvoice.finalAmount?.toFixed(2)} QAR</td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 mt-4">
              {/* <p>For inquiries, contact: info@studentdiwan.com</p> */}
            </div>
          </div>
        </Modal>

      )}
    </div>
  </AdminLayout>
);
};

export default RecentInvoiceList;
