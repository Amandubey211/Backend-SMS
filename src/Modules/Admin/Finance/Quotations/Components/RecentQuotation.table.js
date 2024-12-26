import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { RiErrorWarningFill } from "react-icons/ri";
import { FcDeleteDatabase } from "react-icons/fc";
import { fetchAllQuotations } from "../../../../../Store/Slices/Finance/Quotations/quotationThunks";
import Spinner from "../../../../../Components/Common/Spinner";

const RecentQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetching state from Redux store
  const { quotations, loading, error } = useSelector((state) => state.admin.quotations);
  console.log("this is ",quotations)
  // Fetch quotations on component mount
  useEffect(() => {
    dispatch(fetchAllQuotations());
  }, [dispatch]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!quotations) return [];
    return quotations.filter((item) =>
      [
        item.quotationNumber,
        item.reciever?.name,
        item.final_amount,
        item.remark,
        item.status,
        item.lineItems.map((li) => li.revenueType).join(", "), // Join line items for filtering
        item.SelectedItems?.map((si) => si.name).join(", "), // Join selected items for filtering
      ]
        .filter(Boolean) // Ensure no null/undefined
        .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [quotations, searchQuery]);

  // Dropdown menu for actions
  const actionMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate(`/finance/quotations/details`)}>
        View Details
      </Menu.Item>
      <Menu.Item key="2">Send Reminder</Menu.Item>
    </Menu>
  );

  return (
    <div className="border-2 rounded-lg p-4" style={{ borderColor: "#FFCEDB" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Quotation List</h2>
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
            onClick={() => navigate("/finance/quotations/quotations-list")}
            className="px-4 py-2 rounded-md border border-gray-400 shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-200 text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text"
          >
            View More
          </button>
        </div>
      </div>

      {/* Table Section */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
            <th className="py-3 px-4 font-medium">Quotation Number</th>
            <th className="py-3 px-4 font-medium">Quotation To</th>
            <th className="py-3 px-4 font-medium">Purpose</th>
            <th className="py-3 px-4 font-medium">Issue Date</th>
            <th className="py-3 px-4 font-medium">Total Amount</th>
            <th className="py-3 px-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Loading State */}
          {loading && (
            <tr>
              <td colSpan="6" className="py-4 px-4 text-center">
                <Spinner />
              </td>
            </tr>
          )}

          {/* Error State */}
          {error && (
            <tr>
              <td colSpan="6" className="py-4 px-4 text-center">
                <div className="flex flex-col justify-center items-center">
                  <RiErrorWarningFill className="text-red-500 text-4xl" />
                  <span className="text-red-500 mt-2">Unable to Fetch Quotations: {error}</span>
                </div>
              </td>
            </tr>
          )}

          {/* No Data State */}
          {!loading && !error && filteredData.length === 0 && (
            <tr>
              <td colSpan="6" className="py-4 px-4 text-center">
                <div className="flex flex-col justify-center items-center">
                  <FcDeleteDatabase className="text-4xl" />
                  <span className="text-gray-600 mt-2">No Quotation Yet!</span>
                </div>
              </td>
            </tr>
          )}

          {/* Data Rows */}
          {!loading &&
            !error &&
            filteredData.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">{item.quotationNumber}</td>
                <td className="py-4 px-4">{item.reciever?.name || "N/A"}</td>
                <td className="py-4 px-4">{item.remark || "N/A"}</td>
                <td className="py-4 px-4">{new Date(item.date).toLocaleDateString()}</td>
                <td className="py-4 px-4">{item.final_amount || "N/A"}</td>
                <td className="py-4 px-4">
                  <Dropdown overlay={actionMenu} trigger={["click"]}>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                    </button>
                  </Dropdown>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentQuotation;
