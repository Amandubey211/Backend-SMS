import React, { useEffect, useState } from 'react'
import { fetchAllReceiptsReconciliation } from '../../../../Store/Slices/Finance/Receipts/receiptsThunks';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Dropdown, Tag, Spin } from "antd";
export default function BankReconciliationSummary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currency = useSelector((store) => store.common.user.userDetails.currency);

const { receipts = [], loading, error, pagination = {} } = useSelector(
    (state) => state.admin.receipts || {}
  );

  useEffect(() => {
    dispatch(fetchAllReceiptsReconciliation({ page: 1, limit: 5, pending: 'no' }))
  }, [])
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

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        {/* Title with counts */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
          Recent Reconciliation List
        </h2>

        {/* View More Button with counts */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>

          <button
            onClick={() => navigate("/finance/bank-reconciliation/list")}
            className="px-3 py-1 rounded-md border border-gray-400 shadow-md hover:shadow-md hover:shadow-gray-300 transition duration-200 text-white bg-gradient-to-r from-pink-500 to-purple-500"
          >
            View More
          </button>

        </div>
      </div>
      <Table
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={receipts}
        size="small"
        pagination={false}
        loading={{
                      spinning: loading,
                      indicator: <Spin size="large" />,
                      tip: "Loading...",
                    }}
      />
    </div>
  );
}