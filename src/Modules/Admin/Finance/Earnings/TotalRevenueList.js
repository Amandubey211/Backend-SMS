import React, { useState } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import DeleteModal from "./Components/DeleteModal";
import EditTotalRevenueSidebar from "./Components/EditTotalRevenueSidebar";
import ExportModal from "./Components/ExportModal";
import FilterRevenueModal from "./Components/FilterRevenueModal";
import SortRevenueModal from "./Components/SortRevenueModal";
import BulkEntriesModal from "./Components/BulkEntriesModal";

const TotalRevenueList = () => {
    const [searchText, setSearchText] = useState("");
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [isBulkEntriesModalVisible, setIsBulkEntriesModalVisible] = useState(false); // Bulk Modal State

    const navigate = useNavigate();

    const dataSource = [
        { key: "1", category: "Donation For School", from: "Esther Howard", earnedDate: "May 12, 2024", amount: "1500 QR" },
        { key: "2", category: "Tuition Fees", from: "Albert Flores", earnedDate: "May 11, 2024", amount: "3000 QR" },
        { key: "3", category: "Hostel Fees", from: "Darlene Robertson", earnedDate: "May 10, 2024", amount: "2000 QR" },
    ];

    const columns = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            sorter: (a, b) => a.category.localeCompare(b.category),
            filteredValue: [searchText],
            onFilter: (value, record) => record.category.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "From",
            dataIndex: "from",
            key: "from",
            sorter: (a, b) => a.from.localeCompare(b.from),
            filteredValue: [searchText],
            onFilter: (value, record) => record.from.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Earned Date",
            dataIndex: "earnedDate",
            key: "earnedDate",
            sorter: (a, b) => new Date(a.earnedDate) - new Date(b.earnedDate),
            filteredValue: [searchText],
            onFilter: (value, record) => record.earnedDate.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            sorter: (a, b) =>
                parseFloat(a.amount.replace(" QR", "")) - parseFloat(b.amount.replace(" QR", "")),
            filteredValue: [searchText],
            onFilter: (value, record) => record.amount.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div>
                    <span
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => setIsSidebarVisible(true)}
                    >
                        Edit
                    </span>
                    <span
                        className="ml-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => setIsDeleteModalVisible(true)}
                    >
                        Delete
                    </span>
                </div>
            ),
        },
    ];

    const handleSearch = (e) => setSearchText(e.target.value);

    return (
        <AdminLayout>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <div
                        className="cursor-pointer text-purple-600 hover:underline"
                        onClick={() => navigate(-1)}
                    >
                        ← Total Revenue List
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            className="px-4 py-2 border-2 rounded-md hover:shadow-lg"
                            style={{
                                background: "white",
                                borderImageSource: "linear-gradient(to right, #C83B62, #46138A)",
                                borderImageSlice: 1,
                            }}
                            onClick={() => setIsSortModalVisible(true)}
                        >
                            Sort
                        </Button>
                        <Button
                            className="px-4 py-2 border-2 rounded-md hover:shadow-lg"
                            style={{
                                background: "white",
                                borderImageSource: "linear-gradient(to right, #C83B62, #46138A)",
                                borderImageSlice: 1,
                            }}
                            onClick={() => setIsFilterModalVisible(true)}
                        >
                            Filter
                        </Button>
                        <Input
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            className="w-64"
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <Button
                            type="primary"
                            icon={<ExportOutlined />}
                            onClick={() => setIsExportModalVisible(true)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 border-none hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition duration-200"
                        >
                            Export
                        </Button>
                        <Button
                            className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-lg hover:opacity-90 transition"
                            onClick={() => setIsBulkEntriesModalVisible(true)} // Open Bulk Modal
                        >
                            Bulk Entries
                        </Button>
                    </div>
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 20 }}
                    className="rounded-lg shadow"
                />
                <DeleteModal visible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)} />
                <EditTotalRevenueSidebar visible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
                <ExportModal visible={isExportModalVisible} onClose={() => setIsExportModalVisible(false)} />
                <FilterRevenueModal visible={isFilterModalVisible} onClose={() => setIsFilterModalVisible(false)} />
                <SortRevenueModal visible={isSortModalVisible} onClose={() => setIsSortModalVisible(false)} onSortChange={(sort) => console.log(sort)} />
                <BulkEntriesModal
                    visible={isBulkEntriesModalVisible}
                    onClose={() => setIsBulkEntriesModalVisible(false)} // Close Modal
                />
            </div>
        </AdminLayout>
    );
};

export default TotalRevenueList;
