// TimeTableMainSection.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimeTableList from "./Components/TimeTableList";
import {
  fetchTimetables,
  deleteTimetable,
} from "../../../Store/Slices/Admin/TimeTable/timetable.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TimeTableMainSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const role = useSelector((store) => store.common.auth.role);


  // Correctly destructure timetables, loadingFetch, and errorFetch
  const { timetables, loadingFetch, errorFetch } = useSelector(
    (state) => state.admin.timetable
  );
  const { classes, loading: classLoading, error: classError } = useSelector(
    (state) => state.admin.class
  );

  const [academicYears, setAcademicYears] = useState([]);
  const [backendFilters, setBackendFilters] = useState({
    classId: "",
    type: "",
    status: "",
    academicYear: "",
  });
  const [frontendFilter, setFrontendFilter] = useState("");

  const [filteredTimetables, setFilteredTimetables] = useState([]);

  // Function to fetch academic years from localStorage
  const fetchAcademicYearsFromStorage = () => {
    const persistedAuth = localStorage.getItem("persist:auth");
    if (persistedAuth) {
      const parsedAuth = JSON.parse(persistedAuth);
      const authData = JSON.parse(parsedAuth.auth || "{}");
      if (authData && authData.AcademicYear) {
        setAcademicYears(authData.AcademicYear);
      }
    }
  };

  // Fetch classes and academic years on component mount
  useEffect(() => {
    fetchAcademicYearsFromStorage();
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Handle class fetching errors
  useEffect(() => {
    if (classError) {
      toast.error("Failed to load classes. Please try again.");
    }
  }, [classError]);

  // Fetch timetables based on backend filters
  useEffect(() => {
    // Create a new object with only non-empty filter parameters
    const activeFilters = Object.fromEntries(
      Object.entries(backendFilters).filter(([key, value]) => value)
    );
  
    // Dispatch fetchTimetables with the activeFilters
    dispatch(fetchTimetables(activeFilters));
  }, [backendFilters, dispatch]);
  

  // Update filtered timetables when timetables or frontend filter changes
  useEffect(() => {
    if (frontendFilter.trim() === "") {
      setFilteredTimetables(timetables);
    } else {
      const filtered = timetables.filter((timetable) =>
        timetable.name.toLowerCase().includes(frontendFilter.toLowerCase())
      );
      setFilteredTimetables(filtered);
    }
  }, [timetables, frontendFilter]);

  // Handle backend filter changes
  const handleBackendFilterChange = (updatedFilters) => {
    setBackendFilters({
      classId: updatedFilters.classId || "",
      type: updatedFilters.type || "",
      status: updatedFilters.status || "",
      academicYear: updatedFilters.academicYear || "",
    });
  };

  // Handle frontend filter changes (Name search)
  const handleFrontendFilterChange = (name) => {
    setFrontendFilter(name);
  };

  // Handle create button click to navigate to a new route
  const handleCreateTimeTable = () => {
    navigate("/timetable/create-new-timeTable");
  };

  // Handle delete action
  const handleDelete = (id) => {
    dispatch(deleteTimetable(id))
      .unwrap()
      .then(() => {
        toast.success("Timetable deleted successfully.");
      })
      .catch((err) => {
        toast.error("Failed to delete timetable.");
      });
  };

  // Handle fetching errors
  useEffect(() => {
    if (errorFetch) {
      toast.error(`Failed to load timetables: ${errorFetch}`);
    }
  }, [errorFetch]);

  return (
    <div className="relative p-5">
      {/* Filter Navigation */}
      <TopNavigationWithFilters
        onBackendFilterChange={handleBackendFilterChange}
        onFrontendFilterChange={handleFrontendFilterChange}
        academicYears={academicYears}
      />

      {/* Button to create a new timetable */}
      {(role !== "parent" && role !== "student") && (
        <div className="flex justify-start mb-4 ml-5">
          <button
            onClick={handleCreateTimeTable}
            className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            + Create TimeTable
          </button>
        </div>
      )}


      {/* Display list of timetables */}
      <TimeTableList
        timetables={filteredTimetables}
        loading={loadingFetch || classLoading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TimeTableMainSection;
