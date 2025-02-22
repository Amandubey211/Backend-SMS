import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GraduateList from "./Components/GraduateList";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import Sidebar from "./Components/Sidebar";
import DeleteConfirmationModal from "../../../Components/Common/DeleteConfirmationModal";
import {
  fetchGraduates,
  demoteStudents,
} from "../../../Store/Slices/Admin/Graduate/graduate.action";
import {
  setSelectedGraduate,
  clearSelectedGraduate,
} from "../../../Store/Slices/Admin/Graduate/graduateSlice";
import { toast } from "react-hot-toast";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../config/permission";

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
  } = useSelector((state) => state?.admin?.graduates);

  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students data
  const [filters, setFilters] = useState({}); // Stores applied filters
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility state
  const [selectedStudents, setSelectedStudents] = useState([]); // State to track selected students
  const [isModalOpen, setModalOpen] = useState(false); // Manage modal visibility
  const [modalLoading, setModalLoading] = useState(false); // Manage modal loading state
  const [demoteFromSidebar, setDemoteFromSidebar] = useState(false); // Track if demotion is from Sidebar

  // Fetch graduate data on component mount
  useEffect(() => {
    dispatch(fetchGraduates({ page: 1, limit: 10 }));
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

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setFilters(filters);
    dispatch(fetchGraduates({ ...filters, page: 1, limit: 10 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(fetchGraduates({ ...filters, page: newPage, limit: 10 }));
  };

  // Handle "View Details" click to open the sidebar with the selected student's data
  const handleViewDetails = (student) => {
    dispatch(setSelectedGraduate(student));
    setSidebarOpen(true);
  };

  // Close the sidebar
  const closeSidebar = () => {
    dispatch(clearSelectedGraduate());
    setSidebarOpen(false);
  };

  // Open modal for bulk demotion
  const handleDemoteStudents = () => {
    setDemoteFromSidebar(false); // Reset to false for bulk action
    setModalOpen(true); // Open modal
  };

  // Open modal for sidebar demotion
  const handleSidebarDemote = () => {
    setDemoteFromSidebar(true); // Set to true for sidebar action
    setModalOpen(true); // Open modal
  };

  // Confirm demotion action in modal
  const confirmDemotion = () => {
    setModalLoading(true);
    const studentIds = demoteFromSidebar
      ? [selectedGraduate._id]
      : selectedStudents;

    dispatch(demoteStudents({ studentIds }))
      .then(() => {
        toast.success(`${studentIds?.length} student(s) have been demoted`);

        if (demoteFromSidebar) {
          closeSidebar();
        }

        // Fetch updated graduate list first
        return dispatch(fetchGraduates({ ...filters, page: 1, limit: 10 }));
      })
      .then(() => {
        if (!demoteFromSidebar) {
          setSelectedStudents([]); // Clear selection AFTER list refreshes
        }
      })
      .finally(() => {
        setModalLoading(false);
        setModalOpen(false);
      });
  };

  return (
    <div className="relative p-5">
      {/* Search and Filter Navigation */}
      <TopNavigationWithFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Display the filtered students */}
      <ProtectedSection
        requiredPermission={PERMISSIONS.ViewGraduateStudent}
        title={"Graduates"}
      >
        <GraduateList
          students={filteredStudents}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
          onViewDetails={handleViewDetails}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onDemoteStudents={handleDemoteStudents}
          loading={loading}
          error={error}
        />
      </ProtectedSection>

      {/* Sidebar */}
      {isSidebarOpen && selectedGraduate && (
        <Sidebar
          student={selectedGraduate}
          closeSidebar={closeSidebar}
          onDemote={handleSidebarDemote} // Trigger sidebar demote modal
        />
      )}

      {/* Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDemotion}
        loading={modalLoading}
        text="Demote"
      />
    </div>
  );
};

export default GraduationMainSection;
