import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  MailOutlined,
} from "@ant-design/icons";

import RecentInvoiceTemplate from "../../../../Utils/FinanceTemplate/RecentInvoiceTemplate";



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
import toast from "react-hot-toast";

const RecentInvoiceList = () => {
  const [isInvoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const popupRef = useRef(null); // Define popupRef to prevent errors
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useNavHeading("Finance", "Recent Invoice List");

  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, invoices, pagination } = useSelector(
    (store) => store.admin.invoices
  );
  const [pageSize, setPageSize] = useState(10);


  const [isExportModalVisible, setIsExportModalVisible] = useState(false);

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      // Capture the pdfRef element as a canvas
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2, // Increase scale for higher resolution
        useCORS: true, // Enable cross-origin
        windowWidth: pdfRef.current.scrollWidth, // Match the element's width
        windowHeight: pdfRef.current.scrollHeight, // Match the element's height
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedInvoice.invoiceNumber || "Invoice"}.pdf`); // Save the PDF
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };



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
                onClick={() => {
                  setSelectedInvoice(record);
                  setInvoiceVisible(true);
                }}
              >
                Preview
              </Menu.Item>
              <Menu.Item
                icon={<EyeOutlined />}
                onClick={() => {
                  dispatch(setInvoiceData({ ...record, mode: 'view' }));
                  navigate("/finance/invoices/add-new-invoice");
                }}
              >
                View (Read Only)
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
  {!record.isCancel && !record.isReturn ?
                <Menu.Item
                icon={<MailOutlined />}
                onClick={() => {
                }}
              >
                 Send Mail
              </Menu.Item>:null
              }
              {/* View (Read Only) */}
           
            
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



          {/* PDF Preview Modal */}
          {isInvoiceVisible && selectedInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Full-screen blur background */}
              <div
                className="absolute inset-0 bg-black bg-opacity-60"
                style={{ backdropFilter: "blur(8px)" }}
                onClick={() => setInvoiceVisible(false)}
              />
              {/* Centered content */}
              <div
                ref={popupRef}
                className="relative p-6 w-full max-w-[800px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <div className="flex justify-end space-x-2 mb-4">
                  <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md hover:opacity-90"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setInvoiceVisible(false)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                  >
                    ✕
                  </button>
                </div>

                {/* Hidden container for PDF generation */}
                <div ref={pdfRef} className="hidden">
                  <RecentInvoiceTemplate data={selectedInvoice} />
                </div>

                {/* Visible content */}
                <RecentInvoiceTemplate data={selectedInvoice} />
              </div>
            </div>
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
