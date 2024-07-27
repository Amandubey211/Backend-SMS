import React, { useState, useEffect, useMemo } from "react";
import BookIssueRow from "../../../../../Student/Library/SubClass/component/BookIssueRow";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const BookIssue = () => {
  const [bookIssueData, setBookIssueData] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { cid } = useParams();
  const [filters, setFilters] = useState({
    classLevel: "",
    category: "",
    status: "All",
  });

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const role = useSelector((store) => store.Auth.role);
  const fetchBookIssues = async () => {

    try {
      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${baseUrl}/admin/all/bookIssue/?studentId=${cid}`, {
        headers: {
          'Authentication': token
        }
      });

      const data = response.data?.books?.reverse();
      console.log("Data parsed:", data);

      setBookIssueData(data);

    } catch (error) {
      console.error("Failed to fetch book issues:", error);
    }
  };

  useEffect(() => {
    fetchBookIssues();
  }, []);

  const filteredBookIssueData = useMemo(() => {
    if (filters.status === "All") {
      return bookIssueData;
    }
    return bookIssueData.filter(item => item.status === filters.status);
  }, [bookIssueData, filters.status]);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">

      </div>
      <div className="flex gap-3 mb-5">
        {["All", "Pending", "Return"].map((status) => (
          <div key={status} className="">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={filters.status === status}
                onChange={handleFilterChange}
                className="hidden"
              />
              <div
                className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${filters.status === status
                  ? "border-green-500 bg-green-500"
                  : "border-gray-300"
                  }`}
              >
                {filters.status === status && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`transition-colors duration-200 ${filters.status === status
                  ? "text-red-700"
                  : "text-gray-700"
                  }`}
              >
                {status}
              </span>
            </label>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-5 py-3 border-b border-gray-200">Issue Book</th>
              <th className="px-5 py-3 border-b border-gray-200">Author</th>
              <th className="px-5 py-3 border-b border-gray-200">Category</th>
              <th className="px-5 py-3 border-b border-gray-200">Issue Date</th>
              <th className="px-5 py-3 border-b border-gray-200">Return Date</th>
              <th className="px-5 py-3 border-b border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookIssueData?.map((item) => (
              <BookIssueRow key={item.id} item={item} />

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookIssue;
