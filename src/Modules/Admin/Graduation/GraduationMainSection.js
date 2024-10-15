import React, { useState, useEffect } from "react";
import GraduateList from "./Components/GraduateList"; // Component for listing graduate students
import Spinner from "../../../Components/Common/Spinner"; // For loading state
import Error from "../../../Components/Common/Error"; // For error handling
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters"; // Search and filter component
import graduateData from "./DataFile/graduateData.json"; // Hardcoded graduates data
import Sidebar from "./Components/Sidebar"; // Sidebar for viewing student details

const GraduationMainSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [students, setStudents] = useState([]); // All students data
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students data
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility state

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      try {
        setStudents(graduateData); // Load hardcoded data
        setFilteredStudents(graduateData); // Initialize the filtered students
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    }, 1000); // Simulated delay
  }, []);

  // Handle real-time search
  const handleSearch = (query) => {
    const filtered = students.filter((student) => {
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
    const filtered = students.filter((student) => {
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
    setSelectedStudent(student);
    setSidebarOpen(true);
  };

  // Close the sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedStudent(null); // Reset student when closing sidebar
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="relative p-5">
      {/* Search and Filter Navigation */}
      <TopNavigationWithFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Display the filtered students */}
      <GraduateList students={filteredStudents} onViewDetails={handleViewDetails} />

      {/* Sidebar */}
      {isSidebarOpen && (
        <Sidebar student={selectedStudent} closeSidebar={closeSidebar} />
      )}
    </div>
  );
};

export default GraduationMainSection;
