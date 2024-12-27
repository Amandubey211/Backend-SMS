import React, { useEffect, useCallback } from "react";
import { Table, Spin, Alert, Button, Tag, Tooltip } from "antd";
import {
  DollarOutlined,
  CloudOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { fetchReturnInvoice } from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { fetchAllIncomes } from "../../../../../../Store/Slices/Finance/Earnings/earningsThunks";
// import { setCurrentPage } from "../../../../Store/Slices/Finance/Earnings/earningsSlice";

// Mapping payment types to corresponding icons
const paymentTypeIcons = {
  cash: <DollarOutlined />,
  online: <CloudOutlined />,
  credit: <CreditCardOutlined />,
};

const SummaryPenalityandAdjustment= () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extracting necessary state from Redux store
  const { adjustmentData, loading, error,totalRecords} = useSelector(
    (state) => state.admin.penaltyAdjustment
  );

  // Debounced function to fetch incomes with a fixed limit of 5
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchReturnInvoice(params));
    }, 300),
    [dispatch]
  );

  // Fetch data on component mount with limit set to 5
  useEffect(() => {
    const params = {
      page: 1, // Always fetch the first page
      limit: 5, // Limit to 5 records
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    debouncedFetch(params);
  }, [debouncedFetch]);

  // Handle "View More" button click
  const handleViewMore = () => {
    navigate("/finance/penaltyAdjustment-list");
  };

  // Define table columns with fixed widths and ellipsis
  const columns = [
    {
      title: "Return Invoice No.",
      dataIndex: "return_invoice_no",
      key: "return_imvoice_no",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Invoice No. Ref",
      dataIndex: "invoice_no",
      key: "imvoice_no",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Total Amount(QR)",
      dataIndex: "adjustmentAmount",
      key: "adjustmentAmount",
      render: (value) => (
        <span className="text-xs">{value || "0"} QR</span>
      ),
      width: 120,
      ellipsis: true,
    },
    {
      title: "Final Amount(QR)",
      dataIndex: "adjustmentTotal",
      key: "adjustmentTotal",
      render: (value) => <span className="text-xs text-green-600">{value || "0"} QR</span>,
      width: 120,
      ellipsis: true,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 100,
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "adjustedAt",
      key: "adjustedAt",
      render: (value) => {
        const date = value ? new Date(value) : null;
        const formattedDate = date
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(date)
          : "N/A";

        return <span className="text-xs">{formattedDate}</span>;
      },
      width: 120,
      ellipsis: {
        showTitle: true,
      },
    }
  ];

 // Transform incomes data to table dataSource and limit to 10 records
 const dataSource = adjustmentData?.map((adjustment) => ({
  key: adjustment._id,
  return_invoice_no: adjustment?.returnInvoiceNumber || "N/A",
  invoice_no: adjustment.invoiceId.invoiceNumber || "N/A",
  receiver: adjustment.invoiceId.receiver.name || "N/A",
  // discount: adjustment.discount || 0,
  // discountType: adjustment.discountType || "percentage",
  // penalty: adjustment.adjustmentPenalty || "N/A",
  // tax: adjustment.tax,
  adjustmentAmount: adjustment.adjustmentTotal || 0,
  adjustmentTotal: adjustment.adjustmentAmount || 0,
  status: adjustment.isCancel ? "Cancelled" : "-",
  adjustedAt: adjustment.adjustedAt || "N/A",
}));

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">
          Summary of Return Invoice ({dataSource?.length || 0}/{totalRecords})
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
      {/* {!loading &&  !error && (
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
    </div>
  );
};

export default SummaryPenalityandAdjustment;
