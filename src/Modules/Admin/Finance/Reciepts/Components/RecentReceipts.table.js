// RecentReceipts.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import { fetchAllReceipts } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import Spinner from "../../../../../Components/Common/Spinner"; // Adjust the path as necessary

const RecentReceipts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access receipts data from Redux state
  const { receipts = [], loading, error } = useSelector((state) => state.admin.receipts || {});

  // Add a flag to check if data is already fetched
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch receipts on component mount if not already fetched
  useEffect(() => {
    if (!dataFetched) {
      dispatch(fetchAllReceipts());
      setDataFetched(true); // Set flag to true after the first fetch
    }
  }, [dispatch, dataFetched]);

  // Filter data based on search query
  const filteredData = receipts.filter(
    (item) =>
      item.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.reciever?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.receiver?.name?.toLowerCase().includes(searchQuery.toLowerCase())) || // Handle both 'reciever' and 'receiver'
      item.totalPaidAmount?.toString().includes(searchQuery.toLowerCase()) ||
      (item.date && new Date(item.date).toLocaleDateString().includes(searchQuery.toLowerCase()))
  );

  console.log("This is receipts: ", receipts);

  // Dropdown menu for actions
  const actionMenu = (receiptId) => (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate(`/finance/receipts/details/${receiptId}`)}>
        View Details
      </Menu.Item>
      <Menu.Item key="2">Send Reminder</Menu.Item>
    </Menu>
  );

  return (
    <div className="border-2 rounded-lg p-4" style={{ borderColor: "#FFCEDB" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Receipts List</h2>
        <div className="flex gap-4">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-[0.825rem] text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full pl-10 pr-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/finance/receipts/receipt-list")}
            className="px-4 py-2 rounded-md border border-gray-400 shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-200 text-transparent bg-gradient-text bg-clip-text"
          >
            View More
          </button>
        </div>
      </div>

      {/* Table Section */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
            <th className="py-3 px-4 font-medium">Receipt ID</th>
            <th className="py-3 px-4 font-medium">Recipient Name</th>
            <th className="py-3 px-4 font-medium">Class</th>
            <th className="py-3 px-4 font-medium">Section</th>
            <th className="py-3 px-4 font-medium">Paid Date</th>
            <th className="py-3 px-4 font-medium">Paid Amount</th>
            {/* <th className="py-3 px-4 font-medium">Status</th> */}
            <th className="py-3 px-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="py-4 px-4">
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" className="py-4 px-4">
                <div className="flex justify-center items-center">
                  <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#FF4D4F' }} />
                  <span className="ml-2 text-red-500">Error: {error}</span>
                </div>
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 px-4">
                <div className="flex flex-col items-center">
                  <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <span className="mt-4 text-gray-500 text-lg">No Receipts Available</span>
                </div>
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">{item.receiptNumber || item._id || "N/A"}</td>
                <td className="py-4 px-4">{item.reciever?.name || item.receiver?.name || "N/A"}</td>
                <td className="py-4 px-4">{item.className || "N/A"}</td>
                <td className="py-4 px-4">{item.section || "N/A"}</td> {/* Assuming 'section' is not available */}
                <td className="py-4 px-4">{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                <td className="py-4 px-4">{item.totalPaidAmount ? `${item.totalPaidAmount} QAR` : "N/A"}</td>
                {/* <td className="py-4 px-4">
                  <StatusBadge status={item.isCancel ? "Cancelled" : "Paid"} />
                </td> */}
                <td className="py-4 px-4">
                  <Dropdown overlay={() => actionMenu(item._id)} trigger={["click"]}>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                    </button>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Optional: Pagination */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
          <span>Showing {filteredData.length} Receipts</span>
          <div className="flex gap-2">
            <button className="text-gray-500">« Back</button>
            <button className="bg-purple-500 text-white px-2 rounded">1</button>
            <button className="text-gray-500">2</button>
            <button className="text-gray-500">Next »</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentReceipts;
