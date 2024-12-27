// RecentReceiptsList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown, Input, Table, Button } from "antd";
import { MoreOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
import { ShareAltOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { fetchAllReceipts, cancelReceipt } from "../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import Spinner from "../../../../Components/Common/Spinner"; // Ensure the path is correct
import DeleteConfirmationModal from "../../../../Components/Common/DeleteConfirmationModal"; // Ensure the path is correct
import EmailModal from "../../../../Components/Common/EmailModal";

const RecentReceiptsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { receipts = [], loading, error } = useSelector((state) => state.admin.receipts || {});
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReceiptId, setSelectedReceiptId] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);

    useEffect(() => {
        if (receipts.length === 0) { // Fetch only if no receipts are present
            dispatch(fetchAllReceipts());
        }
    }, [dispatch, receipts.length]);

    const handleNavigate = () => {
        navigate('/finance/receipts/add-new-receipt');
    };

    const handleShareClick = () => {
        setEmailModalOpen(true);
    };

    const closeEmailModal = () => {
        setEmailModalOpen(false);
    };

    const handleCancelReceipt = async () => {
        setCancelLoading(true);
        const result = await dispatch(cancelReceipt(selectedReceiptId));
        console.log(result);
        if (result.payload === "Receipt cancel successfully") {
            toast.success("Receipt canceled successfully!");
            dispatch(fetchAllReceipts());
        } else {
            toast.error("Failed to cancel receipt.");
        }
        setCancelLoading(false);
        setModalVisible(false);
    };

    const actionMenu = (record) => (
        <Menu>
            <Menu.Item key="1" onClick={() => navigate(`/finance/receipts/details/${record._id}`)}>
                Preview
            </Menu.Item>
            <Menu.Item
                key="2"
                onClick={() => {
                    setSelectedReceiptId(record._id);
                    setModalVisible(true);
                }}
            >
                Cancel Receipt
            </Menu.Item>
        </Menu>
    );

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
            sorter: (a, b) => (a.receiptNumber || "").localeCompare(b.receiptNumber || ""),
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
            render: (_, record) => record.reciever?.name || record.receiver?.name || "N/A",
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
                <div style={{ textAlign: "center", color: "#FF4D4F", marginTop: "16px" }}>
                    <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
                    <p>Unable to fetch the receipts.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4">Recent Receipts List</h2>

                {/* Top Section: Search, Export, Add New Receipt */}
                <div className="flex justify-between items-center mb-4">
                    <Input
                        prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                        placeholder="Search Receipt"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "250px" }}
                    />
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90"
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

                {/* Receipts Table */}
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
                                                {item.name}: {item.amount} QAR
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

                {/* Modals */}
                <DeleteConfirmationModal
                    isOpen={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleCancelReceipt}
                    loading={cancelLoading}
                    text="Cancel Receipt"
                />

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
        </AdminLayout>
    );
};

export default RecentReceiptsList;
