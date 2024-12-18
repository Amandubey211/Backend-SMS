import React from "react";
import { Table } from "antd";
import SearchBar from "./Components/SearchBar";
import StatusBadge from "./Components/StatusBadge";

const data = [
  { key: "1", id: "0098360", recipient: "Emily Davis", class: "10", section: "D", dueDate: "13/12/24", amount: 1300, status: "Paid" },
  { key: "2", id: "0098361", recipient: "Chris Brown", class: "11", section: "A", dueDate: "12/12/24", amount: 1000, status: "Unpaid" },
  { key: "3", id: "0098362", recipient: "Michael Scott", class: "12", section: "B", dueDate: "11/12/24", amount: 950, status: "Overdue" },
];

const ReturnInvoice = () => {
  const columns = [
    { title: "Invoice ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id.localeCompare(b.id) },
    { title: "Recipient Name", dataIndex: "recipient", key: "recipient", sorter: (a, b) => a.recipient.localeCompare(b.recipient) },
    { title: "Class", dataIndex: "class", key: "class", sorter: (a, b) => a.class - b.class },
    { title: "Section", dataIndex: "section", key: "section", sorter: (a, b) => a.section.localeCompare(b.section) },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate", sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate) },
    { title: "Amount", dataIndex: "amount", key: "amount", sorter: (a, b) => a.amount - b.amount },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold">Return Invoice List</h3>
        <div className="flex items-center gap-4">
          <SearchBar />
          <button className="text-purple-600 font-medium">View more</button>
        </div>
      </div>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
};

export default ReturnInvoice;
