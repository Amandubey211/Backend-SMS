import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GraduateList from "./Components/GraduateList";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import Sidebar from "./Components/Sidebar";
import {
  fetchGraduates,
  demoteStudents,
} from "../../../Store/Slices/Admin/Graduate/graduate.action"; // Ensure the correct path
import {
  setSelectedGraduate,
  clearSelectedGraduate,
} from "../../../Store/Slices/Admin/Graduate/graduateSlice"; // Ensure the correct path

const GraduationMainSection = () => {
  const dispatch = useDispatch();

  // Accessing Redux state
  const {
    graduates,
    loading,
    error,
    selectedGraduate,
    total,
    currentPage,
    totalPages,
  } = useSelector(
    (state) => state?.admin?.graduates // Access the correct slice
  );

  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students data
  const [filters, setFilters] = useState({}); // Stores applied filters
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility state
  const [selectedStudents, setSelectedStudents] = useState([]); // State to track selected students

  // Fetch graduate data on component mount (initial load without filters)
  useEffect(() => {
    dispatch(fetchGraduates({ page: 1, limit: 10 })); // Fetch all graduates initially with default pagination
  }, [dispatch]);

  // Update filtered students whenever the graduates data changes
  useEffect(() => {
    setFilteredStudents(graduates); // Update filteredStudents when graduates change
  }, [graduates]);

  // Handle real-time search
  const handleSearch = (query) => {
    const filtered = graduates.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return (
        fullName.includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredStudents(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setFilters(filters); // Update local filters state
    dispatch(fetchGraduates({ ...filters, page: 1, limit: 10 })); // Fetch graduates with filters applied
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(fetchGraduates({ ...filters, page: newPage, limit: 10 }));
  };

  // Handle "View Details" click to open the sidebar with the selected student's data
  const handleViewDetails = (student) => {
    dispatch(setSelectedGraduate(student)); // Set selected student in Redux
    setSidebarOpen(true);
  };

  // Close the sidebar
  const closeSidebar = () => {
    dispatch(clearSelectedGraduate()); // Clear selected student in Redux
    setSidebarOpen(false);
  };

  // Handle demoting students
  const handleDemoteStudents = () => {
    // Dispatch action with selected students' IDs
    dispatch(demoteStudents({ studentIds: selectedStudents }));
  };

  // Handle Sidebar demotion
  const handleSidebarDemote = (studentId) => {
    dispatch(demoteStudents({ studentIds: [studentId] }));
  };

  return (
    <div className="relative p-5">
      {/* Search and Filter Navigation */}
      <TopNavigationWithFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Display the filtered students */}
      <GraduateList
        students={filteredStudents}
        selectedStudents={selectedStudents}
        setSelectedStudents={setSelectedStudents} // Pass the setter function here
        onViewDetails={handleViewDetails}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDemoteStudents={handleDemoteStudents} // Pass demote function here
        loading={loading} // Pass loading state
        error={error} // Pass error state
      />

      {/* Sidebar */}
      {isSidebarOpen && selectedGraduate && (
        <Sidebar
          student={selectedGraduate}
          closeSidebar={closeSidebar}
          onDemote={() => handleSidebarDemote(selectedGraduate._id)} // Pass demote function
        />
      )}
    </div>
  );
};

export default GraduationMainSection;
