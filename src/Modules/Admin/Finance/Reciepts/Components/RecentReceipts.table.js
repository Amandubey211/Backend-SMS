import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Input, Dropdown, Menu } from "antd";
import { SearchOutlined, MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../../../../../Components/Common/DeleteConfirmationModal"; // Adjust path if needed
import Spinner from "../../../../../Components/Common/Spinner"; // Adjust path if needed
import { fetchAllReceipts, cancelReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";

const RecentReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receipts = [], loading, error } = useSelector((state) => state.admin.receipts || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!dataFetched) {
      dispatch(fetchAllReceipts());
      setDataFetched(true);
    }
  }, [dispatch, dataFetched]);

  const handleCancelReceipt = async () => {
    setCancelLoading(true);
    const result = await dispatch(cancelReceipt(selectedReceiptId));
    console.log(result);
    if (result.payload === "Receipt cancel successfully") {
      toast.success("Receipt canceled successfully!");
      // Trigger re-fetching of receipts after successful cancellation
      dispatch(fetchAllReceipts());
    } else {
      toast.error("Failed to cancel receipt.");
    }
    setCancelLoading(false);
    setModalVisible(false);
  };


  const filteredData = receipts.filter((item) => {
    const receiptNumber = item.receiptNumber?.toLowerCase() || "";
    const receiverName =
      item.reciever?.name?.toLowerCase() || item.receiver?.name?.toLowerCase() || "";
    const paidAmount = item.totalPaidAmount?.toString() || "";
    const dateString = item.date ? new Date(item.date).toLocaleDateString() : "";

    return (
      receiptNumber.includes(searchQuery.toLowerCase()) ||
      receiverName.includes(searchQuery.toLowerCase()) ||
      paidAmount.includes(searchQuery.toLowerCase()) ||
      dateString.includes(searchQuery.toLowerCase())
    );
  });

  const columns = [
    {
      title: "Receipt ID",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      sorter: (a, b) => (a.receiptNumber || "").localeCompare(b.receiptNumber || ""),
      render: (text, record) => text || record._id || "N/A",
    },
    {
      title: "Recipient Name",
      dataIndex: ["reciever", "name"],
      key: "recipientName",
      sorter: (a, b) => {
        const nameA = a.reciever?.name || a.receiver?.name || "";
        const nameB = b.reciever?.name || b.receiver?.name || "";
        return nameA.localeCompare(nameB);
      },
      render: (_, record) => record.reciever?.name || record.receiver?.name || "N/A",
    },
    {
      title: "Paid Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Paid Amount",
      dataIndex: "totalPaidAmount",
      key: "paidAmount",
      sorter: (a, b) => (a.totalPaidAmount || 0) - (b.totalPaidAmount || 0),
      render: (amount) => (amount ? `${amount} QAR` : "N/A"),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      sorter: (a, b) => (a.tax || 0) - (b.tax || 0),
      render: (tax) => `${tax || 0} QAR`,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => (a.discount || 0) - (b.discount || 0),
      render: (discount) => `${discount || 0} QAR`,
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      key: "penalty",
      sorter: (a, b) => (a.penalty || 0) - (b.penalty || 0),
      render: (penalty) => `${penalty || 0} QAR`,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      sorter: (a, b) => (a.remark || "").localeCompare(b.remark || ""),
      render: (remark) => remark || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => navigate(`/finance/receipts/details/${record._id}`)}>
                Preview
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setSelectedReceiptId(record._id);
                  setModalVisible(true);
                }}
              >
                Cancel Receipt
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "#FF4D4F", marginTop: "16px" }}>
        <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
        <p>Unable to fetch the receipts.</p>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#999", marginTop: "16px" }}>
        <ExclamationCircleOutlined style={{ fontSize: "48px" }} />
        <p>No receipts available.</p>
      </div>
    );
  }

  return (
    <div style={{ border: "2px solid #FFCEDB", borderRadius: "8px", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Recent Receipts List</h2>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "250px" }}
          />
          <button
            onClick={() => navigate("/finance/receipts/receipt-list")}
            className="px-4 py-2 rounded-md border border-gray-400 shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-200 text-transparent bg-gradient-text bg-clip-text"
          >
            View More
          </button>
        </div>
      </div>

      <Table
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={filteredData}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <strong>Line Items:</strong>
              {record.lineItems.length > 0 ? (
                <ul>
                  {record.lineItems.map((item, index) => (
                    <li key={index}>
                      {item.name}: {item.amount} QAR
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No line items available</span>
              )}
            </div>
          ),
        }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          position: ["bottomRight"],
        }}
      />
      <DeleteConfirmationModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleCancelReceipt}
        loading={cancelLoading}
        text="Cancel Receipt"
      />
    </div>
  );
};

export default RecentReceipts;
