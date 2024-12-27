import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Input, Table } from "antd";
import {
    MoreOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    FilePdfOutlined,
    MailOutlined
} from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
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

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ExportModal if you have it:
import ExportModal from "./Components/ExportModal";

// If you have a "Receipt" component for the preview
import Receipt from "./Components/Receipt"; // Adjust path if needed

const RecentReceiptsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { receipts = [], loading, error } = useSelector(
        (state) => state.admin.receipts || {}
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

    // Ref for outside-click detection & PDF generation
    const popupRef = useRef(null);

    // --- 1) Fetch receipts if empty ---
    useEffect(() => {
        if (receipts.length === 0) {
            dispatch(fetchAllReceipts());
        }
    }, [dispatch, receipts.length]);

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
            dispatch(fetchAllReceipts());
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

    // --- View in read-only mode (navigates to CreateReceipt but with record data) ---
    const handleViewReadOnlyReceipt = (record) => {
        // Navigate with state
        navigate("/finance/receipts/add-new-receipt", {
            state: {
                readOnly: true,
                receiptData: record,
            },
        });
    };

    // --- Delete receipt ---
    const handleDeleteReceipt = async (record) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this receipt?");
        if (!confirmDelete) return;

        try {
            const result = await dispatch(deleteReceipt(record._id));
            if (result.payload === "Receipt Deleted successfully") {
                toast.success("Receipt deleted successfully!");
                dispatch(fetchAllReceipts());
            } else {
                toast.error("Failed to delete receipt.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while deleting the receipt.");
        }
    };

    // --- Download PDF from preview ---
    const handleDownloadPDF = async () => {
        try {
            if (!selectedReceipt) return;

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
            console.error("Error generating PDF: ", error);
            toast.error("Failed to generate PDF.");
        }
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
        "Recipient Name":
            item.reciever?.name || item.receiver?.name || "N/A",
        "Paid Date": item.date ? new Date(item.date).toLocaleDateString() : "N/A",
        "Paid Amount": item.totalPaidAmount ? `${item.totalPaidAmount} QAR` : "N/A",
        "Tax": `${item.tax || 0} QAR`,
        "Discount": `${item.discount || 0} QAR`,
        "Penalty": `${item.penalty || 0} QAR`,
        "Remark": item.remark || "N/A",
    }));

    // --- 3-Dots Action Menu ---
    const actionMenu = (record) => (
        <Menu>
            {/* 1) Preview -> PDF */}
            <Menu.Item key="1" onClick={() => handlePreview(record)}>
                <FilePdfOutlined /> Preview
            </Menu.Item>

            {/* 2) View (read-only) -> opens the same CreateReceipt but readOnly */}
            <Menu.Item key="2" onClick={() => handleViewReadOnlyReceipt(record)}>
                <FilePdfOutlined /> View (read-only)
            </Menu.Item>

            {/* 3) Cancel Receipt */}
            <Menu.Item
                key="3"
                onClick={() => {
                    setSelectedReceiptId(record._id);
                    setModalVisible(true);
                }}
            >
                <CloseCircleOutlined /> Cancel Receipt
            </Menu.Item>

            {/* 4) Send Mail (just a toast for now) */}
            <Menu.Item key="4" onClick={() => toast.success("Send Mail clicked!")}>
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
        const dateString = item.date ? new Date(item.date).toLocaleDateString() : "";

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
                <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
                    <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
                </Dropdown>
            ),
        },
    ];

    // Loading / Error UI
    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: "center", padding: "16px" }}>
                    <Spinner />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div
                    style={{ textAlign: "center", color: "#FF4D4F", marginTop: "16px" }}
                >
                    <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
                    <p>Unable to fetch the receipts.</p>
                </div>
            </AdminLayout>
        );
    }

    // Render
    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header / Search / Export / Add New */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold">Recent Receipts List</h2>
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
                            className="flex items-center px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-normal rounded-md hover:opacity-90"
                            onClick={() => setExportModalOpen(true)}
                        >
                            Export
                        </button>
                        <button
                            className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                            onClick={handleNavigate}
                        >
                            <span className="text-gray-800 font-medium">Add New Receipt</span>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                <FiUserPlus size={16} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Table */}
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
                                                {item.revenueType || item.name || "Item"}: {item.total || 0} QAR
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
                        pageSize: 10,
                        showSizeChanger: true,
                        position: ["bottomRight"],
                    }}
                />

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
                dataToExport={exportData}
                title="Receipts_Report"
                sheet="ReceiptsSheet"
            />

            {/* Receipt Preview Overlay */}
            {isReceiptVisible && (
                <div className="fixed inset-0 z-50">
                    {/* Dim / Blur background */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-60"
                        style={{ backdropFilter: "blur(8px)" }}
                    />
                    {/* Centered content */}
                    <div className="relative flex items-center justify-center w-full h-full">
                        <div
                            ref={popupRef}
                            className="relative p-6 w-full max-w-[700px] max-h-[90vh] bg-white rounded-md shadow-md"
                        >
                            {/* Close + Download PDF buttons */}
                            <div className="absolute -top-4 -right-44 mt-4 flex flex-col items-start space-y-2">
                                {/* Close button */}
                                <button
                                    onClick={() => setReceiptVisible(false)}
                                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                                >
                                    ✕
                                </button>
                                {/* Download PDF button */}
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

                            {/* The actual receipt content */}
                            <Receipt receiptData={selectedReceipt} />
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default RecentReceiptsList;
