import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Spin, Table, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { FaPlusCircle } from "react-icons/fa";
import Sidebar from "../../../../Components/Common/Sidebar.js";
import PenaltyAddForm from "./PenaltyAddForm.js";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import { getAllPenalties } from "../../../../Store/Slices/Finance/Penalty/Penaltythunk.js";

const Penalty = () => {
    const dispatch = useDispatch();
    const [penalties, setPenalties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isActive, setIsActive] = useState(undefined); // undefined for "All", true for "Active", false for "Inactive"
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectPenalty, setSelectPenalty] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Reintroduced to trigger refetch

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectPenalty(null);
    };

    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1); // Increment to trigger useEffect
        setCurrentPage(1); // Reset to first page after adding/updating
    };

    useNavHeading("admin", `Penalties`);

    useEffect(() => {
        const fetchPenalties = async () => {
            setLoading(true);
            try {
                // console.log("Fetching penalties with params:", { search: searchText, page: currentPage, limit: pageSize, isActive });
                const response = await dispatch(getAllPenalties({
                    search: searchText,
                    page: currentPage,
                    limit: pageSize,
                    isActive,
                })).unwrap(); // Use unwrap to handle the promise
                // console.log("Penalties Full Response:", response); // Debug full response
                const penaltyData = Array.isArray(response.data) ? response.data : [];
                // console.log("Penalty Data:", penaltyData); // Debug penalty data
                setPenalties(penaltyData);
                setTotal(response.total || 0);
                setTotalPages(response.totalPages || 1);
                setCurrentPage(response.page || 1);
            } catch (error) {
                console.error("Failed to fetch penalties:", error);
                setPenalties([]);
                setTotal(0);
                setTotalPages(1);
                setCurrentPage(1);
            } finally {
                setLoading(false);
            }
        };
        fetchPenalties();
    }, [searchText, isActive, currentPage, pageSize, refreshTrigger, dispatch]); // Added dispatch as dependency

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (value) => <span className="text-sm">{value || "N/A"}</span>,
            ellipsis: true,
            width: 120,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (value) => <span className="text-sm">{value?.slice(0, 60) || "-"}</span>,
            ellipsis: true,
            width: 250,
        },
        {
            title: "Penalty Type",
            dataIndex: "penaltyType",
            key: "penaltyType",
            render: (value) => {
                const capitalizedStatus = value?.charAt(0)?.toUpperCase() + value?.slice(1);
                return <span className="text-md">{capitalizedStatus || "N/A"}</span>;
            },
            ellipsis: true,
            width: 100,
        },
        {
            title: "Penalty Value",
            dataIndex: "penaltyValue",
            key: "penaltyValue",
            render: (value) => <span className="text-md">{typeof value === "number" ? value : "N/A"}</span>,
            ellipsis: true,
            width: 100,
        },
        {
            title: "Grace Period (Days)",
            dataIndex: "gracePeriod",
            key: "gracePeriod",
            render: (value) => <span className="text-md">{typeof value === "number" ? value : 0}</span>,
            ellipsis: true,
            width: 100,
        },
        {
            title: "Action",
            render: (_, record) => (
                <div className="flex flex-row gap-4">
                    <span
                        className="text-xs text-blue-600 cursor-pointer"
                        onClick={() => {
                            setSelectPenalty(record);
                            setIsModalVisible(true);
                        }}
                        title="Edit"
                    >
                        <MdEdit size={20} />
                    </span>
                    <span
                        className="text-xs text-blue-600 cursor-pointer"
                        onClick={() => {
                            setSelectPenalty({ mode: "view", ...record });
                            setIsModalVisible(true);
                        }}
                        title="View"
                    >
                        <MdRemoveRedEye size={20} />
                    </span>
                </div>
            ),
            width: 80,
        },
    ];

    return (
        <>
            <div className="p-4">
                <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
                    <div className="flex w-full flex-row items-center gap-4">
                        <Input
                            placeholder="Search by name..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            className="w-80 py-2"
                        />
                        <Select
                            placeholder="Filter by status"
                            value={isActive === undefined ? "all" : isActive ? "active" : "inactive"}
                            onChange={(value) => {
                                if (value === "all") {
                                    setIsActive(undefined);
                                } else {
                                    setIsActive(value === "active");
                                }
                                setCurrentPage(1); // Reset to first page on filter change
                            }}
                            className="w-40"
                        >
                            <Select.Option value="all">All</Select.Option>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </div>
                    <div className="w-[15rem]">
                        <button
                            onClick={() => {
                                setSelectPenalty(null);
                                setIsModalVisible(true);
                            }}
                            className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                        >
                            <span className="text-gray-800 font-medium">Add Penalty</span>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                <FaPlusCircle size={16} />
                            </div>
                        </button>
                    </div>
                </div>

                <Table
                    dataSource={penalties || []}
                    columns={columns}
                    pagination={{
                        current: currentPage,
                        total: total,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        size: "small",
                        showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} records | Page ${currentPage} of ${totalPages}`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    loading={{ spinning: loading, indicator: <Spin size="large" /> }}
                    bordered
                />
            </div>
            <Sidebar
                title={selectPenalty ? "Penalty Full Information" : "Add Penalty"}
                width="25%"
                isOpen={isModalVisible}
                onClose={handleModalClose}
            >
                <PenaltyAddForm
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    editData={selectPenalty}
                    onSuccess={handleRefresh} // Pass the refresh callback
                />
            </Sidebar>
        </>
    );
};

export default Penalty;