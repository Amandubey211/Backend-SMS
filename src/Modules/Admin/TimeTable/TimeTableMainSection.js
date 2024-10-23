import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimeTableList from "./Components/TimeTableList";
import { fetchTimetables, deleteTimetable } from "../../../Store/Slices/Admin/TimeTable/timetable.action";
import CreateOrEditTimeTable from "./Components/CreateOrEditTimeTable"; // For creating/editing
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk"; // Import fetchAllClasses thunk
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters"; // Import filter component

const TimeTableMainSection = () => {
  const dispatch = useDispatch();

  const { timetables, loading, error } = useSelector((state) => state.admin.timetable);
  const { classes, loading: classLoading } = useSelector((state) => state.admin.class); // Select classes from state

  const [academicYears, setAcademicYears] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    classId: "",
    type: "",
    status: "",
    academicYear: "", // Filter based on academic year
  });

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // Function to fetch academic years from localStorage
  const fetchAcademicYearsFromStorage = () => {
    const persistedAuth = localStorage.getItem("persist:auth");
    if (persistedAuth) {
      const parsedAuth = JSON.parse(persistedAuth);
      const authData = JSON.parse(parsedAuth.auth || "{}");
      if (authData && authData.AcademicYear) {
        setAcademicYears(authData.AcademicYear); // Set the academic year state from localStorage
      }
    }
  };

  // Fetch classes and academic years on component mount
  useEffect(() => {
    fetchAcademicYearsFromStorage(); // Fetch academic year from localStorage on component mount
    dispatch(fetchAllClasses()); // Fetch all classes on component mount
  }, [dispatch]);

  // Fetch timetables based on filters
  useEffect(() => {
    dispatch(fetchTimetables(filters)); // Fetch timetables based on filters
  }, [filters, dispatch]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters); // Update filters when changed
  };

  const handleCreateTimeTable = () => {
    setCreateModalOpen(true); // Show the create modal
  };

  const handleDelete = (id) => {
    dispatch(deleteTimetable(id));
  };

  return (
    <div className="relative p-5">
      {/* Filter Navigation */}
      <TopNavigationWithFilters
        onFilterChange={handleFilterChange}
        academicYears={academicYears} // Pass academic years from localStorage
      />

      {/* Button to create a new timetable */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateTimeTable}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Create TimeTable
        </button>
      </div>

      {/* Display list of timetables */}
      <TimeTableList />

      {/* Modal for creating or editing timetable */}
      {isCreateModalOpen && (
        <CreateOrEditTimeTable onClose={() => setCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default TimeTableMainSection;
