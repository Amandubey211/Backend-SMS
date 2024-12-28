import React, { useEffect, useCallback } from "react";
import { Table, Spin, Alert, Button, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { fetchAllQuotations } from "../../../../../Store/Slices/Finance/Quotations/quotationThunks";


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
            render: (value) => (
                <Tag color="purple" className="text-xs">
                    {value || 0} QR
                </Tag>
            ),
            width: 100,
            ellipsis: true,
        },
        {
            title: "Final Amount (QR)",
            dataIndex: "final_amount",
            key: "final_amount",
            render: (value) => <span className="text-xs">{value || "0"} QR</span>,
            width: 120,
            ellipsis: true,
        },

    ];

    // Transform incomes data to table dataSource and limit to 5 records
    const dataSource = quotations?.slice(0, 5).map((quotation) => ({
        key: quotation._id,
        quotationNumber: quotation.quotationNumber || "N/A",
        quotationTo: quotation.reciever?.name || "N/A",
        purpose: quotation.remark || "N/A",
        discount: quotation.discount || 0,
        final_amount: quotation.final_amount || 0,
    }));
    console.log("totalRecords", totalRecords);

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-700">
                    Summary of Quotation ({dataSource?.length || 5}/{totalRecords})
                </h2>
                <Button
                    onClick={handleViewMore}
                    className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md shadow hover:from-[#a3324e] hover:to-[#6e2384] transition text-xs"
                    size="small"
                >
                    View More ({totalRecords})
                </Button>
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
            {!loading && quotations.length === 0 && !error && (
                <div className="text-center text-gray-500 text-xs py-4">
                    No records found.
                </div>
            )}
            {/* Table */}
            {!loading && !error && quotations.length > 0 && (
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
        </div>
    );
};

export default RecentQuotation;
