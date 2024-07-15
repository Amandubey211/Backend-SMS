import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../../Components/Common/Sidebar";
import BookIssueRow from "../SubClass/component/BookIssueRow";
import { bookIssueData } from "../../studentDummyData/studentDummyData";
import FormField from "../../../Admin/Accounting/subClass/component/FormField";
import axios from "axios";

const BookIssue = () => {
  const [bookIssueData, setBookIssueData] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    classLevel: "",
    category: "",
  });

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchBookIssues = async () => {
      console.log("Fetching book issues...");
      try {
        const token = localStorage.getItem('student:token');
        console.log("token in student book issue", token);
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // const response = await fetch('http://localhost:8080/student/issue/books', {
          const response = await fetch(' http://localhost:8080/admin/all/bookIssue/', {

          
          headers: {
            'Authentication': token
          }
        });

        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch book issues, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data parsed:", data);

        if (data.success && data.booksIssue) {
          setBookIssueData(data.booksIssue);
        } else {
          console.log("No book issues data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch book issues:", error);
      }
    };

    fetchBookIssues();
  }, []);


  // const classLevels = useMemo(() => {
  //   const levels = bookIssueData.map((book) => book.classLevel.toString());
  //   return Array.from(new Set(levels));
  // }, [bookIssueData]);

  // const categories = useMemo(() => {
  //   const cats = bookIssueData.map((book) => book.category);
  //   return Array.from(new Set(cats));
  // }, [bookIssueData]);

  // const filteredData = bookIssueData.filter((item) => {
  //   return (
  //     (filters.classLevel === "" || item.classLevel === filters.classLevel) &&
  //     (filters.category === "" || item.category === filters.category)
  //   );
  // });

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        {/* <div className="flex space-x-4">
          <FormField
            id="classLevel"
            label="Class"
            value={filters.classLevel}
            onChange={handleFilterChange}
            options={classLevels}
            placeholder="Select Class"
          />
          <FormField
            id="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
            options={categories}
            placeholder="Select Category"
          />
        </div> */}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-5 py-3 border-b-2 border-gray-200">
                Issue Book
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Author</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookIssueData.map((item) => (
              <BookIssueRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookIssue;
