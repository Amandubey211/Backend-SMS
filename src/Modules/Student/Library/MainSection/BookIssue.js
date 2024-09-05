import React, { useState, useEffect, useMemo } from "react";
import { GoDotFill } from "react-icons/go"; // Importing the dot icon for checked state
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import BookIssueRow from "../SubClass/component/BookIssueRow";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner"; // Import the Spinner

const BookIssue = () => {
  const [bookIssueData, setBookIssueData] = useState([]);
  const [filters, setFilters] = useState({
    classLevel: "",
    category: "",
    status: "All",
  });
  const [loading, setLoading] = useState(true); // Add loading state

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBookIssues = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const token = localStorage.getItem("student:token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${baseUrl}/student/issue/books`, {
        headers: { Authentication: token },
      });

      setBookIssueData(response.data?.booksIssue.reverse());
    } catch (error) {
      console.error("Failed to fetch book issues:", error);
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  useEffect(() => {
    fetchBookIssues();
  }, []);

  const filteredBookIssueData = useMemo(() => {
    if (filters.status === "All") {
      return bookIssueData;
    }
    return bookIssueData.filter((item) => item.status === filters.status);
  }, [bookIssueData, filters.status]);

  return (
    <div className="min-h-screen">
      {/* Radio buttons for filtering */}
      <div className="flex gap-4 mb-4 ps-5">
        {["All", "Pending", "Return"].map((status) => (
          <label key={status} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value={status}
              checked={filters.status === status}
              onChange={handleFilterChange}
              className="hidden"
            />
            <div
              className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 transition-colors duration-300 ${
                filters.status === status
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            >
              {/* Icon for selected radio button */}
              {filters.status === status && (
                <GoDotFill className="text-green-500" size={18} />
              )}
            </div>
            <span
              className={`transition-colors duration-300 text-md ${
                filters.status === status ? "text-gradient" : "text-gray-600"
              } hover:text-pink-500 focus:outline-none`}
            >
              {status}
            </span>
          </label>
        ))}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        ) : filteredBookIssueData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <NoDataFound />
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-100">
                <th className="px-5 py-3 border-b border-gray-200">
                  Issue Book
                </th>
                <th className="px-5 py-3 border-b border-gray-200">Author</th>
                <th className="px-5 py-3 border-b border-gray-200">Category</th>
                <th className="px-5 py-3 border-b border-gray-200">
                  Issue Date
                </th>
                <th className="px-5 py-3 border-b border-gray-200">
                  Return Date
                </th>
                <th className="px-5 py-3 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookIssueData.map((item) => (
                <BookIssueRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookIssue;
