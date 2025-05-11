import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { FaFileExport, FaFileInvoice } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PayrollTemplate from "../../../../Utils/FinanceTemplate/PayrollTemplate";
import { downloadPDF } from "../../../../Utils/xl";
import { GiTakeMyMoney } from "react-icons/gi";
import {
  fetchPayroll,
  deletePayroll,
  updatePayroll,
} from "../../../../Store/Slices/Finance/payroll/payroll.thunk";
import { isCancel } from "axios";
import Sidebar from "../../../../Components/Common/Sidebar";
import EditPayRoll from "./EditPayRoll";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
const PayrollList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector(
    (store) => store.common.user.userDetails?.currency
  );
  const { allPayroll, loading, currentPage, totalRecords, totalPages } =
    useSelector((store) => store.admin.payroll);
  const [fileTitle, setFileTitle] = useState('');
  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCancel, setIsCancel] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    dispatch(
      fetchPayroll({
        page: currentPage || 1,
        search: searchText,
        limit: computedPageSize,
        isCancel,
        status
      })
    );
  }, [isCancel,status]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchPayroll({ page: 1, search: value, limit: computedPageSize,isCancel,status }));
  };

  const handleCancelrecord = (record) => {
    setSelectedInvoice(record);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    dispatch(updatePayroll({ isCancel: true, id: selectedInvoice._id }));
    setCancelModalVisible(false);
    setSelectedInvoice(null);
  };

  const columns = [
    {
      title: "Slip Number",
      dataIndex: "voucherNumber",
      key: "voucherNumber",
      render: (InvoiceNumber) => `${InvoiceNumber}` || "N/A",
    },
    {
      title: "Staff",
      dataIndex: "staffDetails",
      key: "staffDetails",
      render: (staffDetails) =>
        staffDetails
          ? `${staffDetails?.firstName} ${staffDetails?.lastName}`
          : "N/A",
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
        const color = status == "paid" ? "green" : "yellow";
        const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        return <Tag color={color}>{capitalizedStatus}</Tag>;
      },
    },    
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex items-center flex-row gap-2">
            <button
              title="Invoice"
              onClick={() => {
                setSelectedInvoice(record);
                setInvoiceVisible(true);
              }}
            >
              <FaFileInvoice size={20} />
            </button>

            {["paid", "partial"].includes(record.status) &&
              !record?.isCancel && (
                <button title="Cancel" onClick={() => handleCancelrecord(record)}>
                  <MdClose size={20} />
                </button>
              )}

            {["pending", "hold", "partial"].includes(record.status) &&
              !record?.isCancel && (
                <button title="Edit" onClick={()=>{setSelectedInvoice(record);setIsModalVisible(true)}}>
                  <MdOutlineEdit size={20} />
                </button>
              )}

            {record?.isCancel && <Tag color="red">Canceled</Tag>}
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
  const [isInvoiceVisible, setInvoiceVisible] = useState(false);
  const popupRef = useRef(null);
  const pdfRef = useRef(null);

  const handleDownloadPDF = async (pdfRef, selectedInvoice) => {
    await downloadPDF(pdfRef, selectedInvoice, "Voucher");
  };
    const [exportModel, setExportModel] = useState(false);
  const downloadexcel = () => {
    if(!fileTitle){
      toast.error("Please Enter File Name");
      return
    }
      let fileName = `${fileTitle}.xlsx`;
      let sheet = "sheet1"
      let formattedData = []
      allPayroll?.map((row) => {
      row.lineItems.map((li) => {
      formattedData.push({
      "Name": `${row.staffDetails?.firstName} ${row.staffDetails?.lastName}`,
      "Role": row.staffDetails?.role,
      Email: row.staffDetails?.email,
      Contact: row.staffDetails?.mobileNumber,
      Date: row.createdAt?.slice(0, 10),
      Category: li?.name,
      "Salary Month": li?.salaryMonth,
      "Sub Category": li?.subCategory,
      "Basic Salary": li?.basicSalary,
      "Allowances": li?.allowances,
      "Deductions": li?.deductions,
      "Bonus": li?.bonus,
      "Overtime": li?.overtime,
      "Leave Deductions": li?.leaveDeductions,
      "Other Adjustments": li?.otherAdjustments,
      "Net Salary": li?.netSalary,
      "Status": row?.status,
          })
        })
      }
      );
  
      // Step 3: Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
      // Step 4: Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet);
  
      // Step 5: Write the workbook directly to file
      XLSX.writeFile(workbook, fileName); // Automatically triggers the file download
  
    }
  return (
    <Layout title="Finance | Payroll List">
      <AdminDashLayout>
        <div className="p-4">
          <div className="flex flex-row items-center justify-between">
            <div>
            <Input
              placeholder="Search by Name , Email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              style={{ width: 300, marginBottom: 16 }}
            />
            <Select
                            className="px-1 w-[10rem] mb-4"
                            value={status}
                            onChange={(value) => setStatus(value)}
                            placeholder="Select Status"
                          >
                            <Select.Option value=''>All</Select.Option>
                            <Select.Option value='paid'>Paid</Select.Option>
                            <Select.Option value='Pending'>Pending</Select.Option>
                            <Select.Option value='Hold'>Hold</Select.Option>
                          </Select>
              <Select
                className="px-1 w-[10rem] mb-4"
                value={isCancel}
                onChange={(value) => setIsCancel(value)}
                placeholder="Select Status"
              >
                <Select.Option value={false}>Active</Select.Option>
                <Select.Option value={true}>Canceled</Select.Option>
              </Select>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              {selectedIds?.length > 0 && (
                <button
                  className="flex flex-row items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg mb-4"
                  onClick={() => dispatch(deletePayroll(selectedIds))}
                >
                  Delete <MdDeleteOutline />
                </button>
              )}
              <button className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-2 rounded-lg shadow-lg mb-4" onClick={() => { setExportModel(true) }}><FaFileExport /> Export</button>
              
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
            dataSource={allPayroll}
            expandable={{ expandedRowRender }}
            rowSelection={{
              selectedRowKeys: selectedIds,
              onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys),
              getCheckboxProps: (record) => ({
                disabled: record.isCancel
                  ? true
                  : ["pending", "hold"].includes(record.status)
                  ? false
                  : true,
              }),
            }}
            pagination={{
              current: currentPage,
              total: totalRecords,
              pageSize: computedPageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50","100","200","500"],
              size: "small",
              showTotal: () =>
                `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
              onChange: (page, pageSize) => {
                dispatch(
                  fetchPayroll({
                    page,
                    search: searchText,
                    limit: pageSize,
                    isCancel,
                    status
                  })
                );
              },
              onShowSizeChange: (current, size) => {
                setComputedPageSize(size);
                dispatch(
                  fetchPayroll({
                    page: 1,
                    search: searchText,
                    limit: size,
                    isCancel,status
                  })
                );
              },
            }}
            rowKey="_id"
            loading={loading}
          />
        </div>

        <Modal
          title="Cancel record"
          visible={cancelModalVisible}
          onOk={handleConfirmCancel}
          onCancel={() => setCancelModalVisible(false)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Are you sure you want to cancel the record?</p>
        </Modal>
          <Modal
                  title="Export Data"
                  visible={exportModel}
                  onOk={() => downloadexcel()}
                  onCancel={() => setExportModel(false)}
                  okText="Export"
                  cancelText="Cancel"
                > 
                <div className="flex flex-row gap-2 items-center ">
                <Input placeholder="File Name.." className="w-[18rem]" onChange={(e)=>setFileTitle(e.target.value)}/><span className="text-lg">.xlsx</span>
                </div>
                
                  <p>Only the data that matches the filters you have applied will be exported.</p>
                  <p>Export is limited to the current page based on the selected page limit.</p>
        
                </Modal>

        {isInvoiceVisible && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black bg-opacity-60"
              style={{ backdropFilter: "blur(8px)" }}
              onClick={() => setInvoiceVisible(false)}
            />
            <div
              ref={popupRef}
              className="relative p-6 w-full max-w-[70vw] max-h-[90vh] bg-white rounded-md shadow-md overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
              <div>
                <PayrollTemplate data={selectedInvoice} ref={pdfRef} />
              </div>
            </div>
          </div>
        )}
        <Sidebar title="Update Payroll" width="70%" isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <EditPayRoll data= {selectedInvoice}/>
        </Sidebar>
      </AdminDashLayout>
    </Layout>
  );
};

export default PayrollList;
