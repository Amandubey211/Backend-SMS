import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VoucherTemplate from "../../../../Utils/FinanceTemplate/VoucherTemplate";
import { downloadPDF } from "../../../../Utils/xl";
import { fetchPayroll } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";


const PayrollSummaryTable = () => {
  const dispatch = useDispatch();
  
const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  const { allPayroll, loading,  currentPage } = useSelector(
    (store) => store.admin.payroll
  );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); // Default page size

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
 
  <>
        <div className="">
         <div className="flex flex-row items-center justify-between font-bold">
         Summary of Payroll
          <div>
            <button className="flex flex-row text-sm items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow-lg" onClick={()=>navigate("/finance/payroll/list")}>View More</button>
          </div>
         </div>
          <Table
            columns={columns}
            dataSource={allPayroll?.slice(0,5)}
            expandable={{ expandedRowRender }}
            rowKey="_id"
            loading={loading}
            pagination={false}
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
      
 </>
  );
};

export default PayrollSummaryTable;
