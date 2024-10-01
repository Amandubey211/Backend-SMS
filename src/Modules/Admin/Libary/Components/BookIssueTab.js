import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import FormField from "../Components/FormField";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import BookIssueRow from "../Components/BookIssueRow";

const BookIssueTab = ({ handleSidebarOpen, setEditIssueData }) => {
  const dispatch = useDispatch();
  const { bookIssues, books } = useSelector((state) => state.admin.library);
  const classList = useSelector((store) => store.admin.class.classes);
  const sectionList = useSelector(
    (store) => store.admin.group_section.sectionsList
  );

  const [localFilters, setLocalFilters] = React.useState({
    classLevel: "",
    section: "",
    book: "",
    status: "",
  });

  // Handle filter change
  const handleIssueFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));

    // If the classLevel changes, fetch sections for that class
    if (name === "classLevel" && value) {
      dispatch(fetchSectionsByClass(value)); // Dispatch the thunk to fetch sections by classId
    }
  };

  // Filter book issues based on class, section, book, and status
  const filteredBookIssues = bookIssues.filter((issue) => {
    const matchesClass =
      !localFilters.classLevel ||
      (issue.classId && issue.classId._id === localFilters.classLevel);
    const matchesSection =
      !localFilters.section ||
      (issue.sectionId && issue.sectionId._id === localFilters.section);
    const matchesBook =
      !localFilters.book ||
      (issue.bookId && issue.bookId._id === localFilters.book);
    const matchesStatus =
      !localFilters.status ||
      issue.status.toLowerCase() === localFilters.status.toLowerCase();

    return matchesClass && matchesSection && matchesBook && matchesStatus;
  });

  return (
    <>
      <div className="flex justify-between items-end mb-4">
        <div className="flex space-x-4">
          <FormField
            id="classLevel"
            name="classLevel"
            label="Class"
            value={localFilters.classLevel}
            onChange={handleIssueFilterChange}
            options={classList?.map((cls) => ({
              value: cls._id,
              label: cls.className,
            }))} // Pass value and label
          />
          <FormField
            id="section"
            name="section"
            label="Section"
            value={localFilters.section}
            onChange={handleIssueFilterChange}
            options={sectionList?.map((section) => ({
              value: section._id,
              label: section.sectionName,
            }))} // Pass value and label
            disabled={!localFilters.classLevel} // Disable if no class is selected
          />
          <FormField
            id="book"
            name="book"
            label="Book"
            value={localFilters.book}
            onChange={handleIssueFilterChange}
            options={books?.map((book) => ({
              value: book._id,
              label: book.name,
            }))} // Pass value and label
          />
          <FormField
            id="status"
            name="status"
            label="Status"
            value={localFilters.status}
            onChange={handleIssueFilterChange}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Returned", label: "Returned" },
            ]}
          />
        </div>
        <button
          onClick={handleSidebarOpen}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book Issue
        </button>
      </div>

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
            {filteredBookIssues.length > 0 ? (
              filteredBookIssues.map((issue) => (
                <BookIssueRow
                  key={issue._id}
                  item={issue}
                  setEditIssueData={setEditIssueData} // Pass down the function
                  handleSidebarOpen={handleSidebarOpen} // Open sidebar for editing
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="h-80">
                  <NoDataFound message="No Book Issues Found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookIssueTab;
