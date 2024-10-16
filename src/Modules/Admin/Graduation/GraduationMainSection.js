import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GraduateList from "./Components/GraduateList";
import Spinner from "../../../Components/Common/Spinner";
import Error from "../../../Components/Common/Error";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import Sidebar from "./Components/Sidebar";
import { fetchGraduates } from "../../../Store/Slices/Admin/Graduate/graduate.action"; // Ensure the correct path
import { setSelectedGraduate, clearSelectedGraduate } from "../../../Store/Slices/Admin/Graduate/graduateSlice"; // Ensure the correct path

const GraduationMainSection = () => {
  const dispatch = useDispatch();

  // Accessing Redux state
  const { graduates, loading, error, selectedGraduate, total, currentPage, totalPages } = useSelector(
    (state) => state?.admin?.graduates // Access the correct slice
  );

  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students data
  const [filters, setFilters] = useState({}); // Stores applied filters
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility state

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

  // Loading state
  if (loading) {
    return <Spinner />;
  }

  // Error state
  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="relative p-5">
      {/* Search and Filter Navigation */}
      <TopNavigationWithFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Display the filtered students */}
      <GraduateList
        students={filteredStudents}
        onViewDetails={handleViewDetails}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Sidebar */}
      {isSidebarOpen && selectedGraduate && (
        <Sidebar student={selectedGraduate} closeSidebar={closeSidebar} />
      )}
    </div>
  );
};

export default GraduationMainSection;
