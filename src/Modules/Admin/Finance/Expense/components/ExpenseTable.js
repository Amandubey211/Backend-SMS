// src/Modules/Admin/Finance/Components/ExpenseTable.js
import React from "react";
import { Table, Button } from "antd";

const ExpenseTable = () => {
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={status === "Paid" ? "text-green-600" : "text-red-600"}>
          {status}
        </span>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      category: "Salaries & Wages",
      subCategory: "Teaching Staff",
      date: "16/12/24",
      amount: "1214 QAR",
      status: "Paid",
    },
    {
      key: "2",
      category: "Utilities & Maintenance",
      subCategory: "Electricity",
      date: "15/12/24",
      amount: "345 QAR",
      status: "Unpaid",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Expense Table</h3>
        <Button type="primary" onClick={() => alert("View more clicked!")}>
          View More
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        className="w-full"
      />
    </div>
  );
};

export default ExpenseTable;
