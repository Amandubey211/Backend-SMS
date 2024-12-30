import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { Table, Input, Button, Tooltip, Spin, Alert, Tag } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

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
      render: (invoiceNumber) => invoiceNumber,
    },
    {
      title: "Recipient Name",
      dataIndex: "receiver",
      key: "receiver",
      render: (receiver) => receiver?.name || "N/A",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let color = "green";
        let text = "Active";
        if (record.isCancel) { color = "red"; text = "Cancel" } else if(record.isReturn){
          color = "yellow"; text = "Return"
        }
        return (
          <Tag color={color} className="text-xs capitalize">
            {text}
          </Tag>
        );
      }
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
            onClick={() => navigate("/finance/penaltyAdjustment-list")}
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
