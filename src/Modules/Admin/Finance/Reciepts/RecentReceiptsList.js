// src/Modules/Admin/Finance/Receipts/RecentReceiptsList.js

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Input, Table, Tag, Tooltip } from "antd";
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
import html2canvas from "html2canvas";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ReceiptTemplate from "../../../../Utils/FinanceTemplate/Receipt";
import ExportModal from "../Earnings/Components/ExportModal";
import { formatDate } from "../../../../Utils/helperFunctions";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { downloadPDF } from "../../../../Utils/xl";
import { sendEmail } from "../../../../Store/Slices/Common/SendPDFEmail/sendEmailThunk";

const RecentReceiptsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useNavHeading("Finance", "Receipts List");

  const { receipts = [], loading, error, pagination = {} } = useSelector(
    (state) => state.admin.receipts || {}
  );

  // Email sending state from common slice (if needed)
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

  // Export modal states
  const [isExportModalOpen, setExportModalOpen] = useState(false);

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
      // Fetch receipts again to update the list
      dispatch(fetchAllReceipts({ page: currentPage, limit: pageLimit }));
    } else {
      toast.error("Failed to cancel receipt.");
    }
    setCancelLoading(false);
    setModalVisible(false);
  };

  // --- Preview Receipt (opens modal) ---
  const handlePreview = (record) => {
    setSelectedReceipt(record);
    setReceiptVisible(true);
  };

  // --- View in read-only mode (navigates to CreateReceipt with record data) ---
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
      // Start a loading toast notification
      const toastId = toast.loading("Sending email...");

      const type = record.isCancel ? "cancelReceipt" : "receipt";

      // Format the date properly
      const formattedDate = formatDate(record.date, "long");

      // Construct the payload for sending email
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
        invoiceNumber: record.invoiceNumber?.invoiceNumber || "N/A",
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

      // Dismiss the loading toast
      toast.dismiss(toastId);

      console.log("sendEmail result:", result);
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
        // Fetch receipts again to update the list
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

  // --- Navigate to Add New Receipt Page (normal create) ---
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
  const exportData = receipts.map((item) => ({
    "Receipt ID": item.receiptNumber || item._id || "N/A",
    "Recipient Name": item.reciever?.name || item.receiver?.name || "N/A",
    "Paid Date": item.date
      ? new Date(item.date).toLocaleDateString("en-GB")
      : "N/A",
    "Paid Amount": item.totalPaidAmount ? `${item.totalPaidAmount} QR` : "N/A",
    Discount:
      item.discountType === "percentage"
        ? `${item.discount || 0}%`
        : `${item.discount || 0} QR`,
    Penalty: `${item.penalty || 0} QR`,
    Status: item.isCancel ? "Cancelled" : "Active",
    Remark: item.remark || "N/A",
  }));

  const transformReceiptData = (receipts) =>
    receipts?.map(({ _id, ...receipt }, index) => ({
      sNo: index + 1,
      receiptNumber: receipt?.receiptNumber || "N/A",
      refInvoiceNumber: receipt?.invoiceNumber || "N/A",
      receiver: receipt?.receiver?.name || "N/A",
      receiverEmail: receipt?.receiver?.email || "N/A",
      receiverPhone: receipt?.receiver?.phone || "N/A",
      receiverAddress: receipt?.receiver?.address || "N/A",
      tax: `${parseFloat(receipt?.tax)} %` || 0,
      discount:
        receipt?.discountType === "percentage"
          ? `${parseFloat(receipt?.discount)} %`
          : `${parseFloat(receipt?.discount)} QR` || 0,
      discountType: receipt?.discountType || "percentage",
      penalty: `${parseFloat(receipt?.penalty)} QR` || 0,
      totalPaidAmount: `${parseFloat(receipt?.totalPaidAmount)} QR` || 0,
      cancelReceipt: receipt?.isCancel ? "Yes" : "No",
      Date: receipt?.date || "N/A",
      academicYearDetails: receipt?.academicYear?.year || "N/A",
    })) || [];

  // --- 3-Dots Action Menu ---
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
    </Menu>
  );

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

  // --- Table columns ---
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
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      sorter: (a, b) =>
        (a.invoiceNumber || "").localeCompare(b.invoiceNumber || ""),
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

  // --- Render ---
  return (
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
          <>
            {/* Table */}
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
                              {item.revenueType || item.name || "Item"}:{" "}
                              {item.total || 0} QR
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
                  onChange: (page) => {
                    setCurrentPage(page);
                  },
                  onShowSizeChange: (current, size) => {
                    setPageLimit(size);
                    setCurrentPage(1);
                  },
                }}
                summary={() => {
                  let totalPaidAmount = 0;
                  let totalTax = 0;
                  let totalDiscount = 0;
                  let totalPenalty = 0;

                  filteredData.forEach((record) => {
                    totalPaidAmount += parseFloat(record.totalPaidAmount) || 0;
                    totalTax += parseFloat(record.tax) || 0;
                    totalDiscount += parseFloat(record.discount) || 0;
                    totalPenalty += parseFloat(record.penalty) || 0;
                  });
                }}
                size="small"
                bordered
              />
            </ProtectedSection>
          </>
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
          onClose={closeEmailModal}
          sendButtonText="Send Receipt"
          onSubmit={() => {
            console.log("Send Receipt Clicked");
            closeEmailModal();
          }}
        />
      </div>

      {/* Export Modal */}
      <ExportModal
        visible={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        dataToExport={transformReceiptData(receipts)}
        title="ReceiptsData"
        sheet="Receipts_report"
      />

      {/* Receipt Preview Overlay */}
      {isReceiptVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dim / Blur background */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            style={{ backdropFilter: "blur(8px)" }}
            onClick={() => setReceiptVisible(false)}
          />
          {/* Centered content */}
          <div
            ref={popupRef}
            className="relative p-6 w-full max-w-[900px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close + Download PDF buttons */}
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

            {/* Receipt content container */}
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
  );
};

export default RecentReceiptsList;
