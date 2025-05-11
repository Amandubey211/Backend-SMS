import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag, Select, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { FaFileExport, FaFileInvoice } from "react-icons/fa";
import { MdClose, MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import VoucherTemplate from "../../../../Utils/FinanceTemplate/VoucherTemplate";
import { downloadPDF } from "../../../../Utils/xl";
import { deleteOperationalExpenses, fetchOperationalExpenses, updateOperationalExpenses } from "../../../../Store/Slices/Finance/operationalExpenses/operationalExpenses.thunk";
import { GiTakeMyMoney } from "react-icons/gi";
import Sidebar from "../../../../Components/Common/Sidebar";
import EditOperationalExpenses from "./EditExpense";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
const ExpenseList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  const [isCancel, setIsCancel] = useState(false);
  const [status, setStatus] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [exportModel, setExportModel] = useState(false);
  const { allOperationalExpense, loading, currentPage, totalRecords, totalPages } = useSelector(
    (store) => store.admin.operationalExpenses
  );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); // Default page size

  useEffect(() => {
    dispatch(fetchOperationalExpenses({ page: currentPage || 1, search: searchText, limit: computedPageSize, isCancel,status }));
  }, [status, isCancel]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchOperationalExpenses({ page: 1, search: value, limit: computedPageSize, isCancel,status }));
  };
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const handleCancelrecord = (record) => {
    setSelectedInvoice(record);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    dispatch(updateOperationalExpenses({ isCancel: true, id: selectedInvoice._id }));
    setCancelModalVisible(false);
    setSelectedInvoice(null);
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
      render: (_, record) => `${record?.lineItems?.reduce((sum, item) => sum + item.paidAmount, 0)} ${schoolCurrency}`,
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
            <button title="Invoice" onClick={() => {
              setSelectedInvoice(record);
              setInvoiceVisible(true)
            }}><FaFileInvoice size={20} /></button>

            {
              ["paid", "partial"].includes(record.status) && !record?.isCancel ? <>
                <button title="Cancel" onClick={() => handleCancelrecord(record)}><MdClose size={20} /></button>
              </> : null
            }
            {
              ["pending", "hold", "partial"].includes(record.status) && !record?.isCancel ? <button title="Edit" onClick={() => { setSelectedInvoice(record); setIsModalVisible(true) }}><MdOutlineEdit size={20} /></button> : null
            }
            {
              record?.isCancel ?
                <Tag color='red'>Canceled</Tag> : null}

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
  const [isInvoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const popupRef = useRef(null);
  const pdfRef = useRef(null);
  const handleDownloadPDF = async (pdfRef, selectedInvoice) => {
    await downloadPDF(pdfRef, selectedInvoice, "Voucher")
  };
  const downloadexcel = () => {
    if (!fileTitle) {
      toast.error("Please Enter File Name");
      return
    }
    let fileName = `${fileTitle}.xlsx`;
    let sheet = "sheet1"
    let formattedData = []
    allOperationalExpense?.map((row) => {
      row.lineItems.map((li) => {
        formattedData.push({
          "Entity Name": row.entityDetails?.entityName,
          "Entity Type": row.entityDetails?.entityType,
          Email: row.entityDetails?.email,
          Contact: row.entityDetails?.contactNumber,
          Date: row.createdAt?.slice(0, 10),
          Category: li.name,
          "Sub Category": li.subCategory || 'N/A',
          "Sub Category": li.subCategory,
          "Rate": li.rate,
          "Quantity": li.quantity,
          "Unit": li.unit,
          "Amount": li.amount,
          "Paid Amount": li.paidAmount,
          "Remaining Amount": li.remainingAmount,
          "Frequency": li.frequency,
          "Start Date": li?.startDate?.slice(0, 10) || 'N/A',
          "End Date": li?.endDate?.slice(0, 10) || 'N/A',
          "Due Date": li?.dueDate?.slice(0, 10) || 'N/A',
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
    <Layout title="Finance | Expense List">
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
                <Select.Option value='partial'>Partial</Select.Option>
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
              {selectedIds?.length > 0 && <button className="flex flex-row items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg mb-4" onClick={() => dispatch(deleteOperationalExpenses((selectedIds)))}>Delete <MdDeleteOutline /></button>}
              <button className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-2 rounded-lg shadow-lg mb-4" onClick={() => { setExportModel(true) }}><FaFileExport /> Export</button>
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
            dataSource={allOperationalExpense}
            expandable={{ expandedRowRender }}
            rowSelection={{
              selectedRowKeys: selectedIds,
              onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys),
              getCheckboxProps: (record) => ({
                disabled: record.isCancel ? true : ["pending", "hold"].includes(record.status) ? false : true,
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
                dispatch(fetchOperationalExpenses({ page, search: searchText, limit: pageSize, isCancel,status }));
              },
              onShowSizeChange: (current, size) => {
                setComputedPageSize(size); // Update local state
                dispatch(fetchOperationalExpenses({ page: 1, search: searchText, limit: size, isCancel,status }));
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
          <p>Are you sure you want to cancel the record</p>
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
            <Input placeholder="File Name.." className="w-[18rem]" onChange={(e) => setFileTitle(e.target.value)} /><span className="text-lg">.xlsx</span>
          </div>

          <p>Only the data that matches the filters you have applied will be exported.</p>
          <p>Export is limited to the current page based on the selected page limit.</p>

        </Modal>
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
              <div >
                <VoucherTemplate data={selectedInvoice} ref={pdfRef} />
              </div>
            </div>
          </div>
        )}
        <Sidebar title="Update Expense" width="70%" isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <EditOperationalExpenses data={selectedInvoice} />
        </Sidebar>
      </AdminDashLayout>
    </Layout>
  );
};

export default ExpenseList;
