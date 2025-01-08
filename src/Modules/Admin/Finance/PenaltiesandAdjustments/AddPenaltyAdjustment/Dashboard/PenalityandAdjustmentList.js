import React, { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import {
  Alert,
  Button,
  Dropdown,
  Input,
  Spin,
  Table,
  Tag,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import {
  cancleReturnInvoiceData,
  fetchReturnInvoice,
} from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import {
  CloseCircleOutlined,
  ExportOutlined,
  FilePdfOutlined,
  MailOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ExportModal from "../../../Earnings/Components/ExportModal";
import { setCurrentPage } from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.slice";
import PenaltyAdjustmentTemplate from "../../../../../../Utils/FinanceTemplate/PenaltyAdjustmentTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

const PenalityandAdjustmentList = () => {
  useNavHeading("Finance", "Penalty & Adjustment List");

  // Redux state
  const {
    adjustmentData,
    loading,
    error,
    totalRecords,
    totalPages,
    currentPage,
    pageSize,
  } = useSelector((state) => state.admin.penaltyAdjustment);

  // Local state
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isReceiptVisible, setReceiptVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reference for the popup/modal
  const popupRef = useRef(null);

  const paze_size =
    totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;
  const [computedPageSize, setComputedPageSize] = useState(paze_size);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Handle canceling a return invoice
  const handleCancleReturnInvoice = (id) => {
    const params = {
      search: searchText,
      page: 1, // Always fetch the first page
      limit: 10, // Limit to 10 records
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    dispatch(cancleReturnInvoiceData({ params, id }));
  };

  // Handle previewing a return invoice
  const handleReturnPreview = (record) => {
    setSelectedReceipt(record);
    setReceiptVisible(true);
  };

  // Handle downloading the PDF
  const handleDownloadPDF = async () => {
    try {
      if (!selectedReceipt) {
        toast.error("No receipt selected for download.");
        return;
      }
  
      if (!popupRef.current) {
        toast.error("Receipt content is not available.");
        return;
      }
  
      const pdfTitle = selectedReceipt.returnInvoiceNumber
        ? `${selectedReceipt.returnInvoiceNumber}.pdf`
        : "penalty_adjustment.pdf";
  
      const canvas = await html2canvas(popupRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
  
      pdf.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);
      pdf.save(pdfTitle);
  
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF: ", error);
      toast.error("Failed to generate PDF.");
    }
  };
  

  // Debounced function to fetch adjustments
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchReturnInvoice(params));
    }, 300),
    [dispatch]
  );

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: computedPageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage, computedPageSize]);

  // Close receipt preview modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        isReceiptVisible
      ) {
        setReceiptVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isReceiptVisible]);

  // Define table columns with fixed widths and ellipsis
  const columns = [
    {
      title: "Return Invoice No.",
      dataIndex: "return_invoice_no",
      key: "return_invoice_no",
      render: (text) => <span className="text-xs">{text}</span>,
      width: 150,
      ellipsis: true,
      sorter: (a, b) =>
        a.return_invoice_no.localeCompare(b.return_invoice_no),
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
      sorter: (a, b) =>
        (a.adjustmentAmount || 0) - (b.adjustmentAmount || 0),
    },
    {
      title: "Final Amount(QR)",
      dataIndex: "adjustmentTotal",
      key: "adjustmentTotal",
      render: (value) => {
        const formattedValue = value
          ? Number.isInteger(value)
            ? value
            : value.toFixed(2)
          : "0";
        return (
          <span className="text-xs text-green-600">
            {formattedValue} QR
          </span>
        );
      },
      width: 120,
      ellipsis: true,
      sorter: (a, b) =>
        (a.adjustmentTotal || 0) - (b.adjustmentTotal || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={text === "Cancelled" ? "red" : "purple"}
          className="text-xs"
        >
          <span className="text-xs">{text || "Active"}</span>
        </Tag>
      ),
      width: 100,
      ellipsis: true,
      sorter: (a, b) =>
        (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "Date",
      dataIndex: "adjustedAt",
      key: "adjustedAt",
      render: (value) => {
        if (!value) {
          return <span className="text-xs">N/A</span>;
        }
        try {
          const date = new Date(value);
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(date);
          return <span className="text-xs">{formattedDate}</span>;
        } catch (error) {
          console.error("Invalid date value:", value, error);
          return <span className="text-xs">N/A</span>;
        }
      },
      width: 120,
      ellipsis: {
        showTitle: true,
      },
      sorter: (a, b) => {
        const dateA = new Date(a.adjustedAt || 0);
        const dateB = new Date(b.adjustedAt || 0);
        return dateA - dateB;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const menuItems = [
          {
            key: "1",
            label: (
              <span>
                <FilePdfOutlined style={{ marginRight: 8 }} />
                Preview
              </span>
            ),
            onClick: () => {
              handleReturnPreview(record);
            },
          },
          {
            key: "2",
            label: (
              <span>
                <CloseCircleOutlined style={{ marginRight: 8 }} />
                {record?.status === "Cancelled" ? "Cancelled" : "Cancel"}
              </span>
            ),
            onClick: () => {
              if (record?.status !== "Cancelled")
                handleCancleReturnInvoice(record?.key);
            },
            disabled: record?.status === "Cancelled",
          },
          {
            key: "3",
            label: (
              <span>
                <MailOutlined style={{ marginRight: 8 }} />
                Send Mail
              </span>
            ),
            // Implement Send Mail functionality if needed
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
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

  // Transform adjustments data to table dataSource
  const dataSource = adjustmentData?.map((adjustment) => ({
    key: adjustment?._id,
    return_invoice_no: adjustment?.returnInvoiceNumber || "N/A",
    invoice_no: adjustment?.invoiceId?.invoiceNumber || "N/A",
    receiver: adjustment?.invoiceId?.receiver?.name || "N/A",
    adjustmentAmount: adjustment?.adjustmentAmount || 0,
    adjustmentTotal: adjustment?.adjustmentTotal || 0,
    status: adjustment?.isCancel ? "Cancelled" : "Active",
    adjustedAt: adjustment?.adjustedAt || "N/A",
    ...adjustment, // Spread other properties safely
  }));

  // Transform adjustment data for export (if needed)
  const transformAdjustmentData = (adjustmentData) =>
    adjustmentData?.map((adjustment, index) => {
      const {
        _id,
        returnInvoiceNumber = "N/A",
        invoiceId = {},
        tax = 0,
        discount = 0,
        discountType = "percentage",
        adjustmentPenalty = 0,
        adjustmentTotal = 0,
        adjustmentAmount = 0,
        adjustedBy = {},
        adjustedAt = "N/A",
        academicYear = {},
      } = adjustment || {};

      return {
        sNo: index + 1,
        returnInvoiceNumber,
        refInvoiceNumber: invoiceId.invoiceNumber || "N/A",
        receiver: invoiceId.receiver?.name || "N/A",
        receiverEmail: invoiceId.receiver?.email || "N/A",
        receiverPhone: invoiceId.receiver?.contact || "N/A",
        receiverAddress: invoiceId.receiver?.address || "N/A",
        tax: `${parseFloat(tax)} %`,
        discount:
          discountType === "percentage"
            ? `${parseFloat(discount)} %`
            : `${parseFloat(discount)} QR`,
        discountType,
        penalty: `${parseFloat(adjustmentPenalty)} QR`,
        totalAmount: `${parseFloat(adjustmentTotal)} QR`,
        finalAmount: `${parseFloat(adjustmentAmount)} QR`,
        createdBy: adjustedBy.adminName || "N/A",
        Date: adjustedAt,
        academicYearDetails: academicYear.year || "N/A",
      };
    }) || [];

  return (
    <Layout title={"Penalty & Adjustment List | Student Diwan"}>
      <AdminDashLayout>
        <div className="bg-white p-4 rounded-lg space-y-4 mt-3">
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
              }}
            />
            <div className="flex justify-end items-center gap-2">
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => setIsExportModalVisible(true)}
                className="flex items-center bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-2 rounded-md shadow-md"
              >
                Export
              </Button>
              <button
                onClick={() =>
                  navigate(
                    "/finance/penaltyAdjustment/add-new-penalty-adjustment"
                  )
                }
                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
              >
                <span className="text-gray-800 font-medium">
                  Add New Adjustment
                </span>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                  <FiPlus size={16} />
                </div>
              </button>
            </div>
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
                pageSizeOptions: ["5", "10", "20", "50"],
                size: "small",
                showTotal: () =>
                  `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
                onChange: (page, pageSize) => {
                  dispatch(setCurrentPage(page));
                  setComputedPageSize(pageSize);
                },
                onShowSizeChange: (current, size) => {
                  setComputedPageSize(size);
                },
              }}
              className="rounded-lg shadow text-xs"
              bordered
              size="small"
              tableLayout="fixed"
            />
          )}
          {/* Export Modal */}
          <ExportModal
            visible={isExportModalVisible}
            onClose={() => setIsExportModalVisible(false)}
            dataToExport={transformAdjustmentData(adjustmentData)}
            title="Penalty Adjustment Data"
            sheet="penalty_adjustment_report"
          />
          {/* Receipt Preview Overlay */}
          {isReceiptVisible && (
            <div className="fixed inset-0 z-50">
              {/* Dim / Blur background */}
              <div
                className="absolute inset-[-5rem] bg-black bg-opacity-60"
                style={{ backdropFilter: "blur(8px)" }}
              />
              {/* Centered content */}
              <div className="relative flex items-center justify-center w-full h-full">
                <div
                  className="relative bg-white rounded-md shadow-md p-6 w-full max-w-[53rem] max-h-[90vh] overflow-auto"
                  ref={popupRef}
                >
                  {/* The actual penalty adjustment content */}
                  <PenaltyAdjustmentTemplate data={selectedReceipt} />
                </div>

                {/* Close + Download PDF buttons */}
                <div className="absolute mt-[-29rem] ml-[66rem] flex flex-col items-center space-y-2">
                  {/* Close button */}
                  <button
                    onClick={() => setReceiptVisible(false)}
                    className="bg-gray-200 hover:bg-gray-300 mr-32 rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold shadow-md"
                  >
                    ✕
                  </button>
                  {/* Download PDF button */}
                  <button
                    className="w-40 py-2 text-white font-semibold rounded-md shadow-md"
                    style={{
                      background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)",
                    }}
                    onClick={handleDownloadPDF}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default PenalityandAdjustmentList;
