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
  cancelQuotation, // Do not modify this import
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
import ExportModalNew from "../../../../Components/Common/ExportModalNew";

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
  // Local state for preview mode (renamed to avoid collision with Redux action)
  const [isQuotationPreviewVisible, setQuotationPreviewVisible] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState(null);
  const [selectedExportRecord, setSelectedExportRecord] = useState(null);

  // Local flag to ensure we show spinner until API data has arrived
  const [hasFetched, setHasFetched] = useState(false);
  // Local state for debounced search to enable real-time search
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

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
      const toastId = toast.loading("Sending email...");
      const type = fullRecord.isCancel ? "cancelQuotation" : "quotation";
      const formattedDate = formatDate(fullRecord.date, "long");
      const formattedDueDate = formatDate(fullRecord.dueDate, "long");
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
      if (sendEmail.rejected.match(result)) {
        console.error("Failed sendEmail response:", result);
      }
    } catch (err) {
      console.error("Error in handleSendEmail:", err);
      toast.error("Error sending email.");
    }
  };

  // --- Real-Time Search: Debounce searchText updates ---
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(searchText);
    }, 300);
    handler();
    return () => handler.cancel();
  }, [searchText]);

  // --- Fetch data effect ---
  useEffect(() => {
    setHasFetched(false);
    const params = {
      page: currentPage,
      limit: computedPageSize,
      search: debouncedSearch, // Pass search query to the API
    };
    dispatch(fetchAllQuotations(params))
      .unwrap()
      .finally(() => {
        setHasFetched(true);
      });
  }, [currentPage, computedPageSize, debouncedSearch, dispatch]);

  const handleStatusChange = (quotationId, status) => {
    dispatch(updateQuotationStatus({ id: quotationId, status }));
  };

  // --- Action Menu ---
  const actionMenu = (record) => (
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
            toast.error("Selected quotation not found.");
          }
        }}
      >
        <EyeOutlined style={{ marginRight: 8 }} /> View (Read-only)
      </Menu.Item>
      {record.status === "pending" && !record.isCancel && (
        <ProtectedAction requiredPermission={PERMISSIONS.ACCEPT_QUOTATION}>
          <Menu.Item
            key="3"
            onClick={() => handleStatusChange(record.key, "accept")}
          >
            <CheckCircleOutlined style={{ marginRight: 8 }} /> Accept
          </Menu.Item>
        </ProtectedAction>
      )}
      {record.status !== "reject" && (
        <ProtectedAction requiredPermission={PERMISSIONS.REJECT_QUOTATION}>
          <Menu.Item
            key="4"
            onClick={async () => {
              try {
                // Attempt cancellation
                await dispatch(cancelQuotation(record.key)).unwrap();
                toast.success("Quotation cancelled successfully");
              } catch (err) {
                // If the error message indicates a successful cancellation, treat it as success
                if (err && err.message && err.message.includes("cancel successfully")) {
                  toast.success("Quotation cancelled successfully");
                } else {
                  console.log(err.message || "Error cancelling quotation");
                  return; // Exit if a genuine error occurred
                }
              } finally {
                // Refresh data no matter what happened
                setHasFetched(false);
                const params = {
                  page: currentPage,
                  limit: computedPageSize,
                  search: debouncedSearch,
                };
                try {
                  await dispatch(fetchAllQuotations(params)).unwrap();
                } catch (fetchErr) {
                  // Optionally handle fetch error here
                } finally {
                  setHasFetched(true);
                }
              }
            }}
          >
            <CloseCircleOutlined style={{ marginRight: 8 }} /> Reject
          </Menu.Item>
        </ProtectedAction>
      )}
      <Menu.Item key="5" onClick={() => handleSendEmail(record)}>
        <MailOutlined style={{ marginRight: 8 }} /> Send Mail
      </Menu.Item>
      <Menu.Item
        key="6"
        onClick={() => {
          console.log("Selected Record for Export:", record);
          setSelectedExportRecord(record);
          setTimeout(() => {
            setIsExportModalVisible(true);
          }, 100);
        }}
      >
        <ExportOutlined style={{ marginRight: 8 }} /> Export
      </Menu.Item>
    </Menu>
  );

  // --- Define table columns ---
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
      // Modified render function to check isCancel flag and override display if true
      render: (status, record) => {
        let displayStatus = status;
        let color = "default";
        if (record.isCancel) {
          displayStatus = "reject";
          color = "red";
        } else {
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
        }
        return (
          <Tag color={color} className="text-xs capitalize">
            {displayStatus || "N/A"}
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
      render: (_, record) => (
        <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
          <MoreOutlined
            style={{
              fontSize: "15px",
              cursor: "pointer",
              transform: "rotate(180deg)",
            }}
          />
        </Dropdown>
      ),
      width: 100,
      ellipsis: true,
    },
  ];

  // --- Transform quotations data for table dataSource ---
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
    isCancel: quotation.isCancel, // <-- Include the isCancel flag
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
      tax: quotation?.tax ? `${parseFloat(quotation.tax)} %` : "0 %",
      discount:
        quotation?.discountType === "percentage"
          ? `${parseFloat(quotation.discount)} %`
          : `${parseFloat(quotation.discount)} QR`,
      discountType: quotation?.discountType || "N/A",
      totalAmount: quotation?.total_amount
        ? `${parseFloat(quotation.total_amount)} QR`
        : "0 QR",
      finalAmount: quotation?.final_amount
        ? `${parseFloat(quotation.final_amount)} QR`
        : "0 QR",
      purpose: quotation?.purpose || "N/A",
      status: quotation?.status || "N/A",
      govtRefNumber: quotation?.govtRefNumber || "N/A",
      remark: quotation?.remark || "N/A",
      cancleQuotation: quotation?.isCancel ? "Yes" : "No",
      date: quotation?.date
        ? new Date(quotation.date)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", " at")
        : "N/A",
      dueDate: quotation?.dueDate
        ? new Date(quotation.dueDate)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", " at")
        : "N/A",
      academicYear: quotation?.academicYear?.year || "N/A",
    })) || [];

  // --- Handle search input changes ---
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // --- Render ---
  if (!hasFetched) {
    return (
      <Layout title={"Quotation List | Student Diwan"}>
        <AdminDashLayout>
          <div className="flex justify-center items-center h-full">
            <Spin tip="Loading..." />
          </div>
        </AdminDashLayout>
      </Layout>
    );
  }

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
                  <span className="text-gray-800 font-medium">Add New Quotation</span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FiPlus size={16} />
                  </div>
                </button>
              </ProtectedAction>
            </div>
          </div>

          {/* Data State */}
          {loading || error ? (
            <>
              {loading && (
                <div className="flex justify-center">
                  <Spin tip="Loading..." />
                </div>
              )}
              {error && <div className="text-red-500 text-center">Error: {error}</div>}
            </>
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
              <div
                className="absolute inset-0 bg-black bg-opacity-60"
                style={{ backdropFilter: "blur(8px)" }}
                onClick={() => setQuotationPreviewVisible(false)}
              />
              <div
                ref={popupRef}
                className="relative p-6 w-full max-w-[700px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
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
                <div>
                  <QuotationTemplate data={previewQuotation} ref={pdfRef} />
                </div>
              </div>
            </div>
          )}

          <ExportModalNew
            visible={isExportModalVisible}
            onClose={() => setIsExportModalVisible(false)}
            dataToExport={transformQuotationData(quotations)}
            columns={[
              { header: "S.No", dataKey: "sNo" },
              { header: "Quotation No.", dataKey: "quotationNo" },
              { header: "Receiver", dataKey: "receiver" },
              { header: "Purpose", dataKey: "purpose" },
              { header: "Discount", dataKey: "discount" },
              { header: "Total Amount", dataKey: "totalAmount" },
              { header: "Final Amount", dataKey: "finalAmount" },
              { header: "Status", dataKey: "status" },
              { header: "Date", dataKey: "date" },
              { header: "Due Date", dataKey: "dueDate" },
            ]}
            fileName={
              selectedExportRecord?.quotationNumber
                ? `Quotation_${selectedExportRecord.quotationNumber}`
                : "Quotations"
            }
            alwaysRender={true}
          />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default RecentQuotationList;
