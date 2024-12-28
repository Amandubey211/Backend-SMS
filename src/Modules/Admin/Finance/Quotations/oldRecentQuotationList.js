import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";
import { FcDeleteDatabase } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllQuotations, updateQuotationStatus } from "../../../../Store/Slices/Finance/Quotations/quotationThunks";
import Spinner from "../../../../Components/Common/Spinner";
import EmailModal from "../../../../Components/Common/EmailModal";

const OldRecentQuotationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30); // Number of items per page

  // Redux state
  const { quotations = [], loading, error } = useSelector((state) => state.admin?.quotations || {});

  // Fetch quotations on component mount
  useEffect(() => {
    dispatch(fetchAllQuotations());
  }, [dispatch]);

  // Filter quotations based on status and search query
  const filteredQuotations = quotations.filter((item) => {
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesSearch =
      item?.quotationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.reciever?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.remark?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Paginate filtered quotations
  const paginatedQuotations = filteredQuotations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalPages = Math.ceil(filteredQuotations.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
  };

  const handleStatusChange = (quotationId, status) => {
    dispatch(updateQuotationStatus({ id: quotationId, status }));
  };

  const actionMenu = (quotationId) => (
    <Menu>
      <Menu.Item key="1">View Details</Menu.Item>
      <Menu.Item key="2" onClick={() => handleStatusChange(quotationId, "accept")}>Accept</Menu.Item>
      <Menu.Item key="3" onClick={() => handleStatusChange(quotationId, "reject")}>Reject</Menu.Item>
    </Menu>
  );

  return (
    <AdminLayout>
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Recent Quotations List</h2>

        {/* Filters and Search */}
        <div className="flex justify-between items-center mt-4">
          {/* Status Filter */}
          <div className="flex space-x-6">
            {["All", "accept", "reject", "pending"].map((status) => (
              <label key={status} className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="statusFilter"
                  className="form-radio text-green-600"
                  checked={statusFilter === status}
                  onChange={() => setStatusFilter(status)}
                />
                <span className={`font-medium ${statusFilter === status ? "text-green-600" : "text-gray-700"}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </label>
            ))}
          </div>

          {/* Search Box */}
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-full pl-4 pr-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div> */}

          {/* Add New Button */}
          <button
            onClick={() => navigate("/finance/quotations/add-new-quotations")}
            className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
          >
            <span className="text-gray-800 font-medium">Add New Quotation</span>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <FiPlus size={16} />
            </div>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
                <th className="py-3 px-4 font-medium">Quotation Number</th>
                <th className="py-3 px-4 font-medium">Quotation To</th>
                <th className="py-3 px-4 font-medium">Purpose</th>
                <th className="py-3 px-4 font-medium">Issue Date</th>
                <th className="py-3 px-4 font-medium">Total Amount</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center">
                    <Spinner />
                  </td>
                </tr>
              )}

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

              {!loading && !error && paginatedQuotations.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center">
                    <div className="flex flex-col justify-center items-center">
                      <FcDeleteDatabase className="text-4xl" />
                      <span className="text-gray-600 mt-2">No Quotations Found!</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                paginatedQuotations.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">{item?.quotationNumber}</td>
                    <td className="py-4 px-4">{item?.reciever?.name || "N/A"}</td>
                    <td className="py-4 px-4">{item?.remark || "N/A"}</td>
                    <td className="py-4 px-4">{new Date(item?.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4">{item?.final_amount || "N/A"}</td>
                    <td className="py-4 px-4">{item?.status || "pending"}</td>
                    <td className="py-4 px-4 flex items-center gap-4">
                      <Dropdown overlay={actionMenu(item._id)} trigger={["click"]}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                          <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
          <span>
            Showing {paginatedQuotations.length} of {filteredQuotations.length} Quotations
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-gray-500 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              « Back
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-2 rounded ${currentPage === index + 1 ? "bg-purple-500 text-white" : "text-gray-500"}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`text-gray-500 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Next »
            </button>
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        sendButtonText="Send Quotation"
        onSubmit={() => {
          console.log("Send Quotation Clicked");
          closeEmailModal();
        }}
      />
    </AdminLayout>
  );
};

export default OldRecentQuotationList;
