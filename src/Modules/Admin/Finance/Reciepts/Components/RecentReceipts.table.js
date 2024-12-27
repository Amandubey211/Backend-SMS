import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Input, Dropdown, Menu } from "antd";
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
import Receipt from "./Receipt";

const RecentReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receipts = [], loading, error } = useSelector(
    (state) => state.admin.receipts || {}
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

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
      dispatch(fetchAllReceipts());
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
  // Cancel the selected receipt
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

  // Show the receipt preview popup
  const handlePreview = (record) => {
    setSelectedReceipt(record);
    setReceiptVisible(true);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!selectedReceipt) return;
    try {
      const pdfTitle = selectedReceipt.receiptNumber
        ? `${selectedReceipt.receiptNumber}.pdf`
        : "receipt.pdf";

      // Use html2canvas to capture the modal content
      const canvas = await html2canvas(popupRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF instance
      const pdf = new jsPDF("p", "pt", "a4"); // 'p'=portrait, 'pt'=points, 'a4'=page format
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate aspect ratio to fit the image into the PDF
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

  // Print the receipt (native browser print)
  const handlePrint = () => {
    if (!selectedReceipt) return;
    // Option A: Print the entire screen
    // window.print();

    // Option B: Print only the modal content
    // We'll create a new window, write the popupRef content inside it, then print
    const printWindow = window.open("", "PRINT", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Receipt</title>");
      printWindow.document.write("</head><body>");
      printWindow.document.write(popupRef.current.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // -------------------- Table & Data --------------------
  const filteredData = receipts.filter((item) => {
    const receiptNumber = item.receiptNumber?.toLowerCase() || "";
    const receiverName =
      item.reciever?.name?.toLowerCase() || item.receiver?.name?.toLowerCase() || "";
    const paidAmount = item.totalPaidAmount?.toString() || "";
    const dateString = item.date ? new Date(item.date).toLocaleDateString() : "";

    return (
      receiptNumber.includes(searchQuery.toLowerCase()) ||
      receiverName.includes(searchQuery.toLowerCase()) ||
      paidAmount.includes(searchQuery.toLowerCase()) ||
      dateString.includes(searchQuery.toLowerCase())
    );
  });

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
      title: "Paid Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Paid Amount",
      dataIndex: "totalPaidAmount",
      key: "paidAmount",
      sorter: (a, b) => (a.totalPaidAmount || 0) - (b.totalPaidAmount || 0),
      render: (amount) => (amount ? `${amount} QAR` : "N/A"),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      sorter: (a, b) => (a.tax || 0) - (b.tax || 0),
      render: (tax) => `${tax || 0} QAR`,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => (a.discount || 0) - (b.discount || 0),
      render: (discount) => `${discount || 0} QAR`,
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      key: "penalty",
      sorter: (a, b) => (a.penalty || 0) - (b.penalty || 0),
      render: (penalty) => `${penalty || 0} QAR`,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      sorter: (a, b) => (a.remark || "").localeCompare(b.remark || ""),
      render: (remark) => remark || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handlePreview(record)}>Preview</Menu.Item>
              <Menu.Item
                onClick={() => {
                  setSelectedReceiptId(record._id);
                  setModalVisible(true);
                }}
              >
                Cancel Receipt
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ];

  // -------------------- Loading / Error States --------------------
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "#FF4D4F", marginTop: "16px" }}>
        <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
        <p>Unable to fetch the receipts.</p>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#999", marginTop: "16px" }}>
        <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
        <p>No receipts available.</p>
      </div>
    );
  }

  // -------------------- Render --------------------
  return (
    <div
      style={{
        border: "2px solid #FFCEDB",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
          Recent Receipts List
        </h2>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "250px" }}
          />
          <button
            onClick={() => navigate("/finance/receipts/receipt-list")}
            className="px-4 py-2 rounded-md border border-gray-400 shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-200 text-transparent bg-gradient-text bg-clip-text"
          >
            View More
          </button>
        </div>
      </div>

      {/* The Receipts Table */}
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
                      {item.revenueType}: {item.total} QAR (Qty: {item.quantity})
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
          pageSize: 5,
          showSizeChanger: true,
          position: ["bottomRight"],
        }}
      />

      {/* Cancel Receipt Confirmation Modal (unchanged) */}
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

                {/* Print */}
                {/* <button
                  className="w-40 py-2 text-white font-semibold rounded-md"
                  style={{
                    background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)",
                  }}
                  onClick={handlePrint}
                >
                  Print Receipt
                </button> */}
                {/*
                  If you want an email send button, you can add it here
                */}
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
