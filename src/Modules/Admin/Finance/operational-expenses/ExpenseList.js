import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { FaFileInvoice } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import VoucherTemplate from "../../../../Utils/FinanceTemplate/VoucherTemplate";
import { downloadPDF } from "../../../../Utils/xl";
import { fetchOperationalExpenses } from "../../../../Store/Slices/Finance/operationalExpenses/operationalExpenses.thunk";
import { GiTakeMyMoney } from "react-icons/gi";

const ExpenseList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
 
  const { allOperationalExpense, loading,  currentPage,totalRecords,totalPages } = useSelector(
      (store) => store.admin.operationalExpenses
    );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); // Default page size

  useEffect(() => {
    dispatch(fetchOperationalExpenses({ page: currentPage || 1, search: searchText, limit: computedPageSize }));
  }, [dispatch, currentPage, computedPageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchOperationalExpenses({ page: 1, search: value, limit: computedPageSize }));
  };

  const columns = [
      {
        title: "Voucher",
        dataIndex: "voucherNumber",
        key: "voucherNumber",
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
        title: "Total paid",
        dataIndex: "paidAmount",
        key: "paidAmount",
        render: (_, record) =>`${record?.lineItems?.reduce((sum, item) => sum + item.paidAmount, 0)} ${schoolCurrency}`,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const color = status === "paid" ? "green"  : "yellow";
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
  
    const expandedRowRender = (record) => {
      const lineItemsColumns = [
        {
          title: "Item Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Sub Category",
          dataIndex: "subCategory",
          key: "subCategory",
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
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          render: (rate) => `${rate?.toFixed(2)} ${schoolCurrency}`,
        },
        {
          title: "Paid Amount",
          dataIndex: "paidAmount",
          key: "paidAmount",
          render: (paidAmount) => `${paidAmount?.toFixed(2)} ${schoolCurrency}`,
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
        await downloadPDF(pdfRef, selectedInvoice, "Voucher")
      }
  return (
    <Layout title="Finance | Expense List">
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
          <button
              onClick={() => navigate("/finance/add/operational-expenses")}
              className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2 mb-4"
            >
              <span className="text-gray-800 font-medium">Create Expenses</span>
              <div className="w-12 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <GiTakeMyMoney size={20} />
              </div>
            </button>
          </div>
         </div>
          <Table
            columns={columns}
            dataSource={ allOperationalExpense}
            expandable={{ expandedRowRender }}
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
                dispatch(fetchOperationalExpenses({ page, search: searchText, limit:pageSize }));
              },
              onShowSizeChange: (current, size) => {
                setComputedPageSize(size); // Update local state
                dispatch(fetchOperationalExpenses({ page: 1, search: searchText, limit: size }));
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
                            <VoucherTemplate data={selectedInvoice} ref={pdfRef} />
                          </div>
                        </div>
                      </div>
                    )}
      </AdminDashLayout>
    </Layout>
  );
};

export default ExpenseList;
