// src/Modules/Admin/Library/BookIssue.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../Components/AddIssue";
import { fetchBookIssuesThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import FormField from "../Components/FormField";
import { FiLoader } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { HiDotsVertical } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const BookIssue = () => {
  const dispatch = useDispatch();
  const { bookIssues, loading, classList, sectionList } = useSelector(
    (state) => state.admin.library
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState({ show: false, index: 0 });
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
  });
  const [editIssueData, setEditIssueData] = useState(null);

  // Fetch book issues on mount (only if not already fetched)
  useEffect(() => {
    // dispatch(fetchBookIssuesThunk());
  }, []);

  // Handle filtering of book issues
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "classLevel" && value) {
      dispatch(fetchSectionsByClass(value));
    }
  };

  // Filtered data based on class and section
  const filteredData = bookIssues.filter((item) => {
    return (
      (filters.classLevel === "" ||
        item.classId?.className === filters.classLevel) &&
      (filters.section === "" ||
        item.sectionId?.sectionName === filters.section)
    );
  });

  // Early return if loading
  if (loading) {
    return (
      <div className="flex w-full h-[90vh] items-center justify-center">
        <FiLoader className="animate-spin w-[3rem] h-[3rem]" />
        <p className="text-gray-800 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <FormField
            id="classLevel"
            name="classLevel"
            label="Class"
            value={filters.classLevel}
            onChange={handleFilterChange}
            options={classList.map((cls) => cls.className)}
            placeholder="Select Class"
          />
          <FormField
            id="section"
            name="section"
            label="Section"
            value={filters.section}
            onChange={handleFilterChange}
            options={sectionList.map((section) => section.sectionName)}
            placeholder="Select Section"
          />
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book Issue
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Class & Section</th>
              <th className="px-6 py-3">Book</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Issue Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 relative">
                  <td className="px-6 py-4">{item.studentId?.firstName}</td>
                  <td className="px-6 py-4">
                    {item.classId?.className} & {item.sectionId?.sectionName}
                  </td>
                  <td className="px-6 py-4">{item.bookId?.name}</td>
                  <td className="px-6 py-4">{item.author}</td>
                  <td className="px-6 py-4">
                    {new Date(item.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">
                    <div
                      className="absolute right-12 text-indigo-600 hover:text-indigo-900 cursor-pointer font-bold items-center"
                      onClick={() => setShowEditMenu({ show: true, index })}
                    >
                      <HiDotsVertical />
                    </div>
                    {showEditMenu.show && showEditMenu.index === index && (
                      <div className="absolute bottom-0 right-0 bg-white shadow-lg flex flex-col items-center w-[6rem] h-[3rem] border rounded-lg">
                        <button
                          className="absolute left-[-1.5rem] top-[-2rem] text-indigo-600 hover:text-indigo-900"
                          onClick={() => setShowEditMenu({ show: false })}
                        >
                          <MdCancel className="text-2xl text-black" />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            setSidebarOpen(true);
                            setEditIssueData(item);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  <GoAlertFill className="text-5xl" />
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editIssueData ? "Edit Book Issue" : "Add Book Issue"}
      >
        <AddIssue
          onClose={() => setSidebarOpen(false)}
          editIssueData={editIssueData}
          onUpdate={fetchBookIssuesThunk}
        />
      </Sidebar>
    </div>
  );
};

export default BookIssue;
