import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Input, Table, Tag, Tooltip} from "antd";
import {
    MoreOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    FilePdfOutlined,
    MailOutlined,
    EyeOutlined
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
import { ExportOutlined } from "@ant-design/icons";

// ExportModal if you have it:
import ExportModal from "./Components/ExportModal";

// If you have a "Receipt" component for the preview
import Receipt from "./Components/Receipt"; // Adjust path if needed

const RecentReceiptsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { receipts = [], loading, error, pagination = {} } = useSelector(
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

    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);


    // Ref for outside-click detection & PDF generation
    const popupRef = useRef(null);

    // --- 1) Fetch receipts if empty ---
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
            // Pass the currentPage and pageLimit when fetching receipts
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
                // Pass the currentPage and pageLimit when fetching receipts
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
        "Paid Amount": item.totalPaidAmount ? `${item.totalPaidAmount} QR` : "N/A",
        "Tax": `${item.tax || 0} QR`,
        "Discount": `${item.discount || 0} QR`,
        "Penalty": `${item.penalty || 0} QR`,
        "Remark": item.remark || "N/A",
    }));

    // --- 3-Dots Action Menu ---
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
    disabled={record.isCancel} // Disable the option if the receipt is already canceled
>
    <Tooltip
        title={record.isCancel ? "This receipt is already canceled" : "Cancel this receipt"}
    >
        <span>
            <CloseCircleOutlined /> Cancel Receipt
        </span>
    </Tooltip>
</Menu.Item>


            {/* 4) Send Mail */}
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
            title: "Tax",
            dataIndex: "tax",
            key: "tax",
            sorter: (a, b) => (a.tax || 0) - (b.tax || 0),
            render: (tax) => (
                <Tag color="red" className="text-xs">
                    {tax || 0} QAR
                </Tag>
            ),
            width: 100,
            ellipsis: true,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            sorter: (a, b) => (a.discount || 0) - (b.discount || 0), // Optional: Preserve sorting
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
            ,
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
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
                    <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
                </Dropdown>
            ),
        },
    ];

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
                            className="flex items-center px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-normal rounded-md hover:opacity-90 space-x-2"
                            onClick={() => setExportModalOpen(true)}
                        >
                            <ExportOutlined className="text-sm" /> {/* Export Icon */}
                            <span>Export</span> {/* Button text */}
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
                {loading ? (
                    <div style={{ textAlign: "center", padding: "16px" }}>
                        <Spinner />
                    </div>
                ) : error ? (
                    <div style={{ textAlign: "center", color: "#FF4D4F", marginTop: "16px" }}>
                        <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
                        <p>Unable to fetch the receipts.</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#999", marginTop: "16px" }}>
                        <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
                        <p>No receipts available.</p>
                    </div>
                ) : (
                    // Render Table and Custom Pagination
                    <>

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
                                current: currentPage, // Use state
                                total: pagination.totalRecords, // Total records from API response
                                pageSize: pageLimit, // Use state for limit
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "20", "50"],
                                size: "small",
                                showTotal: (total) =>
                                    `Page ${currentPage} of ${Math.ceil(pagination.totalRecords / pageLimit)} | Total ${total} records`,
                                onChange: (page) => {
                                    setCurrentPage(page); // Update currentPage state
                                },
                                onShowSizeChange: (current, size) => {
                                    setPageLimit(size); // Update pageLimit state
                                    setCurrentPage(1); // Reset to the first page
                                },
                            }}
                            summary={() => {
                                let totalPaidAmount = 0;
                                let totalTax = 0;
                                let totalDiscount = 0;
                                let totalPenalty = 0;

                                // Calculate totals from filteredData
                                filteredData.forEach((record) => {
                                    totalPaidAmount += record.totalPaidAmount || 0;
                                    totalTax += record.tax || 0;
                                    totalDiscount += record.discount || 0;
                                    totalPenalty += record.penalty || 0;
                                });

                                return (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <strong>Totals:</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <strong>{totalPaidAmount.toLocaleString()} QR</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}>
                                            <strong>{totalTax.toLocaleString()} QR</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}>
                                            <strong>{totalDiscount.toLocaleString()}%</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4}>
                                            <strong>{totalPenalty.toLocaleString()} QR</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5} />
                                    </Table.Summary.Row>
                                );
                            }}
                            size="small"
                            bordered
                        />
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
