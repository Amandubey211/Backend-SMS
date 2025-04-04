import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { FaFileInvoice } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PayrollTemplate from "../../../../Utils/FinanceTemplate/PayrollTemplate";
import { downloadPDF } from "../../../../Utils/xl";
import { GiTakeMyMoney } from "react-icons/gi";
import { fetchPayroll } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";

const PayrollList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
 
  const { allPayroll, loading,  currentPage,totalRecords,totalPages } = useSelector(
      (store) => store.admin.payroll
    );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); 
  useEffect(() => {
    dispatch(fetchPayroll({ page: currentPage || 1, search: searchText, limit: computedPageSize }));
  }, [dispatch, currentPage, computedPageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchPayroll({ page: 1, search: value, limit: computedPageSize }));
  };

  const columns = [
     {
       title: "Voucher",
       dataIndex: "voucherNumber",
       key: "voucherNumber",
       render: (InvoiceNumber) => `${InvoiceNumber}` || "N/A",
     },
     {
       title: "Staff",
       dataIndex: "staffDetails",
       key: "staffDetails",
       render: (staffDetails) =>
         staffDetails ? `${staffDetails?.firstName} ${staffDetails?.lastName}` : "N/A",
     },
     {
       title: "Total Amount",
       key: "total_amount",
       render: (_, record) =>
         `${record?.lineItems?.reduce((sum, item) => sum + item.netSalary, 0)} ${schoolCurrency}`,
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
         title: "Salary Month",
         dataIndex: "salaryMonth",
         key: "salaryMonth",
       },
       {
         title: "Net Salary",
         dataIndex: "netSalary",
         key: "netSalary",
         render: (netSalary) => `${netSalary?.toFixed(2)} ${schoolCurrency}`,
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
    <Layout title="Finance | Payroll List">
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
              onClick={() => navigate("/finance/add/payroll")}
              className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2 mb-4"
            >
              <span className="text-gray-800 font-medium">Create Payroll</span>
              <div className="w-12 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <GiTakeMyMoney size={20} />
              </div>
            </button>
          </div>
         </div>
          <Table
            columns={columns}
            dataSource={ allPayroll}
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
                dispatch(fetchPayroll({ page, search: searchText, limit:pageSize }));
              },
              onShowSizeChange: (current, size) => {
                setComputedPageSize(size); // Update local state
                dispatch(fetchPayroll({ page: 1, search: searchText, limit: size }));
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
                            <PayrollTemplate data={selectedInvoice} ref={pdfRef} />
                          </div>
                        </div>
                      </div>
                    )}
      </AdminDashLayout>
    </Layout>
  );
};

export default PayrollList;
