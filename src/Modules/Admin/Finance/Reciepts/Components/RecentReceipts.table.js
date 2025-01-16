import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Input, Dropdown, Tag } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../../../../../Components/Common/DeleteConfirmationModal";
import Spinner from "../../../../../Components/Common/Spinner";
import {
  fetchAllReceipts,
  cancelReceipt,
} from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";

// Import jsPDF and html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Your renamed Receipt component
import Receipt from "../../../../../Utils/FinanceTemplate/Receipt";

const RecentReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receipts = [], loading, error, pagination = {} } = useSelector(
    (state) => state.admin.receipts || {}
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [fetching, setFetching] = useState(true);
  // For canceling a receipt
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // For previewing a receipt in a custom modal
  const [isReceiptVisible, setReceiptVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Detect outside clicks to close the popup
  const popupRef = useRef(null);

  // -------------------- Lifecycle --------------------
  useEffect(() => {
    if (!dataFetched) {
      setFetching(true); // Start fetching
      dispatch(fetchAllReceipts({ limit: 5, fetchLatest: true }))
        .unwrap()
        .then(() => setFetching(false)) // Mark fetching as complete
        .catch(() => setFetching(false));
      setDataFetched(true);
    }
  }, [dispatch, dataFetched]);

  // Close modal if user clicks outside the popup
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

  // -------------------- Handlers --------------------
  const handleCancelReceipt = async () => {
    setCancelLoading(true);
    const result = await dispatch(cancelReceipt(selectedReceiptId));
    if (result.payload === "Receipt cancel successfully") {
      toast.success("Receipt canceled successfully!");
      dispatch(fetchAllReceipts());
    } else {
      toast.error("Failed to cancel receipt.");
    }
    setCancelLoading(false);
    setModalVisible(false);
  };

  const handlePreview = (record) => {
    setSelectedReceipt(record);
    setReceiptVisible(true);
  };

  // NEW: View (Read-Only) mode
  const handleViewReadOnly = (record) => {
    navigate("/finance/receipts/add-new-receipt", {
      state: {
        readOnly: true,
        receiptData: record,
      },
    });
  };

  const handleDownloadPDF = async () => {
    if (!selectedReceipt) return;
    try {
      const pdfTitle = selectedReceipt.receiptNumber
        ? `${selectedReceipt.receiptNumber}.pdf`
        : "receipt.pdf";

      const canvas = await html2canvas(popupRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);
      pdf.save(pdfTitle);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  // -------------------- Table & Data --------------------
  const filteredData = receipts
    .filter((item) => {
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
        receiptNumber.includes(searchQuery.toLowerCase()) ||
        receiverName.includes(searchQuery.toLowerCase()) ||
        paidAmount.includes(searchQuery.toLowerCase()) ||
        dateString.includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (latest first)


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
      render: (penalty) =>
        <span style={{ color: "red" }}>
          {penalty || 0} QR
        </span>
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
        (a.invoiceNumber?.invoiceNumber || "").localeCompare(
          b.invoiceNumber?.invoiceNumber || ""
        ),
      render: (invoiceNumber) => invoiceNumber?.invoiceNumber || "N/A",
    },
    {
      title: "Status",
      dataIndex: "isCancel",
      key: "status",
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
      sorter: (a, b) => a.isCancel - b.isCancel,
    },
    {
      title: "Paid Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      render: (date) =>
        date
          ? new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(date))
          : "N/A",
    },
    // Action Column (Uncomment and customize if needed)
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Dropdown
    //       overlay={
    //         <Menu>
    //           {/* 1) Preview in a popup */}
    //           <Menu.Item onClick={() => handlePreview(record)}>Preview</Menu.Item>
    //
    //           {/* 2) View as read-only in CreateReceipt */}
    //           <Menu.Item onClick={() => handleViewReadOnly(record)}>
    //             View (Read-Only)
    //           </Menu.Item>
    //
    //           {/* 3) Cancel Receipt */}
    //           <Menu.Item
    //             onClick={() => {
    //               setSelectedReceiptId(record._id);
    //               setModalVisible(true);
    //             }}
    //           >
    //             Cancel Receipt
    //           </Menu.Item>
    //         </Menu>
    //       }
    //       trigger={["click"]}
    //     >
    //       <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
    //     </Dropdown>
    //   ),
    // },
  ];

  // -------------------- Render --------------------
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        {/* Title with counts */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
          Recent Receipts List ({receipts.length}/{pagination.totalRecords || 0})
        </h2>

        {/* View More Button with counts */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/finance/receipts/receipt-list")}
            className="px-3 py-1 rounded-md border border-gray-400 shadow-md hover:shadow-md hover:shadow-gray-300 transition duration-200 text-white bg-gradient-to-r from-pink-500 to-purple-500"
          >
            View More ({pagination.totalRecords || 0})
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {fetching || loading ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <Spinner />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#FF4D4F", marginTop: "16px" }}>
          <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
          <p>Unable to fetch the receipts.</p>
        </div>
      ) : (
        // The Receipts Table with Custom No Data
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
                        {item.revenueType}: {item.total} QR (Qty: {item.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No line items available</span>
                )}
              </div>
            ),
          }}
          size="small"
          pagination={false} // Disable Ant Design pagination

        />
      )}

      {/* Cancel Receipt Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleCancelReceipt}
        loading={cancelLoading}
        text="Cancel Receipt"
      />

      {/* ===================== Custom Overlay for Previewing a Receipt ===================== */}
      {isReceiptVisible && (
        <div className="fixed inset-0 z-50">
          {/* Background (Dim + Blur) */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            style={{ backdropFilter: "blur(8px)" }}
          />

          {/* Foreground: Centered Content */}
          <div className="relative flex items-center justify-center w-full h-full">
            <div
              ref={popupRef}
              className="relative p-6 w-full max-w-[700px] max-h-[90vh] bg-white rounded-md shadow-md"
            >
              {/* Top-Right Buttons */}
              <div
                className="absolute -top-4 -right-44 mt-4 flex flex-col items-start space-y-2"
              >
                {/* Close Button */}
                <button
                  onClick={() => setReceiptVisible(false)}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                >
                  ✕
                </button>

                {/* Download PDF */}
                <button
                  className="w-40 py-2 text-white font-semibold rounded-md"
                  style={{
                    background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)",
                  }}
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </button>

              </div>

              {/* Receipt Component */}
              <Receipt receiptData={selectedReceipt} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentReceipts;
