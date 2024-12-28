import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { Table, Input, Button, Tooltip, Spin, Alert } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { fetchInvoice } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";

const ReturnInvoice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { loading, error, invoices } = useSelector((store) => store.admin.invoices);
 
  // Filtered data based on search query
  const filteredData = invoices?.filter(
    (item) =>
      item?.invoiceNumber?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.receiver?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.finalAmount?.toString()?.includes(searchQuery.toLowerCase())
  );

  // Define Ant Design columns
  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (invoiceNumber) => `-${invoiceNumber.slice(-5)}`,
    },
    {
      title: "Recipient Name",
      dataIndex: "receiver",
      key: "receiver",
      render: (receiver) => receiver?.name || "N/A",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => (dueDate ? moment(dueDate).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (finalAmount) => finalAmount?.toFixed(2)+  ' QR',
      sorter: (a, b) => a.finalAmount - b.finalAmount,
    },
    {
      title: "Category",
      dataIndex: "lineItems",
      key: "lineItems",
      render: (lineItems) =>
        lineItems?.length ? (
          <>
            {lineItems[0]?.revenueType}{" "}
            {lineItems[1]?.revenueType && <span><br/>{lineItems[1]?.revenueType}</span>}
          </>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let style = {};
        let text = "Active";
        if (record.isReturn) {
          style = { backgroundColor: "#F3EAFF", color: "#3F2FF2" };
          text = "Return";
        } else if (record.isCancel) {
          style = { backgroundColor: "#FFE6E5", color: "#E70F00" };
          text = "Cancel";
        } else {
          style = { backgroundColor: "#cfe3d3", color: "#297538" };
        }
        return (
          <span className="px-4 py-2 rounded-md text-sm font-semibold" style={style}>
            {text}
          </span>
        );
      },
    },
    
  ];

  return (
    <div className="border-2 rounded-lg p-4" style={{ borderColor: "#FFCEDB" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Return Invoice List</h2>
        <div className="flex gap-4">
          <Button
              className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md shadow hover:from-[#a3324e] hover:to-[#6e2384] transition text-xs"
            onClick={() => navigate("/finance/penaltyAdjustment/add-new-penalty-adjustment")}
          >
            View More ({filteredData?.filter((item)=>item.isReturn)?.length})
          </Button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <Spin tip="Loading..." />
      )  : (
        <Table
          dataSource={filteredData?.filter((item)=>item.isReturn)?.slice(0,5)}
          columns={columns}
          rowKey="invoiceNumber"
          size="small"
          pagination={false}
        />
      )}
    </div>
  );
};

export default ReturnInvoice;
