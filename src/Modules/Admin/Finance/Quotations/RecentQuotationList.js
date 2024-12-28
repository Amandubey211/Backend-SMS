import React, { useCallback, useEffect, useState } from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { CheckCircleOutlined, CloseCircleOutlined, FilePdfOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";
import { FcDeleteDatabase } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllQuotations, updateQuotationStatus } from "../../../../Store/Slices/Finance/Quotations/quotationThunks";
import Spinner from "../../../../Components/Common/Spinner";
import EmailModal from "../../../../Components/Common/EmailModal";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import debounce from "lodash.debounce";
import { setCurrentPage } from "../../../../Store/Slices/Finance/Quotations/quotationSlice";
import { Alert, Button, Dropdown, Input, Menu, Spin, Table, Tag } from "antd";
import Layout from "../../../../Components/Common/Layout";

const RecentQuotationList = () => {
    useNavHeading("Finance", "Quotation List");
    const {
        quotations,
        loading,
        error,
        totalRecords,
        totalPages,
        currentPage,
        pageSize,
    } = useSelector((state) => state.admin.quotations);
    //const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const paze_size = totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;
    const [computedPageSize, setComputedPageSize] = useState(paze_size)


    // Debounced function to fetch adjustments with a fixed limit of 5
    const debouncedFetch = useCallback(
        debounce((params) => {
            dispatch(fetchAllQuotations(params));
        }, 300),
        [dispatch]
    );

    // Fetch data on component mount with limit set to 5
    useEffect(() => {
        console.log("Fetching data...", { searchText, currentPage, pageSize });
        const params = {
            //search: searchText,
            page: 1, // Always fetch the first page
            limit: 10, // Limit to 5 records
            //sortBy: "createdAt",
            //sortOrder: "desc",
        };
        debouncedFetch(params);
    }, [debouncedFetch, searchText, currentPage, pageSize, computedPageSize]);

    console.log("after useEffect--", quotations);
    const handleStatusChange = (quotationId, status) => {
        dispatch(updateQuotationStatus({ id: quotationId, status }));
    };

    // Define table columns with fixed widths and ellipsis
    const columns = [
        {
            title: "Quotation No.",
            dataIndex: "quotationNumber",
            key: "quotationNumber",
            render: (text) => <span className="text-xs">{text}</span>,
            width: 150,
            ellipsis: true,
        },
        {
            title: "ReceiverName",
            dataIndex: "quotationTo",
            key: "quotationTo",
            render: (text) => <span className="text-xs">{text}</span>,
            width: 150,
            ellipsis: true,
        },
        {
            title: "Purpose",
            dataIndex: "purpose",
            key: "purpose",
            render: (text) => <span className="text-xs">{text}</span>,
            width: 120,
            ellipsis: true,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
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
            title: "Final Amount(QR)",
            dataIndex: "final_amount",
            key: "final_amount",
            render: (value) => (
                <span className="text-xs text-green-600">{value || "0"} QR</span>
            ),
            width: 120,
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => <span className="text-xs">{text}</span>,
            width: 120,
            ellipsis: true,
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="1" onClick={() => console.log("Edit", record)}>
                            <FilePdfOutlined style={{ marginRight: 8 }} /> preview
                        </Menu.Item>
                        <Menu.Item key="2" onClick={() => handleStatusChange(record.key, "accept")}>
                            <CheckCircleOutlined style={{ marginRight: 8 }} /> Accept
                        </Menu.Item>
                        <Menu.Item key="3" onClick={() => handleStatusChange(record.key, "reject")}>
                            <CloseCircleOutlined style={{ marginRight: 8 }} /> Reject
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <MoreOutlined
                            style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                transform: "rotate(180deg)",
                            }}
                        />
                    </Dropdown>
                );
            },
            width: 100,
            ellipsis: true,
        },
    ];

    // Transform adjustments data to table dataSource and limit to 10 records
    const dataSource = quotations?.map((quotation) => ({
        key: quotation._id,
        quotationNumber: quotation.quotationNumber || "N/A",
        quotationTo: quotation.receiver?.name || "N/A",
        purpose: quotation.purpose || "N/A",
        discount: quotation.discount || 0,
        discountType: quotation.discountType || "percentage",
        final_amount: quotation.final_amount || 0,
        status: quotation.status || "pending"
    }));

    const transformAdjustmentData = (quotations) =>
        quotations?.map((quotation, index) => ({
            sNo: index + 1,
            quotationNumber: quotation.quotationNumber || "N/A",
            quotationTo: quotation.receiver?.name || "N/A",
            purpose: quotation.purpose || "N/A",
            discount: quotation.discount || 0,
            discountType: quotation.discountType || "percentage",
            final_amount: quotation.final_amount || 0,
        })) || [];

    // Handle search input changes
    const handleSearch = (e) => {
        setSearchText(e.target.value);
        dispatch(setCurrentPage(1));
    };

    return (
        <Layout title={"Quotation List | Student Diwan"}>
            <AdminDashLayout>
                <div className="bg-white p-4 rounded-lg  space-y-4 mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <Input
                            placeholder="Search by Subcategory"
                            prefix={<SearchOutlined />}
                            className="w-full md:w-64 text-xs"
                            value={searchText}
                            onChange={handleSearch}
                            allowClear
                            style={{
                                borderRadius: "0.375rem",
                                height: "35px",
                                borderColor: "#ff6bcb",
                                boxShadow: "0 2px 4px rgba(255, 105, 180, 0.2)",
                            }}
                        />
                        <div className="flex justify-end items-center gap-2">
                            {/* <Button
                                type="primary"
                                icon={<ExportOutlined />}
                                onClick={() => setIsExportModalVisible(true)}
                                className="flex items-center bg-gradient-to-r  from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-2 rounded-md shadow-md"
                            >
                                Export
                            </Button> */}
                            <button
                                onClick={() =>
                                    navigate(
                                        "/finance/penaltyAdjustment/add-new-penalty-adjustment"
                                    )
                                }
                                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                            >
                                <span className="text-gray-800 font-medium">
                                    Add New Quotation
                                </span>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                    <FiPlus size={16} />
                                </div>
                            </button>
                        </div>
                        {/* <Button
              onClick={handleViewMore}
              className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md shadow hover:from-[#a3324e] hover:to-[#6e2384] transition text-xs"
              size="small"
            >
              View More ({totalRecords})
            </Button> */}
                    </div>

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex justify-center">
                            <Spin tip="Loading..." />
                        </div>
                    )}
                    {/* Error Message */}
                    {error && (
                        <Alert
                            message="Error"
                            description={error}
                            type="error"
                            showIcon
                            closable
                        />
                    )}
                    {/* No Data Placeholder */}
                    {/* {!loading && !error && (
                        <div className="text-center text-gray-500 text-xs py-4">
                            No records found.
                        </div>
                    )} */}
                    {/* Table */}
                    {!loading && !error && (
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                total: totalRecords,
                                pageSize: computedPageSize,
                                showSizeChanger: true,
                                size: "small",
                                showTotal: () =>
                                    `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
                                onChange: (page, pageSize) => {
                                    setCurrentPage(page); // Update the current page
                                    setComputedPageSize(pageSize); // Update the page size
                                },
                                onShowSizeChange: (current, size) => {
                                    setComputedPageSize(size); // Handle page size change
                                },
                            }}
                            onChange={(pagination) => {
                                const newPage = pagination.current;
                                dispatch(setCurrentPage(newPage));
                            }}
                            className="rounded-lg shadow text-xs"
                            bordered
                            size="small"
                            tableLayout="fixed" // Fixed table layout
                        />
                    )}
                    {/* <ExportModal
                        visible={isExportModalVisible}
                        onClose={() => setIsExportModalVisible(false)}
                        dataToExport={transformAdjustmentData(adjustmentData)}
                        title="Return Receipt Data"
                        sheet="return_receipt_report"
                    /> */}
                </div>
            </AdminDashLayout>
        </Layout>
    );
};

export default RecentQuotationList;
