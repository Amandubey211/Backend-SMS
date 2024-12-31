import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import {
  Alert,
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
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
import ReturnInvoice from "../../../../../../Utils/FinanceTemplate/ReturnInvoice";

const PenalityandAdjustmentList = () => {
  useNavHeading("Finance", "Return Invoice List");
  const {
    adjustmentData,
    loading,
    error,
    totalRecords,
    totalPages,
    currentPage,
    pageSize,
  } = useSelector((state) => state.admin.penaltyAdjustment);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [selectedReturnInvoice, setSelectedReturnInvoice] = useState();

  const paze_size =
    totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;
  const [computedPageSize, setComputedPageSize] = useState(paze_size);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleCancleReturnInvoice = (id) => {
    const params = {
      search: searchText,
      page: 1, // Always fetch the first page
      limit: 10, // Limit to 5 records
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    dispatch(cancleReturnInvoiceData({ params, id }));
  };

  const handleReturnPreview = (record) => {
    setSelectedReturnInvoice(record);
    setPreviewVisible(true);
  };

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
      search: searchText,
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage, pageSize, computedPageSize]);

  // Define table columns with fixed widths and ellipsis
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
      render: (value) => {
        const formattedValue = value
          ? Number.isInteger(value)
            ? value // Keep whole numbers as they are
            : value.toFixed(2) // Format decimals to two places
          : "0";
        return <span className="text-xs text-green-600">{formattedValue} QR</span>;
      },
      width: 120,
      ellipsis: true,
      sorter: (a, b) => (a.adjustmentTotal || 0) - (b.adjustmentTotal || 0),
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
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "Date",
      dataIndex: "adjustedAt",
      key: "adjustedAt",
      render: (value) => {
        if (!value) {
          return <span className="text-xs">N/A</span>; // Handle undefined/null date
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
          return <span className="text-xs">N/A</span>; // Fallback for invalid dates
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
        console.log(record);
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
            // onClick: () => console.log("Send Mail", record),
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

  // Transform adjustments data to table dataSource and limit to 10 records
  const dataSource = adjustmentData?.map((adjustment) => ({
    key: adjustment?._id,
    return_invoice_no: adjustment?.returnInvoiceNumber || "N/A",
    invoice_no: adjustment?.invoiceId?.invoiceNumber || "N/A",
    receiver: adjustment?.invoiceId?.receiver?.name || "N/A",
    adjustmentAmount: adjustment?.adjustmentAmount || 0,
    adjustmentTotal: adjustment?.adjustmentTotal || 0,
    status: adjustment?.isCancel ? "Cancelled" : "Active", // Use optional chaining
    adjustedAt: adjustment?.adjustedAt || "N/A",
    ...adjustment, // Spread other properties safely

  }));


  const transformAdjustmentData = (adjustmentData) =>
    adjustmentData?.map(({ _id, ...adjustment }, index) => ({
      sNo: index + 1,
      returnInvoiceNumber: adjustment?.returnInvoiceNumber || "N/A",
      refInvoiceNumber: adjustment?.invoiceId?.invoiceNumber || "N/A",
      receiver: adjustment?.invoiceId?.name || "N/A",
      receiverEmail: adjustment?.invoiceId?.email || "N/A",
      receiverPhone: adjustment?.invoiceId?.phone || "N/A",
      receiverAddress: adjustment?.invoiceId?.address || "N/A",
      tax: `${parseFloat(adjustment?.tax)} %` || 0,
      discount:
        (adjustment?.discountType === "percentage"
          ? `${parseFloat(adjustment?.discount)} %`
          : `${parseFloat(adjustment?.discount)} QR`) || 0,
      discountType: parseFloat(adjustment?.discountType) || "percentage",
      penalty: `${parseFloat(adjustment?.adjustmentPenalty)} QR` || 0,
      totalAmount: `${parseFloat(adjustment?.adjustmentTotal)} QR` || 0,
      finalAmount: `${parseFloat(adjustment?.adjustmentAmount)} QR` || 0,
      createdBy: adjustment?.adjustedBy?.adminName || "N/A",
      Date: adjustment?.adjustedAt || "N/A",
      academicYearDetails: adjustment?.academicYear?.year || "N/A",
    })) || [];


  return (
    <Layout title={"Penality & Adjustment List | Student Diwan"}>
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
              }}
            />
            <div className="flex justify-end items-center gap-2">
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => setIsExportModalVisible(true)}
                className="flex items-center bg-gradient-to-r  from-pink-500 to-pink-400 text-white border-none hover:from-pink-600 hover:to-pink-500 transition duration-200 text-xs px-4 py-2 rounded-md shadow-md"
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
              pagination={{
                current: currentPage,
                total: totalRecords,
                pageSize: computedPageSize,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "10", "20", "50"],
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
          <ExportModal
            visible={isExportModalVisible}
            onClose={() => setIsExportModalVisible(false)}
            dataToExport={transformAdjustmentData(adjustmentData)}
            title="Return Receipt Data"
            sheet="return_receipt_report"
          />
          <Modal
            visible={isPreviewVisible}
            title="Return Invoice Preview"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width={800}
          >
            <ReturnInvoice data={selectedReturnInvoice} />
          </Modal>
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default PenalityandAdjustmentList;
