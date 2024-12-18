import React from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import StatusBadge from "./StatusBadge";

const data = [
  { key: "1", id: "0098356", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: 1214, status: "Paid" },
  { key: "2", id: "0098357", recipient: "John Doe", class: "11", section: "A", dueDate: "15/12/24", amount: 1100, status: "Unpaid" },
  { key: "3", id: "0098358", recipient: "Jane Smith", class: "12", section: "C", dueDate: "14/12/24", amount: 900, status: "Overdue" },
];

const RecentInvoice = () => {
  const navigate = useNavigate();

  const statusOrder = { Paid: 1, Unpaid: 2, Overdue: 3 };

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
      sorter: (a, b) => statusOrder[a.status] - statusOrder[b.status],
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold">Recent Invoice List</h3>
        <div className="flex items-center gap-4">
          <SearchBar />
          <button
            className="text-purple-600 font-medium"
            onClick={() => navigate("/finance/invoices/dashboard/recent-invoices")}
          >
            View more
          </button>
        </div>
      </div>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
};

export default RecentInvoice;
