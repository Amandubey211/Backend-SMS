import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Button, Spin, Alert, Tooltip, Tag, Input, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneStudentFee } from "../../../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import { FaDollarSign, FaExclamationCircle, FaFileInvoice, FaHistory, FaWallet } from "react-icons/fa";
import toast from "react-hot-toast";
import RecentInvoiceTemplate from "../../../../../../Utils/FinanceTemplate/RecentInvoiceTemplate";
import { downloadPDF } from "../../../../../../Utils/xl";
import StudentCard from "../../../../Finance/StudentFees/Components/StudentCard";
import dayjs from "dayjs";
import { deleteData } from "../../../../../../services/apiEndpoints";
const { RangePicker } = DatePicker;
const StudentFinance = ({ studentId }) => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  // Get data from Redux
  const { fees: incomes, loading, totalRecords, totalPages, currentPage, totalAllAmount, paidAllAmount, categories } = useSelector(
    (state) => state.admin.studentFees
  );

  const [computedPageSize, setComputedPageSize] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [overDue, setOverDue] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const handleDates = (dates) => {
    deleteData(dates);

    if (!dates) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    const [startDate, endDate] = dates;
    setStartDate(startDate ? dayjs(startDate).format("YYYY-MM-DD") : null);
    setEndDate(endDate ? dayjs(endDate).format("YYYY-MM-DD") : null);
  };


  useEffect(() => {
    dispatch(fetchOneStudentFee({
      studentId, page: currentPage || 1,
      limit: computedPageSize, startDate, endDate, overDue, subCategory, status
    }))
  }, [dispatch, currentPage, computedPageSize, subCategory, startDate, endDate, overDue, status, studentId]);
  const columns = [
    {
      title: "Invoice",
      dataIndex: "InvoiceNumber",
      key: "InvoiceNumber",
      render: (InvoiceNumber) => {
        const copyToClipboard = () => {
          navigator.clipboard.writeText(InvoiceNumber);
          toast.success("Invoice number copied!");
        };

        return InvoiceNumber ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>{InvoiceNumber}</span>
            <Tooltip title="Copy">
              <CopyOutlined
                onClick={copyToClipboard}
                style={{ cursor: "pointer", color: "#1890ff" }}
              />
            </Tooltip>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: "Total Amount",
      key: "total_amount",
      render: (_, record) =>
        `${record?.lineItems?.reduce((sum, item) => sum + item.amount, 0)} ${schoolCurrency}`,
    },
    {
      title: "Total Paid",
      key: "paid_amount",
      render: (_, record) =>
        `${record?.lineItems?.reduce((sum, item) => sum + item.paid_amount, 0)} ${schoolCurrency}`,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const color = status === "paid" ? "green" : status === "Unpaid" ? "red" : "yellow";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {

        return (
          <div className="flex items-center flex-row gap-2">
            <button title="Invoice" onClick={() => {
              setSelectedInvoice(record);
              setInvoiceVisible(true)
            }}><FaFileInvoice size={20} /></button>
          </div>
        );
      },
    },
  ];

  // Define expandable row for lineItems
  const expandedRowRender = (record) => {
    const lineItemsColumns = [
      {
        title: "Item Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        render: (quantity) => quantity || 1,
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        render: (rate) => `${rate?.toFixed(2)} ${schoolCurrency}`,
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        render: (discount, record) =>
          record.discountType === "percentage" ? `${discount}%` : `${discount} ${schoolCurrency}`,
      },
      {
        title: "Tax",
        dataIndex: "tax",
        key: "tax",
        render: (tax) => `${tax?.toFixed(2)} ${schoolCurrency}`,
      },
      {
        title: "Final Amount",
        dataIndex: "final_amount",
        key: "final_amount",
        render: (amount) => `${amount?.toFixed(2)} ${schoolCurrency}`,
      },
    ];

    return (
      <Table
        columns={lineItemsColumns}
        dataSource={record.lineItems}
        pagination={false}
        size="small"
        rowKey="_id"
        className="mb-6"
      />
    );
  };
  const navigate = useNavigate();
  const [isInvoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const popupRef = useRef(null);
  const pdfRef = useRef(null);
  const handleDownloadPDF = async (pdfRef, selectedInvoice) => {
    await downloadPDF(pdfRef, selectedInvoice, "Invoice")
  }
  const cardData = [
    {
      title: "Paid Fees",
      value: `${paidAllAmount?.toFixed(2) || 0} ${schoolCurrency}`,
      icon: <FaWallet />,
    },
    {
      title: "Unpaid Fees",
      value: `${(paidAllAmount <= totalAllAmount) ? (totalAllAmount - paidAllAmount)?.toFixed(2) || 0 : 0} ${schoolCurrency}`,
      icon: <FaExclamationCircle />
    },
    {
      title: "Total Fess",
      value: `${totalAllAmount?.toFixed(2) || 0} ${schoolCurrency}`,
      icon: <FaDollarSign />
    },
  ]
  const clearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setOverDue(false);
    setSubCategory('');
    setStatus('');
    setDateRange([]);
  }
  return (
    <>
      <div className="p-4">
        <div className="flex flex-row items-center">

          <Select
            className="px-1 w-[10rem] mb-4"
            value={subCategory}
            onChange={(value) => setSubCategory(value)}
            placeholder="Category"
          >
            <Select.Option value={''}>All Category</Select.Option>
            {
              categories?.map((i) => (<Select.Option value={i?.categoryId}>{i?.categoryName}</Select.Option>))
            }


          </Select>
          <Select
            className="px-1 w-[10rem] mb-4"
            value={status}
            onChange={(value) => setStatus(value)}
            placeholder="Status"
          >
            <Select.Option value=''>Status - All</Select.Option>
            <Select.Option value='Paid'>Paid</Select.Option>
            <Select.Option value='Unpaid'>Unpaid</Select.Option>
            <Select.Option value='Partial'>Partial</Select.Option>
          </Select>
          <Select
            className="px-1 w-[10rem] mb-4"
            value={overDue}
            onChange={(value) => setOverDue(value)}
            placeholder="Over Due"
          >
            <Select.Option value={false}>All (Including Over Due)</Select.Option>
            <Select.Option value={true}>Only Over Due</Select.Option>
          </Select>
          <RangePicker
            className="w-[15rem] mb-4"
            onChange={(dates) => handleDates(dates)}

            format="YYYY-MM-DD"
          />
          <button className="w-[10rem] mb-4 border border-gray-300 text-sm ml-2 h-8 rounded-lg"
            onClick={() => clearFilter()}
          >Clear Filters</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 place-items-center">
          {cardData?.map((item, index) => (<StudentCard key={index} title={item.title} value={item.value} icon={item.icon} />))}
        </div>
        <Table
          columns={columns}
          dataSource={incomes}
          expandable={{ expandedRowRender }}
          pagination={{
            current: currentPage, // Use currentPage from API response
            total: totalRecords,
            pageSize: computedPageSize,
            showSizeChanger: true, // Enable size changer
            pageSizeOptions: ["5", "10", "20", "50"], // Define page size options
            size: "small",
            showTotal: () =>
              `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
            onChange: (page, pageSize) => {
              dispatch(fetchOneStudentFee({ studentId, page: currentPage || 1, limit: computedPageSize, startDate, endDate, overDue }));
            },
            onShowSizeChange: (current, size) => {
              setComputedPageSize(size); // Update local state
              dispatch(fetchOneStudentFee({
                studentId, page: currentPage || 1,
                limit: computedPageSize, startDate, endDate, overDue, subCategory, status
              }));
            },
          }}
          rowKey="_id"
          loading={loading}
        />
      </div>
      {isInvoiceVisible && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Full-screen blur background */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            style={{ backdropFilter: "blur(8px)" }}
            onClick={() => setInvoiceVisible(false)}
          />
          {/* Centered content */}
          <div
            ref={popupRef}
            className="relative p-6 w-full max-w-[70vw] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-end space-x-2 mb-4">
              <button
                onClick={() => handleDownloadPDF(pdfRef, selectedInvoice)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md hover:opacity-90"
              >
                Download PDF
              </button>
              <button
                onClick={() => setInvoiceVisible(false)}
                className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Hidden container for PDF generation */}
            <div className="flex flex-row w-full gap-2">
              <div className="w-[80%]">
                <RecentInvoiceTemplate data={selectedInvoice} ref={pdfRef} />
              </div>
              <div className="w-[20%]">
                <div className="px-4 py-2  font-semibold rounded-md  flex items-center justify-center mb-2 gap-2" >History <FaHistory /></div>
                <div className="px-4 py-2 border border-purple-500 text-black font-semibold rounded-md hover:bg-gradient-to-r from-pink-500 to-purple-500 hover:text-white flex items-center justify-center flex-col mb-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedInvoice({ ...selectedInvoice, lineItems: selectedInvoice?.currentItmes?.length > 0 ? selectedInvoice?.currentItmes : selectedInvoice?.lineItems }) }}>
                  <p className="text-md">Current Verion</p>
                </div>
                {selectedInvoice?.history?.map((i) => (<div className="px-4 py-2 border border-purple-500 text-black font-semibold rounded-md hover:bg-gradient-to-r from-pink-500 to-purple-500 hover:text-white flex items-center justify-center flex-col mb-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedInvoice({ ...selectedInvoice, lineItems: i?.oldData?.lineItems, currentItmes: selectedInvoice?.lineItems }) }}>{i?.updatedAt?.slice(11, 16)}, {i?.updatedAt?.slice(0, 10)}</div>))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentFinance;
