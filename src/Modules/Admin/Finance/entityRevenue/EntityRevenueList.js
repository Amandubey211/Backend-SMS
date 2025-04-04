import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { FaFileInvoice } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import RecentInvoiceTemplate from "../../../../Utils/FinanceTemplate/RecentInvoiceTemplate";
import { downloadPDF } from "../../../../Utils/xl";
import { fetchAllEntityRevenue } from "../../../../Store/Slices/Finance/EntityRevenue/EntityRevenue.thunk";

const SummaryRevenueList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  // Get data from Redux
  const { allEntityRevenue:incomes, loading, totalRecords, totalPages, currentPage } = useSelector(
    (state) => state.admin.entityRevenue
  );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); // Default page size

  useEffect(() => {
    dispatch(fetchAllEntityRevenue({ page: currentPage || 1, search: searchText, limit: computedPageSize }));
  }, [dispatch, currentPage, computedPageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchAllEntityRevenue({ page: 1, search: value, limit: computedPageSize }));
  };

  const columns = [
    {
      title: "Invoice",
      dataIndex: "InvoiceNumber",
      key: "InvoiceNumber",
      render: (InvoiceNumber) => `${InvoiceNumber}` || "N/A",
    },
    {
      title: "Entity",
      dataIndex: "entityDetails",
      key: "entityDetails",
      render: (entityDetails) =>
        entityDetails ? `${entityDetails?.entityName}` : "N/A",
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
        const color = status === "paid" ? "green" : status === "unpaid" ? "red" : "yellow";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_,record) => {
     
        return (
        <div className="flex items-center flex-row gap-2">
        <button title="Invoice" onClick={()=>{
          setSelectedInvoice(record);
          setInvoiceVisible(true)
        }}><FaFileInvoice size={20}/></button>
        <button title="Edit"><MdOutlineEdit size={20}/></button>
        <button title="Delete"><MdDeleteOutline size={20}/></button>
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
  const [isInvoiceVisible,setInvoiceVisible] = useState(false);
  const [selectedInvoice,setSelectedInvoice] = useState(null);
  const popupRef = useRef(null); 
    const pdfRef = useRef(null);
    const handleDownloadPDF = async (pdfRef, selectedInvoice) => {
        await downloadPDF(pdfRef, selectedInvoice, "Invoice")
      }
  return (
    <Layout title="Finance | Entity Revenue List">
      <AdminDashLayout>
        <div className="p-4">
         <div className="flex flex-row items-center justify-between">
         <Input
            placeholder="Search by Name , Email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            style={{ width: 300, marginBottom: 16 }}
          />
          <div>
            <button className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow-lg" onClick={()=>navigate("/finance/entity/add/revenue")}>Add New Invoice</button>
          </div>
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
                dispatch(fetchAllEntityRevenue({ page, search: searchText, limit:pageSize }));
              },
              onShowSizeChange: (current, size) => {
                setComputedPageSize(size); // Update local state
                dispatch(fetchAllEntityRevenue({ page: 1, search: searchText, limit: size }));
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
                          className="relative p-6 w-full max-w-[800px] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
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
                          <div >
                            <RecentInvoiceTemplate data={selectedInvoice} ref={pdfRef} />
                          </div>
                        </div>
                      </div>
                    )}
      </AdminDashLayout>
    </Layout>
  );
};

export default SummaryRevenueList;
