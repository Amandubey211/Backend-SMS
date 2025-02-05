import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExportOutlined,
  EyeOutlined,
  FilePdfOutlined,
  MoreOutlined,
  MailOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllQuotations,
  updateQuotationStatus,
} from "../../../../Store/Slices/Finance/Quotations/quotationThunks";
import Spinner from "../../../../Components/Common/Spinner";
import EmailModal from "../../../../Components/Common/EmailModal";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import debounce from "lodash.debounce";
import {
  clearSelectedQuotation,
  setCurrentPage,
  setReadOnly,
  setSelectedQuotation,
} from "../../../../Store/Slices/Finance/Quotations/quotationSlice";
import { Alert, Button, Dropdown, Input, Menu, Spin, Table, Tag } from "antd";
import Layout from "../../../../Components/Common/Layout";
import toast from "react-hot-toast";
import ExportModal from "../Earnings/Components/ExportModal";
import QuotationTemplate from "../../../../Utils/FinanceTemplate/QuotationTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import { formatDate } from "../../../../Utils/helperFunctions";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { downloadPDF } from "../../../../Utils/xl";
import { sendEmail } from "../../../../Store/Slices/Common/SendPDFEmail/sendEmailThunk";

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
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pdfRef = useRef(null);
  // Local state for preview mode renamed to avoid collision with Redux action
  const [isQuotationPreviewVisible, setQuotationPreviewVisible] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState(null);
  const popupRef = useRef(null);

  const paze_size =
    totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;
  const [computedPageSize, setComputedPageSize] = useState(paze_size);

  // Build a map for full quotation objects (keyed by _id)
  const quotationIdMap = useMemo(() => {
    const map = {};
    quotations.forEach((quotation) => {
      map[quotation._id] = quotation;
    });
    return map;
  }, [quotations]);

  const handleDownloadPDF = async (pdfRef, previewQuotation) => {
    await downloadPDF(pdfRef, previewQuotation, "Quotation");
  };

  const handleSendEmail = async (record) => {
    // Get the full record from the quotationIdMap using the record's key
    const fullRecord = quotationIdMap[record.key];
    if (!fullRecord) {
      toast.error("Quotation not found.");
      console.error("Error: Full quotation record not found for key", record.key);
      return;
    }

    const quotationId = fullRecord._id;
    if (!quotationId) {
      toast.error("Invalid quotation ID.");
      console.error("Error: Missing quotation ID in record", fullRecord);
      return;
    }

    try {
      // Show a loading toast notification
      const toastId = toast.loading("Sending email...");

      // Determine type based on whether the quotation is canceled
      const type = fullRecord.isCancel ? "quotation" : "cancelQuotation";

      // Format dates correctly
      const formattedDate = formatDate(fullRecord.date, "long"); // e.g., "10 January 2025"
      const formattedDueDate = formatDate(fullRecord.dueDate, "long"); // e.g., "10 January 2025"

      // Construct the payload ensuring all required fields are present
      const payload = {
        receiver: {
          email: fullRecord.receiver?.email,
          name: fullRecord.receiver?.name || "N/A",
          address: fullRecord.receiver?.address || "N/A",
          phone: fullRecord.receiver?.phone || "N/A",
        },
        schoolId: fullRecord.schoolId?._id || "N/A",
        nameOfSchool: fullRecord.schoolId?.nameOfSchool || "N/A",
        schoolAddress: fullRecord.schoolId?.address || "N/A",
        branchName: fullRecord.schoolId?.branchName || "N/A",
        city: fullRecord.schoolId?.city || "N/A",
        schoolLogo: fullRecord.schoolId?.logo || "",
        quotationNumber: fullRecord.quotationNumber || "N/A",
        date: formattedDate,
        dueDate: formattedDueDate,
        govtRefNumber: fullRecord.govtRefNumber || "",
        purpose: fullRecord.purpose || "N/A",
        status: fullRecord.status || "N/A",
        academicYear: fullRecord.academicYear?.year || "N/A",
        lineItems: fullRecord.lineItems?.map((item) => ({
          revenueType: item.revenueType || "N/A",
          quantity: item.quantity || 1,
          amount: item.amount || 0,
        })) || [],
        totalAmount: fullRecord.total_amount || 0,
        tax: fullRecord.tax || 0,
        discount: fullRecord.discount || 0,
        discountType: fullRecord.discountType || "fixed",
        finalAmount: fullRecord.final_amount || 0,
      };

      console.log("Dispatching sendEmail with:", { id: quotationId, type, payload });
      const result = await dispatch(sendEmail({ id: quotationId, type, payload }));
      toast.dismiss(toastId);

      // Remove the additional success toast so that only the thunk's toast appears.
      if (sendEmail.rejected.match(result)) {
        console.error("Failed sendEmail response:", result);
        // (The thunk already shows an error toast.)
      }
    } catch (err) {
      console.error("Error in handleSendEmail:", err);
      toast.error(`Error sending email.`);
    }
  };

  // Debounced function to fetch quotations with a fixed limit of 10
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllQuotations(params));
    }, 300),
    [dispatch]
  );

  // Fetch data on component mount
  useEffect(() => {
    console.log("Fetching data...", { searchText, currentPage, pageSize });
    const params = {
      //search: searchText,
      page: 1, // Always fetch the first page
      limit: 10, // Limit to 10 records
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
      title: "Total Amount(QR)",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value) => <span className="text-xs">{value || "0"} QR</span>,
      width: 120,
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="1"
              onClick={() => {
                const quotationToPreview = quotationIdMap[record.key];
                if (quotationToPreview) {
                  setPreviewQuotation(quotationToPreview);
                  setQuotationPreviewVisible(true);
                } else {
                  toast.error("Quotation not found.");
                }
              }}
            >
              <FilePdfOutlined style={{ marginRight: 8 }} /> Preview
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => {
                const quotationToView = quotationIdMap[record.key];
                if (quotationToView) {
                  dispatch(setReadOnly(true));
                  dispatch(setSelectedQuotation(quotationToView));
                  navigate("/finance/quotations/add-new-quotations");
                } else {
                  toast.error("Selected income not found.");
                }
              }}
            >
              <EyeOutlined style={{ marginRight: 8 }} /> View(Read-only)
            </Menu.Item>
            <ProtectedAction requiredPermission={PERMISSIONS.ACCEPT_QUOTATION}>
              <Menu.Item
                key="3"
                onClick={() => handleStatusChange(record.key, "accept")}
              >
                <CheckCircleOutlined style={{ marginRight: 8 }} /> Accept
              </Menu.Item>
            </ProtectedAction>
            <ProtectedAction requiredPermission={PERMISSIONS.REJECT_QUOTATION}>
              <Menu.Item
                key="4"
                onClick={() => handleStatusChange(record.key, "reject")}
              >
                <CloseCircleOutlined style={{ marginRight: 8 }} /> Reject
              </Menu.Item>
            </ProtectedAction>
            <Menu.Item onClick={() => handleSendEmail(record)}>
              <MailOutlined style={{ marginRight: 8 }} /> Send Mail
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

  // Transform quotations data for table dataSource
  const dataSource = quotations?.map((quotation) => ({
    key: quotation._id,
    quotationNumber: quotation.quotationNumber || "N/A",
    quotationTo: quotation.receiver?.name || "N/A",
    purpose: quotation.purpose || "N/A",
    discount: quotation.discount || 0,
    discountType: quotation.discountType || "percentage",
    final_amount: quotation.final_amount || 0,
    total_amount: quotation.total_amount || 0,
    status: quotation.status || "pending",
  }));

  const transformQuotationData = (quotations) =>
    quotations?.map(({ _id, ...quotation }, index) => ({
      sNo: index + 1,
      quotationNo: quotation?.quotationNumber || "N/A",
      receiver: quotation?.receiver?.name || "N/A",
      receiverEmail: quotation?.receiver?.email || "N/A",
      receiverPhone: quotation?.receiver?.phone || "N/A",
      receiverAddress: quotation?.receiver?.address || "N/A",
      schoolName: quotation?.schoolName || "N/A",
      tax: `${parseFloat(quotation?.tax)} %` || 0,
      discount:
        quotation?.discountType === "percentage"
          ? `${parseFloat(quotation?.discount)} %`
          : `${parseFloat(quotation?.discount)} QR` || 0,
      discountType: quotation?.discountType || "N/A",
      totalAmount: `${parseFloat(quotation?.total_amount)} QR` || 0,
      finalAmount: `${parseFloat(quotation?.final_amount)} QR` || 0,
      purpose: quotation?.purpose || "N/A",
      status: quotation?.status || "N/A",
      govtRefNumber: quotation?.govtRefNumber || "N/A",
      remark: quotation?.remark || "N/A",
      cancleQuotation: quotation.isCancel ? "Yes" : "No",
      date: quotation?.date || "N/A",
      dueDate: quotation?.dueDate || "N/A",
      academicYear: quotation?.academicYear?.year || "N/A",
    })) || [];

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  return (
    <Layout title={"Quotation List | Student Diwan"}>
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
              <ProtectedAction requiredPermission={PERMISSIONS.CREATE_NEW_QUOTATION}>
                <button
                  onClick={() => {
                    dispatch(clearSelectedQuotation());
                    dispatch(setReadOnly(false));
                    navigate("/finance/quotations/add-new-quotations");
                  }}
                  className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                >
                  <span className="text-gray-800 font-medium">
                    Add New Quotation
                  </span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FiPlus size={16} />
                  </div>
                </button>
              </ProtectedAction>
            </div>
          </div>

          {/* Data State */}
          {loading ? (
            <div className="flex justify-center">
              <Spin tip="Loading..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">Error: {error}</div>
          ) : quotations.length === 0 ? (
            <div className="text-center">No data available.</div>
          ) : (
            <ProtectedSection
              requiredPermission={PERMISSIONS.LIST_ALL_QUOTATION}
              title={"Quotation List"}
            >
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
                    dispatch(setCurrentPage(page));
                    setComputedPageSize(pageSize);
                  },
                  onShowSizeChange: (current, size) => {
                    setComputedPageSize(size);
                  },
                }}
                onChange={(pagination) => {
                  const newPage = pagination.current;
                  dispatch(setCurrentPage(newPage));
                }}
                className="rounded-lg shadow text-xs"
                bordered
                size="small"
                tableLayout="fixed"
              />
            </ProtectedSection>
          )}

          {/* Quotation Preview Overlay */}
          {isQuotationPreviewVisible && (
            <div className="fixed inset-[-5rem] z-50 flex items-center justify-center">
              {/* Dim / Blur background */}
              <div
                className="absolute inset-0 bg-black bg-opacity-60"
                style={{ backdropFilter: "blur(8px)" }}
                onClick={() => setQuotationPreviewVisible(false)}
              />
              {/* Centered content */}
              <div
                ref={popupRef}
                className="relative p-6 w-full max-w-[700px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close + Download PDF buttons */}
                <div className="flex justify-end space-x-2 mb-4">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md hover:opacity-90"
                    onClick={() => handleDownloadPDF(pdfRef, previewQuotation)}
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setQuotationPreviewVisible(false)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                    aria-label="Close Quotation Preview"
                  >
                    ✕
                  </button>
                </div>

                {/* Quotation content container */}
                <div>
                  <QuotationTemplate data={previewQuotation} ref={pdfRef} />
                </div>
              </div>
            </div>
          )}

          <ExportModal
            visible={isExportModalVisible}
            onClose={() => setIsExportModalVisible(false)}
            dataToExport={transformQuotationData(quotations)}
            title="Quotation Data"
            sheet="quotation_report"
          />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default RecentQuotationList;
