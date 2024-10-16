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
  const { graduates, loading, error, selectedGraduate } = useSelector(
    (state) => state?.admin?.graduates // Access the correct slice
  );
  
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students data
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility state

  // Fetch graduate data on component mount
  useEffect(() => {
    dispatch(fetchGraduates({})); // Fetch all graduates initially
  }, [dispatch]);

  // Update filtered students whenever the graduates data changes
  useEffect(() => {
    setFilteredStudents(graduates);
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

  // Handle filtering
  const handleFilterChange = (filters) => {
    const filtered = graduates.filter((student) => {
      return (
        (!filters.academicYear || student.academicYear === filters.academicYear) &&
        (!filters.class || student.className === filters.class) &&
        (!filters.section || student.sectionName === filters.section) &&
        (!filters.groupName || student.groupName === filters.groupName)
      );
    });
    setFilteredStudents(filtered);
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
      <GraduateList students={filteredStudents} onViewDetails={handleViewDetails} />

      {/* Sidebar */}
      {isSidebarOpen && selectedGraduate && (
        <Sidebar student={selectedGraduate} closeSidebar={closeSidebar} />
      )}
    </div>
  );
};

export default GraduationMainSection;
