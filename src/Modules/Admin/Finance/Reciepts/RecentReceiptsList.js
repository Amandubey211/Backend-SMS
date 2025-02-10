// src/Modules/Admin/Finance/Receipts/RecentReceiptsList.js

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Input, Table, Tag, Tooltip, Modal, Button } from "antd";
import {
  MoreOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  MailOutlined,
  EyeOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  fetchAllReceipts,
  cancelReceipt,
  deleteReceipt,
} from "../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import Spinner from "../../../../Components/Common/Spinner";
import DeleteConfirmationModal from "../../../../Components/Common/DeleteConfirmationModal";
import EmailModal from "../../../../Components/Common/EmailModal";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Ensure you have installed jsPDF autoTable plugin
import html2canvas from "html2canvas";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ReceiptTemplate from "../../../../Utils/FinanceTemplate/Receipt";
import ExportModal from "../Earnings/Components/ExportModal"; // Your original ExportModal component
import { formatDate } from "../../../../Utils/helperFunctions";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { downloadPDF } from "../../../../Utils/xl";
import { sendEmail } from "../../../../Store/Slices/Common/SendPDFEmail/sendEmailThunk";
import Layout from "../../../../Components/Common/Layout";
import * as XLSX from "xlsx";
import ExportModalNew from "../../../../Components/Common/ExportModalNew";

// --- Helper function to format date & time ---
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("en-GB", options);
};

// --- Updated ExportModal Component ---
// This custom modal is used to provide options for exporting either as PDF or Excel.
const CustomExportModal = ({ visible, onClose, dataToExport }) => {
  // Function to export as PDF with proper table formatting
  const exportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "S.No", dataKey: "sNo" },
      { header: "Receipt ID", dataKey: "receiptNumber" },
      { header: "Recipient Name", dataKey: "receiver" },
      { header: "Discount", dataKey: "discount" },
      { header: "Penalty", dataKey: "penalty" },
      { header: "Paid Amount", dataKey: "totalPaidAmount" },
      { header: "Invoice Ref ID", dataKey: "refInvoiceNumber" },
      { header: "Status", dataKey: "cancelReceipt" },
      { header: "Paid Date", dataKey: "Date" },
      { header: "Academic Year", dataKey: "academicYearDetails" },
    ];
    doc.autoTable({
      columns,
      body: dataToExport,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 58, 64] },
    });
    doc.save("Receipts.pdf");
    onClose();
  };

  // Function to export as Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    XLSX.writeFile(workbook, "Receipts.xlsx");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Export Receipts Data"
      onCancel={onClose}
      footer={null}
    >
      <div className="flex justify-around">
        <Button type="primary" icon={<FilePdfOutlined />} onClick={exportPDF}>
          Export as PDF
        </Button>
        <Button type="primary" onClick={exportExcel}>
          Export as Excel
        </Button>
      </div>
    </Modal>
  );
};

const RecentReceiptsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useNavHeading("Finance", "Receipts List");

  const { receipts = [], loading, error, pagination = {} } = useSelector(
    (state) => state.admin.receipts || {}
  );

  const { loading: emailLoading, successMessage, emailError } = useSelector(
    (state) => state.common.sendEmail
  );

  // Basic states
  const [searchQuery, setSearchQuery] = useState("");

  // Cancel receipt states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Email modal states
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  // Receipt preview states
  const [isReceiptVisible, setReceiptVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Export modal state
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  // Ref for outside-click detection & PDF generation
  const popupRef = useRef(null);
  const pdfRef = useRef(null);

  // --- 1) Fetch receipts when component mounts or pagination changes ---
  useEffect(() => {
    dispatch(fetchAllReceipts({ page: currentPage, limit: pageLimit }));
  }, [dispatch, currentPage, pageLimit]);

  // --- 2) Close receipt preview modal on outside click ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        isReceiptVisible
      ) {
        setReceiptVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isReceiptVisible]);

  // --- Cancel Receipt ---
  const handleConfirmCancelReceipt = async () => {
    setCancelLoading(true);
    const result = await dispatch(cancelReceipt(selectedReceiptId));
    if (result.payload === "Receipt cancel successfully") {
      toast.success("Receipt canceled successfully!");
      dispatch(fetchAllReceipts({ page: currentPage, limit: pageLimit }));
    } else {
      toast.error("Failed to cancel receipt.");
    }
    setCancelLoading(false);
    setModalVisible(false);
  };

  // --- Preview Receipt ---
  const handlePreview = (record) => {
    setSelectedReceipt(record);
    setReceiptVisible(true);
  };

  // --- View in read-only mode ---
  const handleViewReadOnlyReceipt = (record) => {
    navigate("/finance/receipts/add-new-receipt", {
      state: {
        readOnly: true,
        receiptData: record,
      },
    });
  };

  // --- Handle Send Email ---
  const handleSendEmail = async (record) => {
    if (!record._id) {
      toast.error("Invalid receipt ID.");
      console.error("Error: Missing _id in record", record);
      return;
    }
    try {
      const toastId = toast.loading("Sending email...");
      const type = record.isCancel ? "cancelReceipt" : "receipt";
      const formattedDate = formatDate(record.date, "long");
      const payload = {
        receiver: {
          email: record.receiver.email,
          name: record.receiver?.name || "N/A",
          address: record.receiver?.address || "N/A",
          phone: record.receiver?.phone || "N/A",
        },
        schoolId: record.schoolId?._id || "N/A",
        nameOfSchool: record.schoolId?.nameOfSchool || "N/A",
        address: record.schoolId?.address || "N/A",
        branchName: record.schoolId?.branchName || "N/A",
        city: record.schoolId?.city || "N/A",
        schoolLogo: record.schoolId?.logo || "",
        receiptNumber: record.receiptNumber || "N/A",
        invoiceNumber:
          typeof record.invoiceNumber === "object"
            ? record.invoiceNumber.invoiceNumber
            : record.invoiceNumber || "N/A",
        date: formattedDate,
        govtRefNumber: record.govtRefNumber || "",
        paymentMethod: record.paymentMethod || "N/A",
        paymentStatus: record.paymentStatus || "N/A",
        lineItems: record.lineItems.map((item) => ({
          revenueType: item.revenueType || "N/A",
          quantity: item.quantity || 1,
          rate: item.total / (item.quantity || 1),
          total: item.total || 0,
        })),
        totalAmount: record.totalAmount || 0,
        tax: record.tax || 0,
        penalty: record.penalty || 0,
        discount: record.discount || 0,
        discountType: record.discountType || "fixed",
        finalAmount: record.finalAmount || 0,
      };
      console.log("Dispatching sendEmail with:", { id: record._id, type, payload });
      const result = await dispatch(sendEmail({ id: record._id, type, payload }));
      toast.dismiss(toastId);
      if (sendEmail.fulfilled.match(result)) {
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} email sent successfully!`
        );
      } else {
        console.error("Failed sendEmail response:", result);
        toast.error(result.payload || `Failed to send ${type} email.`);
      }
    } catch (err) {
      console.error("Error in handleSendEmail:", err);
      toast.error("Error sending email.");
    }
  };

  // --- Delete receipt ---
  const handleDeleteReceipt = async (record) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this receipt?");
    if (!confirmDelete) return;
    try {
      const result = await dispatch(deleteReceipt(record._id));
      if (result.payload === "Receipt Deleted successfully") {
        toast.success("Receipt deleted successfully!");
        dispatch(fetchAllReceipts({ page: currentPage, limit: pageLimit }));
      } else {
        toast.error("Failed to delete receipt.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the receipt.");
    }
  };

  // --- Download PDF from preview ---
  const handleDownloadPDF = async (pdfRef, selectedReceipt) => {
    await downloadPDF(pdfRef, selectedReceipt, "Receipt");
  };

  // --- Navigate to Add New Receipt Page ---
  const handleNavigate = () => {
    navigate("/finance/receipts/add-new-receipt");
  };

  // --- Email Modal Helpers ---
  const handleShareClick = () => {
    setEmailModalOpen(true);
  };
  const closeEmailModal = () => {
    setEmailModalOpen(false);
  };

  // --- Build data for Exporting ---
  const transformReceiptData = (receipts) =>
    receipts?.map(({ _id, ...receipt }, index) => ({
      sNo: index + 1,
      receiptNumber: receipt?.receiptNumber || "N/A",
      refInvoiceNumber:
        typeof receipt?.invoiceNumber === "object"
          ? receipt?.invoiceNumber.invoiceNumber
          : receipt?.invoiceNumber || "N/A",
      receiver: receipt?.receiver?.name || "N/A",
      receiverEmail: receipt?.receiver?.email || "N/A",
      receiverPhone: receipt?.receiver?.phone || "N/A",
      receiverAddress: receipt?.receiver?.address || "N/A",
      tax: receipt?.tax ? `${parseFloat(receipt?.tax)} %` : "0 %",
      discount:
        receipt?.discountType === "percentage"
          ? `${parseFloat(receipt?.discount)} %`
          : `${parseFloat(receipt?.discount)} QR`,
      discountType: receipt?.discountType || "percentage",
      penalty: receipt?.penalty ? `${parseFloat(receipt?.penalty)} QR` : "0 QR",
      totalPaidAmount: receipt?.totalPaidAmount
        ? `${parseFloat(receipt?.totalPaidAmount)} QR`
        : "0 QR",
      cancelReceipt: receipt?.isCancel ? "Yes" : "No",
      Date: receipt?.date ? formatDateTime(receipt.date) : "N/A",
      academicYearDetails: receipt?.academicYear?.year || "N/A",
    })) || [];

  // --- Filter logic ---
  const filteredData = receipts.filter((item) => {
    const q = searchQuery.toLowerCase();
    const receiptNumber = item.receiptNumber?.toLowerCase() || "";
    const receiverName =
      item.reciever?.name?.toLowerCase() ||
      item.receiver?.name?.toLowerCase() ||
      "";
    const paidAmount = item.totalPaidAmount?.toString() || "";
    const dateString = item.date
      ? new Date(item.date).toLocaleDateString()
      : "";
    return (
      receiptNumber.includes(q) ||
      receiverName.includes(q) ||
      paidAmount.includes(q) ||
      dateString.includes(q)
    );
  });

  // --- Table columns including action-menu export button ---
  const columns = [
    {
      title: "Receipt ID",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      sorter: (a, b) =>
        (a.receiptNumber || "").localeCompare(b.receiptNumber || ""),
      render: (text, record) => text || record._id || "N/A",
    },
    {
      title: "Recipient Name",
      dataIndex: ["reciever", "name"],
      key: "recipientName",
      sorter: (a, b) => {
        const nameA = a.reciever?.name || a.receiver?.name || "";
        const nameB = b.reciever?.name || b.receiver?.name || "";
        return nameA.localeCompare(nameB);
      },
      render: (_, record) =>
        record.reciever?.name || record.receiver?.name || "N/A",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => (a.discount || 0) - (b.discount || 0),
      render: (value, record) =>
        record.discountType === "percentage" ? (
          <Tag color="purple" className="text-xs">
            {value || 0}%
          </Tag>
        ) : (
          <Tag color="orange" className="text-xs">
            {value || 0} QR
          </Tag>
        ),
      width: 100,
      ellipsis: true,
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      key: "penalty",
      sorter: (a, b) => (a.penalty || 0) - (b.penalty || 0),
      render: (penalty) => <span style={{ color: "red" }}>{penalty || 0} QR</span>,
    },
    {
      title: "Paid Amount",
      dataIndex: "totalPaidAmount",
      key: "paidAmount",
      sorter: (a, b) => (a.totalPaidAmount || 0) - (b.totalPaidAmount || 0),
      render: (amount) => (amount ? `${amount} QR` : "N/A"),
    },
    {
      title: "Invoice Ref ID",
      dataIndex: "invoiceNumber.invoiceNumber",
      key: "invoiceNumber.invoiceNumber",
      sorter: (a, b) =>
        (a.invoiceNumber || "").toString().localeCompare((b.invoiceNumber || "").toString()),
      render: (invoiceNumber) => invoiceNumber || "N/A",
    },
    {
      title: "Status",
      dataIndex: "isCancel",
      key: "status",
      width: 100,
      sorter: (a, b) => (a.isCancel === b.isCancel ? 0 : a.isCancel ? 1 : -1),
      render: (isCancel) =>
        isCancel ? (
          <Tag color="red" className="text-xs">
            Cancelled
          </Tag>
        ) : (
          <Tag color="green" className="text-xs">
            Active
          </Tag>
        ),
    },
    {
      title: "Paid Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
          <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ];

  // --- Action menu including an export option ---
  const actionMenu = (record) => (
    <Menu>
      {/* 1) Preview -> PDF */}
      <Menu.Item key="1" onClick={() => handlePreview(record)}>
        <FilePdfOutlined /> Preview
      </Menu.Item>

      {/* 2) View (read-only) */}
      <Menu.Item key="2" onClick={() => handleViewReadOnlyReceipt(record)}>
        <EyeOutlined /> View (read-only)
      </Menu.Item>

      {/* 3) Cancel Receipt */}
      <Menu.Item
        key="3"
        onClick={() => {
          if (!record.isCancel) {
            setSelectedReceiptId(record._id);
            setModalVisible(true);
          }
        }}
        disabled={record.isCancel}
      >
        <Tooltip
          title={
            record.isCancel
              ? "This receipt is already canceled"
              : "Cancel this receipt"
          }
        >
          <span>
            <CloseCircleOutlined /> Cancel Receipt
          </span>
        </Tooltip>
      </Menu.Item>

      {/* 4) Send Mail */}
      <Menu.Item key="4" onClick={() => handleSendEmail(record)}>
        <MailOutlined /> Send Mail
      </Menu.Item>

      {/* 5) Export this record (optional individual export) */}
      <Menu.Item key="5" onClick={() => setExportModalOpen(true)}>
        <ExportOutlined /> Export
      </Menu.Item>
    </Menu>
  );

  // --- Render ---
  return (
    <Layout title={"Receipts List | Student Diwan"}>
      <AdminLayout>
        <div className="p-4 ">
          {/* Header / Search / Export / Add New */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Input
                prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                placeholder="Search Receipt"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px" }}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Global Export Button */}
              <button
                className="flex items-center px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-normal rounded-md hover:opacity-90 space-x-2"
                onClick={() => setExportModalOpen(true)}
              >
                <ExportOutlined className="text-sm" />
                <span>Export</span>
              </button>

              <ProtectedAction requiredPermission={PERMISSIONS.CREATE_NEW_RECEIPT}>
                <button
                  className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                  onClick={handleNavigate}
                >
                  <span className="text-gray-800 font-medium">Add New Receipt</span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FiUserPlus size={16} />
                  </div>
                </button>
              </ProtectedAction>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <Spinner />
            </div>
          ) : (
            <ProtectedSection
              requiredPermission={PERMISSIONS.VIEW_RECENT_RECEIPTS}
              title={"Receipts List"}
            >
              <Table
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={filteredData}
                expandable={{
                  expandedRowRender: (record) => (
                    <div>
                      <strong>Line Items:</strong>
                      {record.lineItems && record.lineItems.length > 0 ? (
                        <ul>
                          {record.lineItems.map((item, index) => (
                            <li key={index}>
                              {item.revenueType || item.name || "Item"}: {item.total || 0} QR
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No line items available</span>
                      )}
                    </div>
                  ),
                }}
                pagination={{
                  current: currentPage,
                  total: pagination.totalRecords,
                  pageSize: pageLimit,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  size: "small",
                  showTotal: (total) =>
                    `Page ${currentPage} of ${Math.ceil(
                      pagination.totalRecords / pageLimit
                    )} | Total ${total} records`,
                  onChange: (page) => setCurrentPage(page),
                  onShowSizeChange: (current, size) => {
                    setPageLimit(size);
                    setCurrentPage(1);
                  },
                }}
                size="small"
                bordered
              />
            </ProtectedSection>
          )}

          {/* Cancel Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            onConfirm={handleConfirmCancelReceipt}
            loading={cancelLoading}
            text="Cancel Receipt"
          />

          {/* Email Modal */}
          <EmailModal
            isOpen={isEmailModalOpen}
            onClose={() => setEmailModalOpen(false)}
            sendButtonText="Send Receipt"
            onSubmit={() => {
              console.log("Send Receipt Clicked");
              setEmailModalOpen(false);
            }}
          />
        </div>

        {/* Custom Export Modal */}
        <ExportModalNew
          visible={isExportModalOpen}
          onClose={() => setExportModalOpen(false)}
          dataToExport={transformReceiptData(receipts)}
          columns={[
            { header: "S.No", dataKey: "sNo" },
            { header: "Receipt ID", dataKey: "receiptNumber" },
            { header: "Recipient Name", dataKey: "receiver" },
            { header: "Discount", dataKey: "discount" },
            { header: "Penalty", dataKey: "penalty" },
            { header: "Paid Amount", dataKey: "totalPaidAmount" },
            { header: "Invoice Ref ID", dataKey: "refInvoiceNumber" },
            { header: "Status", dataKey: "cancelReceipt" },
            { header: "Paid Date", dataKey: "Date" },
            { header: "Academic Year", dataKey: "academicYearDetails" },
          ]}
          fileName="Receipts"
        />


        {/* Receipt Preview Overlay */}
        {isReceiptVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black bg-opacity-60"
              style={{ backdropFilter: "blur(8px)" }}
              onClick={() => setReceiptVisible(false)}
            />
            <div
              ref={popupRef}
              className="relative p-6 w-full max-w-[900px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end space-x-2 mb-4">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md hover:opacity-90"
                  onClick={() => handleDownloadPDF(pdfRef, selectedReceipt)}
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setReceiptVisible(false)}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                >
                  ✕
                </button>
              </div>
              <div className="receipt-container">
                {selectedReceipt ? (
                  <ReceiptTemplate data={selectedReceipt} ref={pdfRef} />
                ) : (
                  <p className="text-center text-gray-500">
                    No receipt data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </Layout>
  );
};

export default RecentReceiptsList;
