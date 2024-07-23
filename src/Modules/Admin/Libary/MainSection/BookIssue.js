import React, { useState, useMemo, useEffect } from "react";
import axios from 'axios';
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../SubClass/component/AddIssue";
import BookIssueRow from "../SubClass/component/BookIssueRow";

const BookIssue = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
    category: "",
  });
  const [data, setData] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin:token');
    return {
      Authentication: `${token}`,
    };
  };

  useEffect(() => {
    axios.get('http://localhost:8080/admin/all/bookIssue', { headers: getAuthHeaders() })
      .then(response => {
        if (response.data.success) {
          setData(response.data.books);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSuccess = (newItem) => {
    axios.post('http://localhost:8080/admin/all/bookIssue', newItem, { headers: getAuthHeaders() })
      .then(response => {
        if (response.data.success) {
          setData(prev => [...prev, response.data.book]);
        }
      })
      .catch(error => console.error('Error adding item:', error));
  };

  const filteredData = data.filter(item => {
    return (
      (filters.classLevel === "" || item.className === filters.classLevel) &&
      (filters.section === "" || item.sectionName === filters.section) &&
      (filters.category === "" || item.bookCategory === filters.category)
    );
  });

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <FormField
            id="classLevel"
            label="Class"
            value={filters.classLevel}
            onChange={handleFilterChange}
            options={data.map(book => book.className)}
            placeholder="Select Class"
          />
          <FormField
            id="section"
            label="Section"
            value={filters.section}
            onChange={handleFilterChange}
            options={data.map(book => book.sectionName)}
            placeholder="Select Section"
          />
          <FormField
            id="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
            options={data.map(book => book.bookCategory)}
            placeholder="Select Category"
          />
        </div>
        <button
          onClick={handleSidebarOpen}
          className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book Issue
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-6 py-3 border-b-2 border-gray-200">Student</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Class & Section</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Issue Book</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Author</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Date</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Status</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200">{item.studentFirstName + " " + item.studentLastName}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.className + " & " + (item.sectionName || "N/A")}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.bookName}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.bookAuthor}</td>
                <td className="px-6 py-4 border-b border-gray-200">{new Date(item.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.status}</td>
                <td className="px-6 py-4 border-b border-gray-200">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add Book Issue"
      >
        <AddIssue onClose={handleSidebarClose} onAddSuccess={handleAddSuccess} />
      </Sidebar>
    </div>
  );
};

export default BookIssue;
