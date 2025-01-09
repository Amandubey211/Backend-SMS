import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";

import {
  Menu,
  Dropdown,
  Table,
  Spin,
  Input,
  Tooltip,
  Button,
  Modal,
  Tag,
  Pagination,
  Select,
  Descriptions,

} from "antd";
import {
  ExportOutlined,
  MoreOutlined,
  SearchOutlined,

  EyeOutlined,
  RedoOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";




import { FiPlus, FiUserPlus } from "react-icons/fi";


import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  cancelInvoice,
  fetchInvoice,
} from "../../../../Store/Slices/Finance/Invoice/invoice.thunk";

import {
  setInvoiceData,
  setSelectedInvoiceNumber,
} from "../../../../Store/Slices/Finance/Invoice/invoiceSlice";

import ExportModal from "../Earnings/Components/ExportModal";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const RecentInvoiceList = () => {
  const [isInvoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useNavHeading("Finance", "Recent Invoice List");

  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, invoices, pagination } = useSelector(
    (store) => store.admin.invoices
  );
  const [pageSize, setPageSize] = useState(10);


  const [isExportModalVisible, setIsExportModalVisible] = useState(false);


  // Filtered data based on search query
  const filteredData = invoices?.filter(
    (item) =>
      item?.invoiceNumber?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.receiver?.name
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      item?.finalAmount?.toString()?.includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const filters = {
      page: 1,
      limit: pageSize,
    };

    dispatch(fetchInvoice(filters));
  }, [dispatch, pageSize]);

  // Define Ant Design columns
  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (invoiceNumber) => invoiceNumber,
    },
    {
      title: "Recipient Name",
      dataIndex: "receiver",
      key: "receiver",
      render: (receiver) => receiver?.name || "N/A",
    },
    {
      title: "Category",
      dataIndex: "lineItems",
      key: "lineItems",
      render: (lineItems) =>
        lineItems?.length ? (
          <div className="flex flex-col">
            <span>{lineItems[0]?.revenueType} </span>
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) =>
        dueDate ? moment(dueDate).format("YYYY-MM-DD") : "N/A",


    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => totalAmount?.toFixed(2) + " QR",
      sorter: (a, b) => a.totalAmount - b.totalAmount,

    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (finalAmount) => finalAmount?.toFixed(2) + " QR",
      sorter: (a, b) => a.finalAmount - b.finalAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let color = "green";
        let text = "Active";
        if (record.isCancel) {
          color = "red";
          text = "Cancelled";
        } else if (record.isReturn) {
          color = "yellow";
          text = "Return";
        }
        return (
          <Tag color={color} className="text-xs capitalize">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              {/* Preview */}
              <Menu.Item
                icon={<EyeOutlined />}
                onClick={() => setInvoiceVisible(true)}
              >
                Preview
              </Menu.Item>

              {/* Return */}
              {!record.isCancel && !record.isReturn && (
                <Menu.Item
                  icon={<RedoOutlined />}
                  onClick={() => {
                    dispatch(setSelectedInvoiceNumber(record.invoiceNumber)); // Store invoice number
                    navigate("/finance/penaltyAdjustment/add-new-penalty-adjustment"); // Redirect
                  }}
                >
                  Return
                </Menu.Item>
              )}
              {record.isReturn && (
                <Menu.Item icon={<RedoOutlined />} disabled>
                  Return
                </Menu.Item>
              )}

              {/* Canceled */}
              {record.isCancel || record.isReturn ? (
                <Menu.Item icon={<CloseCircleOutlined />} disabled>
                  Canceled
                </Menu.Item>
              ) : (
                <Menu.Item
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    dispatch(cancelInvoice(record._id)).then(() =>
                      dispatch(
                        fetchInvoice({
                          page: 1,
                          limit: pageSize,
                        })
                      )
                    );
                  }}
                >
                  Cancel
                </Menu.Item>
              )}

              {/* View (Read Only) */}
              <Menu.Item
                icon={<EyeOutlined />}
                onClick={() => {
                  dispatch(setInvoiceData({ ...record, mode: 'view' }));
                  navigate("/finance/invoices/add-new-invoice");
                }}
              >
                View (Read Only)
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    }
  ];

  const closeInvoice = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setInvoiceVisible(false); // Close popup when clicking outside
    }
  };


  const filterOnchange = (e) => {
    const { name, value } = e.target;
    if (value == "isCancel") {
      dispatch(fetchInvoice({ isCancel: true }));
    } else if (value == "isReturn") {
      dispatch(fetchInvoice({ isReturn: true }));
    } else {
      dispatch(fetchInvoice({}));
    }
  };



  const transformQuotationData = (invoices) =>
    invoices?.map(({ _id, ...invoice }, index) => ({
      sNo: index + 1,
      invoiceNo: invoice?.quotationNumber || "N/A",
      receiver: invoice?.receiver?.name || "N?A",
      receiverEmail: invoice?.receiver?.email || "N?A",
      receiverPhone: invoice?.receiver?.phone || "N?A",
      receiverAddress: invoice?.receiver?.address || "N?A",
      tax: `${parseFloat(invoice?.tax)} %` || 0,
      discount:
        (invoice?.discountType === "percentage"
          ? `${parseFloat(invoice?.discount)} %`
          : `${parseFloat(invoice?.discount)} QR`) || 0,
      discountType: invoice?.discountType || "N/A",
      totalAmount: `${parseFloat(invoice?.totalAmount)} QR` || 0,
      finalAmount: `${parseFloat(invoice?.finalAmount)} QR` || 0,
      paymentStatus: invoice?.paymentStatus || "N/A",
      paymentType: invoice?.paymentType || "N/A",
      Description: invoice?.description || "N/A",
      returnInvoice: invoice?.isReturn ? "Yes" : "No",
      cancleQuotation: invoice.isCancel ? "Yes" : "No",
      date: invoice?.issueDate || "N/A",
      academicYear: invoice?.academicYear?.year || "N/A",
    })) || [];
  useNavHeading("Finance", "Invoices List");

  return (
    <Layout title="Finance | Invoice">
      <AdminLayout>
        <div className="p-4 bg-white rounded-lg ">
          <div className="p-1 bg-white rounded-lg">
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
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={() => setIsExportModalVisible(true)}
                  className="flex items-center bg-gradient-to-r  from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-2 rounded-md shadow-md"
                >Export</Button>


                {/* Add New Fee Button */}
                <button
                  onClick={() => {

                    dispatch(setInvoiceData());

                    navigate("/finance/invoices/add-new-invoice");
                  }}
                  className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                >
                  <span className="text-gray-800 font-medium">
                    Add New Invoice
                  </span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FiPlus size={16} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Table */}
          <div className="my-8 border shadow-sm rounded-lg">
            {/* Table Section */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spin tip="Loading..." />
              </div>
            ) : (
              <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="invoiceNumber"
                pagination={{
                  current: pagination?.currentPage,
                  total: pagination?.totalItems,
                  pageSize: pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  size: "small",
                  showTotal: (total, range) =>
                    `Page ${pagination?.currentPage} of ${pagination?.totalPages} | Total ${pagination?.totalItems} records`,
                  onChange: (page, pageSize) => {
                    setPageSize(pageSize);
                    const filters = {
                      page,
                      limit: pageSize,
                    };
                    dispatch(fetchInvoice(filters));
                  },
                  onShowSizeChange: (current, size) => {
                    setPageSize(size);
                  },
                }}
                size="small"
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedInvoice(record);
                  },
                })}
              />
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
                    <p className="text-lg font-bold">
                      ABC Higher Secondary School
                    </p>
                    <p className="text-md">
                      11th Street, Main Road, Pincode: 674258
                    </p>
                    <p className="text-md">Maharashtra, India</p>
                  </div>
                  <div>
                    <img src="logo-placeholder.png" alt="Logo" className="h-12" />
                  </div>
                </div>

                {/* Invoice Title */}
                <h2 className="text-center text-xl font-bold text-white bg-pink-600 py-2 my-4 rounded-md">
                  INVOICE
                </h2>

                {/* Invoice Details */}
                <div className="flex justify-between">
                  <div>
                    <strong>Bill To:</strong>
                    <p>{selectedInvoice.receiver.name}</p>
                    <p>{selectedInvoice.receiver.address}</p>
                  </div>
                  <div>
                    <strong>Invoice Number:</strong>
                    <p>{selectedInvoice.invoiceNumber}</p>
                    <strong>Invoice Date:</strong>
                    <p>
                      {moment(selectedInvoice.invoiceDate).format("YYYY-MM-DD")}
                    </p>
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
                      <th className="border border-gray-300 py-2">
                        Amount (QAR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.lineItems.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 py-2">
                          {item.revenueType}
                        </td>
                        <td className="border border-gray-300 py-2">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 py-2">
                          {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <table className="w-full text-sm mb-4">
                  <tbody>
                    <tr>
                      <td className="text-left font-bold">Subtotal:</td>
                      <td className="text-right">
                        {selectedInvoice.subtotal} QAR
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left font-bold">Tax (12%):</td>
                      <td className="text-right">{selectedInvoice.tax} QAR</td>
                    </tr>
                    <tr>
                      <td className="text-left font-bold">Discount:</td>
                      <td className="text-right">
                        {selectedInvoice.discount || 0} QAR
                      </td>
                    </tr>
                    <tr>

                      <td className="text-left font-bold text-pink-700">Total:</td>

                      <td className="text-right font-bold text-pink-700">
                        {selectedInvoice.finalAmount?.toFixed(2)} QAR
                      </td>
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
          <ExportModal
            visible={isExportModalVisible}
            onClose={() => setIsExportModalVisible(false)}
            dataToExport={transformQuotationData(invoices)}
            title="Invoice Data"
            sheet="invoice_report"
          />
        </div>
      </AdminLayout>
    </Layout>
  );
};

export default RecentInvoiceList;
