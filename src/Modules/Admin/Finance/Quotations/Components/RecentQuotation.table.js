import React, { useEffect, useCallback } from "react";
import { Table, Spin, Alert, Button, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { fetchAllQuotations } from "../../../../../Store/Slices/Finance/Quotations/quotationThunks";
import Spinner from "../../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";

const RecentQuotation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Extracting necessary state from Redux store
    const { quotations, totalRecords, loading, error } = useSelector((state) => state.admin.quotations);

    // Debounced function to fetch incomes with a fixed limit of 5
    const debouncedFetch = useCallback(
        debounce((params) => {
            dispatch(fetchAllQuotations(params));
        }, 300),
        [dispatch]
    );

    // Fetch data on component mount with limit set to 5
    useEffect(() => {
        const params = {
            page: 1, // Always fetch the first page
            limit: 5, // Limit to 5 records
            //sortBy: "earnedDate",
            //sortOrder: "desc",
        };
        debouncedFetch(params);
    }, [debouncedFetch]);

    // Handle "View More" button click
    const handleViewMore = () => {
        navigate("/finance/quotations/quotations-list");
    };

    // Define table columns with fixed widths and ellipsis
    const columns = [
        {
            title: "Quotation Number",
            dataIndex: "quotationNumber",
            key: "quotationNumber",
            render: (text) => <span className="text-xs">{text}</span>,
            width: 120,
            ellipsis: true,
        },
        {
            title: "Quotation To",
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
            title: "Total Amount (QR)",
            dataIndex: "total_amount",
            key: "total_amount",
            sorter: (a, b) => (a.total_amount || 0) - (b.total_amount || 0),
            render: (value) => <span className="text-xs">{value || "0"} QR</span>,
            width: 120,
            ellipsis: true,
        },
        {
            title: "Final Amount (QR)",
            dataIndex: "final_amount",
            key: "final_amount",
            sorter: (a, b) => (a.final_amount || 0) - (b.final_amount || 0),
            render: (value) => <span className="text-xs">{value || "0"} QR</span>,
            width: 120,
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "default";
                switch (status) {
                    case "accept":
                        color = "green";
                        break;
                    case "pending":
                        color = "yellow";
                        break;
                    case "reject":
                        color = "red";
                        break;
                    default:
                        color = "default";
                }
                return (
                    <Tag color={color} className="text-xs capitalize">
                        {status || "N/A"}
                    </Tag>
                );
            },
            width: 80,
            ellipsis: true,
        },
    ];

    // Transform incomes data to table dataSource and limit to 5 records
    const dataSource = quotations?.slice(0, 5).map((quotation) => ({
        key: quotation._id,
        quotationNumber: quotation.quotationNumber || "N/A",
        quotationTo: quotation.receiver?.name || "N/A",
        purpose: quotation.purpose || "N/A",
        discount: quotation.discount || 0,
        discountType: quotation.discountType || "percentage",
        final_amount: quotation.final_amount || 0,
        total_amount: quotation.total_amount || 0,
        status: quotation.status || 0,
    }));

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-700">
                    Summary of Quotation ({dataSource?.length || 5}/{totalRecords})
                </h2>

                <ProtectedAction requiredPermission={PERMISSIONS.LIST_ALL_QUOTATION}>
                    <Button
                        onClick={handleViewMore}
                        className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md shadow hover:from-[#a3324e] hover:to-[#6e2384] transition text-xs"
                        size="small"
                    >
                        View More ({totalRecords})
                    </Button>
                </ProtectedAction>


            </div>
            <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_SUMMARY_OF_QUOTATION} title={"Summary of Quotation"}>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center">
                        <Spinner tip="Loading..." />
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
                {/* {!loading && quotations.length === 0 && !error && (
                <div className="text-center text-gray-500 text-xs py-4">
                    No records found.
                </div>
            )} */}
                {/* Table */}
                {!loading && !error && (
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false} // Removed pagination controls
                        className="rounded-lg shadow text-xs"
                        bordered
                        size="small"
                        tableLayout="fixed" // Fixed table layout
                    />

                )}
            </ProtectedSection>

        </div>
    );
};

export default RecentQuotation;
