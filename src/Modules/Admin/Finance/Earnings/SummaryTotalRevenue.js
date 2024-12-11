import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // For navigation

const SummaryTotalRevenue = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate(); // Initialize navigation

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
        // Add more rows here as needed
    ];

    // Table columns with filters
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


    // Search input change handler
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Handle "View More" navigation
    const handleViewMore = () => {
        navigate("/finance/total-revenue-list");
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-700">Summary of Total Revenue</h2>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        className="w-64"
                        value={searchText}
                        onChange={handleSearch}
                    />
                    {/* View More Button */}
                    <button
                        onClick={handleViewMore}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow hover:shadow-md transition cursor-pointer"
                    >
                        View More
                    </button>
                </div>
            </div>

            {/* Table */}
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                className="rounded-lg"
            />

        </div>
    );
};

export default SummaryTotalRevenue;
