// RecentReceiptsList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown } from "antd";
import { MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
import { ShareAltOutlined } from "@ant-design/icons";
import EmailModal from "../../../../Components/Common/EmailModal";
import { useNavigate } from 'react-router-dom';
import { fetchAllReceipts } from "../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import Spinner from "../../../../Components/Common/Spinner"; // Ensure the path is correct

const RecentReceiptsList = () => {
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Added searchQuery state

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access receipts data from Redux state
    const { receipts = [], loading, error } = useSelector((state) => state.admin.receipts || {});

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const receiptsPerPage = 30;

    // Calculate total pages
    const totalReceipts = receipts.length;
    const totalPages = Math.ceil(totalReceipts / receiptsPerPage);

    // Fetch receipts on component mount if not already fetched
    useEffect(() => {
        if (totalReceipts === 0) { // Fetch only if no receipts are present
            dispatch(fetchAllReceipts());
        }
    }, [dispatch, totalReceipts]);

    // Handle Navigate to Add New Receipt
    const handleNavigate = () => {
        navigate('/finance/receipts/add-new-receipt');
    };

    // Handle Share Click
    const handleShareClick = () => {
        setEmailModalOpen(true);
    };

    // Close Email Modal
    const closeEmailModal = () => {
        setEmailModalOpen(false);
    };

    // Dropdown Menu for Action
    const actionMenu = (receiptId) => (
        <Menu>
            <Menu.Item key="1" onClick={() => navigate(`/finance/receipts/details/${receiptId}`)}>
                View Details
            </Menu.Item>
            <Menu.Item key="2">Send Reminder</Menu.Item>
        </Menu>
    );

    // Status Badge Component
    const StatusBadge = ({ status }) => {
        const styles = {
            Paid: { backgroundColor: "#DCFFE5", color: "#088728" },
            Unpaid: { backgroundColor: "#FFE6E5", color: "#E70F00" },
            Partial: { backgroundColor: "#FFF0E3", color: "#FF6E0D" },
            Overdue: { backgroundColor: "#FFE6E5", color: "#E53935" },
            Cancelled: { backgroundColor: "#FFE6E5", color: "#E70F00" }, // Added Cancelled status
        };
        return (
            <span
                className="px-3 py-2 rounded-lg text-sm font-semibold"
                style={styles[status] || { backgroundColor: "#E0E0E0", color: "#808080" }}
            >
                {status}
            </span>
        );
    };

    // Filter data based on search query
    const filteredData = receipts.filter(
        (item) =>
            item.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.reciever?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.receiver?.name?.toLowerCase().includes(searchQuery.toLowerCase())) || // Handle both 'reciever' and 'receiver'
            item.totalPaidAmount?.toString().includes(searchQuery.toLowerCase()) ||
            (item.date && new Date(item.date).toLocaleDateString().includes(searchQuery.toLowerCase()))
    );

    // Get current receipts for pagination
    const indexOfLastReceipt = currentPage * receiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
    const currentReceipts = filteredData.slice(indexOfFirstReceipt, indexOfLastReceipt);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Map Redux receipts to table data
    const mappedReceipts = currentReceipts.map(receipt => ({
        id: receipt.receiptNumber || receipt._id || "N/A",
        recipient: receipt.reciever?.name || receipt.receiver?.name || "N/A",
        class: receipt.className || "N/A",
        section: "N/A", // Assuming 'section' is not available in API data
        paidDate: receipt.date ? new Date(receipt.date).toLocaleDateString() : "N/A",
        amount: receipt.totalPaidAmount ? `${receipt.totalPaidAmount} QAR` : "N/A",
        status: receipt.isCancel ? "Cancelled" : "Paid", // Adjust based on available data
        _id: receipt._id, // Ensure _id is available for key and actions
    }));

    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-2">Recent Receipts List</h2>

                <div className="p-1 ">
                    {/* Filters and Buttons Section */}
                    <div className="flex justify-between items-start -mt-8">
                        {/* Filters */}
                        <div className="flex flex-col space-y-4">
                            <div className="mt-8 flex items-center space-x-4">
                                {/* Class Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Class</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                                        <option value="10">Ten</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                {/* Section Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Section</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                                        <option value="A">A</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                {/* Fees Type Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-36">
                                        <option value="Exam Fees">Exam Fees</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                            </div>

                            {/* Radio Buttons Row */}
                            <div className="flex space-x-6">
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-green-600" defaultChecked />
                                    <span className="text-green-600 font-medium">Everyone</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Paid</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Unpaid</span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center space-x-4 mt-12">
                            <button
                                className="flex items-center px-4 py-2 border rounded-lg text-gray-700 font-medium hover:shadow-md"
                                onClick={() => setSortModalVisible(true)}
                            >
                                Sort
                            </button>
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
                </div>

                {/* Receipts Table */}
                <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
                                <th className="py-3 px-4 font-medium">Receipt ID</th>
                                <th className="py-3 px-4 font-medium">Recipient Name</th>
                                <th className="py-3 px-4 font-medium">Class</th>
                                <th className="py-3 px-4 font-medium">Section</th>
                                <th className="py-3 px-4 font-medium">Paid Date</th>
                                <th className="py-3 px-4 font-medium">Paid Amount</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="py-4 px-4">
                                        <div className="flex justify-center items-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="py-4 px-4">
                                        <div className="flex justify-center items-center">
                                            <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#FF4D4F' }} />
                                            <span className="ml-2 text-red-500">Error: {error}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : mappedReceipts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-4 px-4">
                                        <div className="flex flex-col items-center">
                                            <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                                            <span className="mt-4 text-gray-500 text-lg">No Receipts Available</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mappedReceipts.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="py-4 px-4">{item.id}</td>
                                        <td className="py-4 px-4">{item.recipient}</td>
                                        <td className="py-4 px-4">{item.class}</td>
                                        <td className="py-4 px-4">{item.section}</td>
                                        <td className="py-4 px-4">{item.paidDate}</td>
                                        <td className="py-4 px-4">{item.amount}</td>
                                        <td className="py-4 px-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-4 px-4 flex items-center gap-4">
                                            <Dropdown overlay={() => actionMenu(item._id)} trigger={["click"]}>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                                    aria-label="Actions"
                                                >
                                                    <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                                                </button>
                                            </Dropdown>
                                            <button onClick={handleShareClick} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100" aria-label="Share">
                                                <ShareAltOutlined style={{ fontSize: "16px", color: "purple" }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination and Showing Info */}
                {!loading && !error && (
                    <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
                        <span>
                            Showing {currentReceipts.length} receipts out of {totalReceipts} receipts
                        </span>
                        {totalPages > 1 && (
                            <div className="flex gap-2">
                                <button
                                    className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    « Back
                                </button>
                                {pageNumbers.map(number => (
                                    <button
                                        key={number}
                                        className={`px-3 py-1 rounded ${currentPage === number ? "bg-purple-500 text-white" : "bg-white hover:bg-gray-100"}`}
                                        onClick={() => handlePageChange(number)}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next »
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Modals */}
                <EmailModal
                    isOpen={isEmailModalOpen}
                    onClose={closeEmailModal}
                    sendButtonText="Send Receipt"
                    onSubmit={() => {
                        console.log("Send Receipt Clicked");
                        closeEmailModal();
                    }}
                />

                {/* Sort Modal (Assuming it's implemented elsewhere) */}
                {isSortModalVisible && (
                    // Your Sort Modal component here
                    <div>
                        {/* Sort Modal Content */}
                    </div>
                )}
            </div>
        </AdminLayout>
    );

};

export default RecentReceiptsList;
