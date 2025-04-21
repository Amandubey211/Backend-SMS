import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, Button, Modal, Spin, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../Components/Common/Layout';
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';
import { fetchAllReceiptsReconciliation } from '../../../../Store/Slices/Finance/Receipts/receiptsThunks';
export default function BankReconciliationList() {
  const dispatch = useDispatch();
    const currency = useSelector((store) => store.common.user.userDetails.currency);
  const [currentPage, setCurrentPage] = useState(1); 
    const [pageSize, setPageSize] = useState(10); 
  const { receipts, loading, totalRecords, totalPages } = useSelector(state => state.admin.receipts);
  useEffect(() => {
    dispatch(fetchAllReceiptsReconciliation({ page: currentPage, limit: pageSize, pending: 'no' }))
  }, [pageSize,currentPage])
  const columns = [
    {
      title: 'Paid By',
      dataIndex: 'paidBy',
      render: (text) => text,
      width:70
    },
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      render: (text) => text?.slice(0,10),
      width:50
    },

    {
      title: `Total Amount ${currency}`,
      render: (_, record) => {
        let total = 0;
        record.paidItems.map((i) => {
          total += i.amountPaid
        })
        return total
      },
      width:70
    },
    {
      title: 'Status',
      render: (_, record) => {
        const color = record?.reconciliation?.verifyFromBank == 'verified' ? 'green' : record?.reconciliation?.verifyFromBank == 'reject' ? 'red' : 'orange';
        return <Tag color={color}>{record?.reconciliation?.verifyFromBank}</Tag>;
      },
      width:70
    },
    {
      title: 'Difference',
      render: (_, record) => {
        return <p>{record?.reconciliation?.adjustmentAmount||'-'}</p>;
      },
      width:70
    },
    {
      title: 'Reason',
      render: (_, record) => {
        return <p>{record?.reconciliation?.reason || '-'}</p>;
      },
      width:200
    },
  ];



  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize); 
  };
  
  
  const navigate = useNavigate();
  const [searchText,setSearchText] = useState("")
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchAllReceiptsReconciliation({ page: currentPage, limit: pageSize, pending: 'no',search:value }));
  };
  

  return (
    <Layout title="Finance | Reconciliation">
    <DashLayout>
    <div className='p-4'>
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
         <Input
            placeholder="Search Name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            style={{ width: 300, marginBottom: 16 }}
          />
           {/* <Select
                className="px-1 w-[10rem] mb-4"
                value={status}
                onChange={(value) => setstatus(value)}
                placeholder="Select Status"
              >
                <Select.Option value={false}>Reject</Select.Option>
                <Select.Option value={true}>Varified</Select.Option>
                <Select.Option value={true}>Resolved</Select.Option>
              </Select> */}
              </div>
          <div>
            <button className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow-lg" onClick={()=>navigate("/finance/start-reconciliation")}>Start Reconciliation</button>
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
    </div>
    </DashLayout>
   </Layout>
  );
};
