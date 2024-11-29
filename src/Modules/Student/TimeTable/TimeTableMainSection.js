import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimeTableList from "./Components/TimeTableList";
import { fetchStudentTimetable } from "../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";

const TimeTableMainSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("admTimeTable");

  const role = useSelector((store) => store.common.auth.role);

  const { timetables, loadingFetch, errorFetch } = useSelector(
    (state) => state.student.studentTimetable
  );
  const { classes, loading: classLoading, error: classError } = useSelector(
    (state) => state.admin.class
  );

  const [academicYears, setAcademicYears] = useState([]);
  const [filters, setFilters] = useState({
    name: "", // Name filter
    type: "", // Type filter
  });
  const [filteredTimetables, setFilteredTimetables] = useState(timetables);

  // Debounced function for real-time name search
  const debouncedFilter = useMemo(
    () =>
      debounce((value) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          name: value, // Update name filter
        }));
      }, 300),
    []
  );


  // Fetch academic years from localStorage
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

  useEffect(() => {
    fetchAcademicYearsFromStorage();
    if (role !== "parent" && role !== "student") {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, role]);

  useEffect(() => {
    if (classError && role !== "parent" && role !== "student") {
      toast.error(t("Failed to load classes. Please try again."));
    }
  }, [classError, role]);

  // Fetch timetables based on backend filters (e.g., type, status)
  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value)
    );

    // Only trigger fetch if there are any active filters
   
      dispatch(fetchStudentTimetable(activeFilters));
    
  }, [filters, dispatch]);

  useEffect(() => {
    if (errorFetch) {
      toast.error(`${t("Failed to load timetables")}: ${errorFetch}`);
    }
  }, [errorFetch]);

  // Filter timetables based on both frontend (name) and backend (type) filters
  useEffect(() => {
    if (timetables && timetables?.length > 0) {
      const filtered = timetables.filter((timetable) => {
        const matchesName = timetable.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesType = filters.type === "" || timetable.type === filters.type;
        return matchesName && matchesType;
      });
      setFilteredTimetables(filtered);
    } else {
      setFilteredTimetables(timetables || []);
    }
  }, [timetables, filters]); // Apply both name and type filters


  // Handle backend filter changes (e.g., type)
  const handleBackendFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  // Handle frontend filter changes (name search)
  const handleFrontendFilterChange = (name) => {
    debouncedFilter(name); // Use debounced value for real-time search
  };

  const handleCreateTimeTable = () => {
    navigate("/timetable/create-new-timeTable");
  };

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
            {t("+ Create TimeTable")}
          </button>
        </div>
      )}

      {/* Display filtered list of timetables */}
      <TimeTableList
        timetables={filteredTimetables}
        loading={loadingFetch || classLoading}
      />
    </div>
  );
};

export default TimeTableMainSection;
