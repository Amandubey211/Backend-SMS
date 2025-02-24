// src/Modules/Admin/Finance/PenaltiesandAdjustments/AddPenaltyAdjustment/Dashboard/PenalityandAdjustmentList.js

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import {
  Menu,
  Button,
  Dropdown,
  Input,
  Table,
  Tag,
  Spin,
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
  EyeOutlined,
} from "@ant-design/icons";
import ExportModalNew from "../../../../../../Components/Common/ExportModalNew";
import PenaltyAdjustmentTemplate from "../../../../../../Utils/FinanceTemplate/PenaltyAdjustmentTemplate";
import { toast } from "react-hot-toast";
import { setCurrentPage, setReadOnly, setSelectedAdjustment } from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.slice";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { sendEmail } from "../../../../../../Store/Slices/Common/SendPDFEmail/sendEmailThunk";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { downloadPDF } from "../../../../../../Utils/xl";
import Spinner from "../../../../../../Components/Common/Spinner";

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
  const [selectedReturnInvoice, setSelectedReturnInvoice] = useState(null);
  const [selectedExportRecord, setSelectedExportRecord] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pdfRef = useRef(null);
  const popupRef = useRef(null);

  const paze_size = pageSize;
const [computedPageSize, setComputedPageSize] = useState(paze_size);
  // Extract adjustments array from Redux state.
  // If adjustmentData contains an `adjustments` property, use that;
  // otherwise, if adjustmentData is already an array, use it.
  const adjustmentsArray = useMemo(() => {
    if (adjustmentData && adjustmentData.adjustments) {
      return adjustmentData.adjustments;
    }
    if (Array.isArray(adjustmentData)) {
      return adjustmentData;
    }
    return [];
  }, [adjustmentData]);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Handle canceling a return invoice
  const handleCancleReturnInvoice = (record) => {
    const { _id } = record;
    const params = {
      search: searchText,
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    dispatch(cancleReturnInvoiceData({ params, id: _id }));
  };

  // Handle previewing a return invoice
  const handleReturnPreview = (record) => {
    setSelectedReturnInvoice(record);
    setReceiptVisible(true);
  };

  // Handle downloading the PDF
  const handleDownloadPDF = async (pdfRef, selectedReturnInvoice) => {
    await downloadPDF(pdfRef, selectedReturnInvoice, "ReturnInvoice");
  };

  // Inside PenalityandAdjustmentList.js

  const handleSendEmail = async (record) => {
    if (!record._id) {
      toast.error("Invalid adjustment ID.");
      return;
    }

    console.log("Attempting to send email for adjustment:", record);

    // Determine email type: use "cancelReturnInvoice" if cancelled; otherwise "adjustment"
    const emailType = record.isCancel ? "cancelReturnInvoice" : "adjustment";

    // Map the record to the required email data structure
    const emailData = mapRecordToEmailData(record);

    // Show a loading toast notification in real time
    const toastId = toast.loading("Sending email...");

    try {
      // For canceled adjustments, use the linked invoice's _id (if available)
      const idToSend =
        record.isCancel && record.invoiceId && record.invoiceId._id
          ? record.invoiceId._id
          : record._id;

      const result = await dispatch(
        sendEmail({
          id: idToSend,
          type: emailType,
          payload: emailData,
        })
      );

      // Dismiss the loading toast notification
      toast.dismiss(toastId);

      // Determine the proper display message for notifications:
      let displayMessage = "Adjustment";
      if (record.isReturn) {
        displayMessage = "Return Adjustment";
      } else if (record.isCancel) {
        displayMessage = "Cancelled Adjustment";
      }

      if (sendEmail.fulfilled.match(result)) {
        toast.success(`${displayMessage} email sent successfully!`);
      } else {
        console.error("Failed sendEmail response:", result);
        toast.error(result.payload || `Failed to send ${displayMessage} email.`);
      }
    } catch (err) {
      console.error("Error sending email:", err);
      toast.dismiss(toastId);
      toast.error("Error sending email.");
    }
  };




  // Define the action menu for each row
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleReturnPreview(record)}>
        <FilePdfOutlined style={{ marginRight: 8 }} />
        Preview
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          const selectedAdjustment = adjustmentsArray.find(
            (adjustment) => adjustment._id === record.key
          );
          if (selectedAdjustment) {
            dispatch(setSelectedAdjustment(selectedAdjustment));
            dispatch(setReadOnly(true));
            navigate("/finance/penaltyAdjustment/add-new-penalty-adjustment");
          } else {
            toast.error("Selected adjustment not found.");
          }
        }}
      >
        <EyeOutlined style={{ marginRight: 8 }} />
        View (Read-only)
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          if (!record?.status || record?.status !== "Cancelled") {
            handleCancleReturnInvoice(record);
          }
        }}
        disabled={record?.status === "Cancelled"}
      >
        <CloseCircleOutlined style={{ marginRight: 8 }} />
        {record?.status === "Cancelled" ? "Cancelled" : "Cancel"}
      </Menu.Item>
      <Menu.Item key="4" onClick={() => handleSendEmail(record)}>
        <MailOutlined style={{ marginRight: 8 }} />
        Send Mail
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() => {
          console.log("Selected Record for Export:", record);
          setSelectedExportRecord(record);
          setTimeout(() => {
            setIsExportModalVisible(true);
          }, 100);
        }}
      >
        <ExportOutlined style={{ marginRight: 8 }} />
        Export
      </Menu.Item>
    </Menu>
  );

  // Debounced function to fetch adjustments
  // const debouncedFetch = useCallback(
  //   debounce((params) => {
  //     dispatch(fetchReturnInvoice(params));
  //   }, 300),
  //   [dispatch]
  // );

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: computedPageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    dispatch(fetchReturnInvoice(params));
  }, [dispatch, searchText, currentPage, computedPageSize, pageSize]);

  // Monitor loading state to disable initial render when API call completes
  useEffect(() => {
    if (!loading) {
      setInitialLoad(false);
    }
  }, [loading]);

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

  // Define table columns
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
        <Tag color={text === "Cancelled" ? "red" : "purple"} className="text-xs">
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
      ellipsis: { showTitle: true },
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
      render: (_, record) => (
        <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
          <MoreOutlined style={{ fontSize: "15px", cursor: "pointer", transform: "rotate(180deg)" }} />
        </Dropdown>
      ),
      width: 100,
      ellipsis: true,
    },
  ];

  // Map record data for email sending
  const mapRecordToEmailData = (record) => {
    return {
      nameOfSchool: record.schoolName || "N/A",
      address: record.schoolAddress || "N/A",
      branchName: record.branchName || "N/A",
      city: record.city || "N/A",
      finalReceiver: {
        name: record.invoiceId?.receiver?.name || "N/A",
        email: record.invoiceId?.receiver?.email || "N/A",
        address: record.invoiceId?.receiver?.address || "N/A",
        phone: record.invoiceId?.receiver?.contact || "N/A",
      },
      returnInvoiceNumber: record.returnInvoiceNumber || "N/A",
      invoiceNumber: record.invoiceId?.invoiceNumber || "N/A",
      date: record.adjustedAt
        ? new Date(record.adjustedAt).toLocaleDateString()
        : "N/A",
      paymentMethod: record.paymentMethod || "N/A",
      paymentStatus: record.paymentStatus || "N/A",
      lineItems: record.lineItems || [],
      totalAmount: record.adjustmentTotal || 0,
      tax: record.tax || 0,
      penalty: record.penalty || 0,
      discount: record.discount || 0,
      finalAmount: record.adjustmentAmount || 0,
      remark: record.remark || "",
      schoolId: record.schoolId || "",
      receiver: {
        email: record.invoiceId?.receiver?.email || "N/A",
      },
    };
  };

  // Transform adjustments data for the table using adjustmentsArray
  const dataSource = adjustmentsArray.map((adjustment) => ({
    key: adjustment?._id,
    return_invoice_no: adjustment?.returnInvoiceNumber || "N/A",
    invoice_no: adjustment?.invoiceId?.invoiceNumber || "N/A",
    receiver: adjustment?.invoiceId?.receiver?.name || "N/A",
    adjustmentAmount: adjustment?.adjustmentAmount || 0,
    adjustmentTotal: adjustment?.adjustmentTotal || 0,
    status: adjustment?.isCancel ? "Cancelled" : "Active",
    adjustedAt: adjustment?.adjustedAt || "N/A",
    ...adjustment,
  }));

  // Transform adjustment data for export
  const transformAdjustmentData = (adjustments) =>
    adjustments.map((adjustment, index) => {
      const {
        returnInvoiceNumber = "N/A",
        invoiceId = {},
        tax = 0,
        discount = 0,
        discountType = "percentage",
        penalty = 0,
        adjustmentTotal = 0,
        adjustmentAmount = 0,
        adjustedBy = {},
        adjustedAt = "N/A",
        academicYear = {},
        isCancel,
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
        penalty: `${parseFloat(penalty)} QR`,
        totalAmount: `${parseFloat(adjustmentTotal)} QR`,
        finalAmount: `${parseFloat(adjustmentAmount)} QR`,
        createdBy: adjustedBy.adminName || "N/A",
        Date:
          adjustedAt !== "N/A"
            ? new Date(adjustedAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "N/A",
        academicYearDetails: academicYear.year || "N/A",
        status: isCancel ? "Cancelled" : "Active",
      };
    });

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
              <ProtectedAction requiredPermission={PERMISSIONS.CREATE_NEW_ADJUSTMENT}>
                <button
                  onClick={() =>
                    navigate("/finance/penaltyAdjustment/add-new-penalty-adjustment")
                  }
                  className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                >
                  <span className="text-gray-800 font-medium">Add New Adjustment</span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FiPlus size={16} />
                  </div>
                </button>
              </ProtectedAction>
            </div>
          </div>

          {/* Render Spinner until initial API call is complete */}

          <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_ALL_ADJUSTMENTS} title={"Penalty & Adjustment List"}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                current: currentPage,
                total: totalRecords,
                pageSize: computedPageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
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
              loading={{
                spinning: loading,
                indicator: <Spin size="large" />,
                tip: "Loading...",
              }}
            />
          </ProtectedSection>



          {/* Export Modal */}
          <ExportModalNew
            visible={isExportModalVisible}
            onClose={() => {
              setIsExportModalVisible(false);
              setSelectedExportRecord(null);
            }}
            dataToExport={
              selectedExportRecord
                ? transformAdjustmentData([selectedExportRecord])
                : transformAdjustmentData(adjustmentsArray)
            }
            columns={[
              { header: "S.No", dataKey: "sNo" },
              { header: "Return Invoice No.", dataKey: "returnInvoiceNumber" },
              { header: "Invoice Ref No.", dataKey: "refInvoiceNumber" },
              { header: "Receiver", dataKey: "receiver" },
              { header: "Total Amount", dataKey: "totalAmount" },
              { header: "Final Amount", dataKey: "finalAmount" },
              { header: "Discount", dataKey: "discount" },
              { header: "Penalty", dataKey: "penalty" },
              { header: "Status", dataKey: "status" },
              { header: "Date", dataKey: "Date" },
            ]}
            fileName={
              selectedExportRecord
                ? `Penalty_Adjustment_${selectedExportRecord.returnInvoiceNumber}`
                : "Penalty_Adjustments"
            }
            alwaysRender={true}
          />

          {/* Receipt Preview Overlay */}
          {isReceiptVisible && selectedReturnInvoice && (
            <div className="fixed inset-[-5rem] z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black bg-opacity-60"
                style={{ backdropFilter: "blur(8px)" }}
                onClick={() => setReceiptVisible(false)}
              />
              <div
                ref={popupRef}
                className="relative p-6 w-full max-w-[700px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end space-x-2 mb-4">
                  <button
                    onClick={() => handleDownloadPDF(pdfRef, selectedReturnInvoice)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md hover:opacity-90"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setReceiptVisible(false)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                    aria-label="Close Receipt Preview"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <PenaltyAdjustmentTemplate data={selectedReturnInvoice} ref={pdfRef} />
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
