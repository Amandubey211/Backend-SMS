import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, Button, Modal, Spin, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { cancelReceipt, fetchAllReceipts } from "../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import Layout from '../../../../Components/Common/Layout';
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';

import { downloadPDF } from '../../../../Utils/xl';
import ReceiptTemplate from '../../../../Utils/FinanceTemplate/Receipt';
import { TbInvoice } from 'react-icons/tb';
const ReceiptsList = () => {
  const dispatch = useDispatch();
  const { receipts, loading, totalRecords, totalPages } = useSelector(state => state.admin.receipts);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [pageSize, setPageSize] = useState(10); // State for page size
  const currency = useSelector((store) => store.common.user.userDetails.currency);
  const [isCancel,setIsCancel] = useState(false);
  useEffect(() => {
    dispatch(fetchAllReceipts({ page: currentPage, limit: pageSize,isCancel }));
  }, [dispatch, currentPage, pageSize,isCancel]);

  const handleCancelReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    dispatch(cancelReceipt(selectedReceipt._id)); 
    setCancelModalVisible(false);
    setSelectedReceipt(null);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize); 
  };
  const [isRecieptVisible,setRecieptVisible] = useState(false);
  const [selectedReciept,setSelectedReciept] = useState(null);
  const popupRef = useRef(null); 
    const pdfRef = useRef(null);
    const handleDownloadPDF = async (pdfRef, selectedReciept) => {
        await downloadPDF(pdfRef, selectedReciept, "Reciept")
      }
  const columns = [
    {
      title: 'Reciept Number',
      dataIndex: '_id',
      render: (text) => text?.toUpperCase(),
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      render: (text) => text,
    },
   
    {
      title: `Total Amount ${currency}`,
      render: (_,record) => {
        let total = 0;
        record.paidItems.map((i)=>{
         total += i.amountPaid
        })
        return total
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      render: (status) => {
        const color = status === 'paid' ? 'green' : status === 'partial' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentType',
    },
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      render: (paymentDate) => `${paymentDate?.slice(0,10)}`,
    },
    {
      title: 'Action',
      render: (_, record) => (
      <div className='flex flex-row items-center gap-2' >
          <TbInvoice size={20} className='cursor-pointer' title='Receipt' onClick={()=>{setSelectedReciept(record);setRecieptVisible(true)}}  />
          {!record?.isCancel ? <MdCancel size={20} onClick={() => handleCancelReceipt(record)} type="danger" title='Cancel' className='cursor-pointer'/>:<Tag color='red'>Canceled</Tag>}
        
        </div>
      ),
    },
  ];
  const navigate = useNavigate();
  const [searchText,setSearchText] = useState("")
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchAllReceipts({ page: currentPage, limit: pageSize,search:value,isCancel }));
  };
  

  return (
    <Layout title="Finance | Reciept List">
    <DashLayout>
    <div className='p-4'>
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
         <Input
            placeholder="Search by Invoice Number"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            style={{ width: 300, marginBottom: 16 }}
          />
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
          <div>
            <button className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow-lg" onClick={()=>navigate("/finance/receipts/add-new-receipt")}>Add New Reciept</button>
          </div>
         </div>
      <Table
        columns={columns}
        dataSource={receipts}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: currentPage,
          total: totalRecords,
          pageSize: pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["5","10", "20", "50", "100"],
          showTotal: (total) => `Total ${totalRecords} records`,
        }}
      />
      <Modal
        title="Cancel Receipt"
        visible={cancelModalVisible}
        onOk={handleConfirmCancel}
        onCancel={() => setCancelModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to cancel the receipt for Reciept number: {selectedReceipt?.RecieptNumber}?</p>
      </Modal>
    </div>
    {isRecieptVisible && selectedReciept && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Full-screen blur background */}
                        <div
                          className="absolute inset-0 bg-black bg-opacity-60"
                          style={{ backdropFilter: "blur(8px)" }}
                          onClick={() => setRecieptVisible(false)}
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
                              onClick={() => handleDownloadPDF(pdfRef, selectedReciept)}
                              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md hover:opacity-90"
                            >
                              Download PDF
                            </button>
                            <button
                              onClick={() => setRecieptVisible(false)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold"
                            >
                              ✕
                            </button>
                          </div>
        
                          {/* Hidden container for PDF generation */}
                          <div >
                            <ReceiptTemplate data={selectedReciept} ref={pdfRef} />
                          </div>
                        </div>
                      </div>
                    )}
    </DashLayout>
   </Layout>
  );
};

export default ReceiptsList;
