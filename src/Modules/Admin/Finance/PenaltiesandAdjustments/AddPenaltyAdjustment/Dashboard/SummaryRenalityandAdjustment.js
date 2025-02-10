import React, { useEffect, useCallback } from "react";
import { Table, Spin, Alert, Button, Tag } from "antd";
import { DollarOutlined, CloudOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { fetchReturnInvoice } from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import Spinner from "../../../../../../Components/Common/Spinner";

// Mapping payment types to corresponding icons (if needed for future use)
const paymentTypeIcons = {
  cash: <DollarOutlined />,
  online: <CloudOutlined />,
  credit: <CreditCardOutlined />,
};

const SummaryPenalityandAdjustment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extracting necessary state from Redux store
  const { adjustmentData, loading, error, totalRecords } = useSelector(
    (state) => state.admin.penaltyAdjustment
  );

  // Debounced function to fetch adjustments with a fixed limit of 5
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchReturnInvoice(params));
    }, 300),
    [dispatch]
  );

  // Fetch data on component mount with limit set to 5
  useEffect(() => {
    const params = {
      page: 1,       // Always fetch the first page
      limit: 5,      // Limit to 5 records
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    debouncedFetch(params);
  }, [debouncedFetch]);

  // Handle "View More" button click
  const handleViewMore = () => {
    navigate("/finance/penaltyAdjustment-list");
  };

  // Define table columns with fixed widths, ellipsis, and sorters
  const columns = [
    {
      title: "Return Invoice No.",
      dataIndex: "return_invoice_no",
      key: "return_invoice_no",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.return_invoice_no.localeCompare(b.return_invoice_no),
    },
    {
      title: "Invoice No. Ref",
      dataIndex: "invoice_no",
      key: "invoice_no",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.invoice_no.localeCompare(b.invoice_no),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.receiver.localeCompare(b.receiver),
    },
    {
      title: "Total Amount(QR)",
      dataIndex: "adjustmentAmount",
      key: "adjustmentAmount",
      render: (value) => <span className="text-xs">{value || "0"} QR</span>,
      width: 120,
      ellipsis: true,
      sorter: (a, b) => (a.adjustmentAmount || 0) - (b.adjustmentAmount || 0),
    },
    {
      title: "Final Amount(QR)",
      dataIndex: "adjustmentTotal",
      key: "adjustmentTotal",
      render: (value) => (
        <span className="text-xs text-green-600">{value || "0"} QR</span>
      ),
      width: 120,
      ellipsis: true,
      sorter: (a, b) => (a.adjustmentTotal || 0) - (b.adjustmentTotal || 0),
    },
    {
      title: "Status",
      dataIndex: "isCancel",
      key: "status",
      render: (isCancel) => (
        <Tag color={isCancel ? "red" : "green"} className="text-xs">
          {isCancel ? "Cancelled" : "Active"}
        </Tag>
      ),
      width: 100,
      ellipsis: true,
      sorter: (a, b) => (a.isCancel === b.isCancel ? 0 : a.isCancel ? 1 : -1),
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
      sorter: (a, b) => new Date(a.adjustedAt) - new Date(b.adjustedAt),
    },
  ];

  // Transform adjustments data to table dataSource
  const dataSource = adjustmentData?.map((adjustment) => ({
    key: adjustment?._id,
    return_invoice_no: adjustment?.returnInvoiceNumber || "N/A",
    invoice_no: adjustment?.invoiceId?.invoiceNumber || "N/A",
    receiver: adjustment?.invoiceId?.receiver?.name || "N/A",
    adjustmentAmount: adjustment?.adjustmentTotal || 0,
    adjustmentTotal: adjustment?.adjustmentAmount || 0,
    isCancel: adjustment?.isCancel,
    adjustedAt: adjustment?.adjustedAt || "N/A",
    // Spread any additional properties if needed in future
    ...adjustment,
  }));

  // Helper function to render content based on the current state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <Spinner />
        </div>
      );
    }
    if (error) {
      return (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="my-4"
        />
      );
    }
    if (!adjustmentData || adjustmentData.length === 0) {
      return (
        <div className="text-center text-gray-500 text-xs py-4">
          No records found.
        </div>
      );
    }
    return (
      <ProtectedSection
        requiredPermission={PERMISSIONS.SHOWS_CARD_DATA_OF_PENALTY_AND_ADJUSTMENT}
        title="Penalty & Adjustment"
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false} // Removed pagination controls
          className="rounded-lg shadow text-xs"
          bordered
          size="small"
          tableLayout="fixed" // Fixed table layout
        />
      </ProtectedSection>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">
          Summary of Return Invoice ({dataSource?.length || 0}/{totalRecords})
        </h2>
        <ProtectedAction requiredPermission={PERMISSIONS.SHOWS_RECENT_AND_RETURN_INVOICE}>
          <Button
            onClick={handleViewMore}
            className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md shadow hover:from-[#a3324e] hover:to-[#6e2384] transition text-xs"
            size="small"
          >
            View More ({totalRecords})
          </Button>
        </ProtectedAction>
      </div>

      {/* Render content based on loading, error, or data state */}
      {renderContent()}
    </div>
  );
};

export default SummaryPenalityandAdjustment;
