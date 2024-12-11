import React, { useState } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";


const TotalRevenueList = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    // Table data source
    const dataSource = [
        {
            key: "1",
            category: "Donation For School",
            from: "Esther Howard",
            earnedDate: "May 12, 2024",
            amount: "1500 QR",
        },
        {
            key: "2",
            category: "Tuition Fees",
            from: "Albert Flores",
            earnedDate: "May 11, 2024",
            amount: "3000 QR",
        },
        {
            key: "3",
            category: "Hostel Fees",
            from: "Darlene Robertson",
            earnedDate: "May 10, 2024",
            amount: "2000 QR",
        },
        // Add more rows as needed
    ];

    // Table columns with sorting and search
    const columns = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            sorter: (a, b) => a.category.localeCompare(b.category), // String sorting
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.category.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "From",
            dataIndex: "from",
            key: "from",
            sorter: (a, b) => a.from.localeCompare(b.from), // String sorting
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.from.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Earned Date",
            dataIndex: "earnedDate",
            key: "earnedDate",
            sorter: (a, b) => new Date(a.earnedDate) - new Date(b.earnedDate), // Date sorting
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.earnedDate.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            sorter: (a, b) =>
                parseFloat(a.amount.replace(" QR", "")) -
                parseFloat(b.amount.replace(" QR", "")), // Numeric sorting
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.amount.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <span className="cursor-pointer text-gray-500 hover:text-gray-700">
                    ...
                </span>
            ),
        },
    ];

    // Handle search input
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Handle Export
    const handleExport = () => {
        // Simulate export functionality
        console.log("Exporting data...");
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-4">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    {/* Back Button */}
                    <div
                        className="cursor-pointer text-purple-600 hover:underline"
                        onClick={() => navigate(-1)} // Navigate back
                    >
                        ← Total Revenue List
                    </div>

                    {/* Search and Export Buttons */}
                    <div className="flex items-center gap-4">
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
                            onClick={handleExport}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 border-none hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition duration-200"
                        >
                            Export
                        </Button>

                    </div>
                </div>

                {/* Table */}
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 20 }}
                    className="rounded-lg shadow"
                />


            </div>
        </AdminLayout>
    );
};

export default TotalRevenueList;
