import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchParentTimetable } from "../../../Store/Slices/Parent/TimeTable/parentTimeTable.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ParentTimeTableList from "./Components/ParentTimeTableList";

const TimeTableMainSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("admTimeTable");

  const role = useSelector((store) => store.common.auth.role);

  // Destructure from Redux store
  const { timetables, loadingFetch, errorFetch } = useSelector(
    (state) => state.Parent.parentTimetable
  );
  const {
    classes,
    loading: classLoading,
    error: classError,
  } = useSelector((state) => state.admin.class);

  const [academicYears, setAcademicYears] = useState([]);
  const [backendFilters, setBackendFilters] = useState({
    classId: "",
    type: "",
    status: "",
    academicYear: "",
  });
  const [frontendFilter, setFrontendFilter] = useState("");
  const [filteredTimetables, setFilteredTimetables] = useState([]);

  /**
   * Fetch academic years from localStorage.
   */
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

  /**
   * On mount, fetch academic years and (if not parent/student) classes.
   */
  useEffect(() => {
    fetchAcademicYearsFromStorage();
    if (role !== "parent" && role !== "student") {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, role]);

  /**
   * Show a toast if class fetch fails (for non-parent/student).
   */
  useEffect(() => {
    if (classError && role !== "parent" && role !== "student") {
      toast.error(t("Failed to load classes. Please try again."));
    }
  }, [classError, role, t]);

  /**
   * Fetch parent timetables from the server based on active backend filters.
   */
  useEffect(() => {
    // Create a new object with only non-empty filter parameters
    const activeFilters = Object.fromEntries(
      Object.entries(backendFilters).filter(([_, value]) => value)
    );
    dispatch(fetchParentTimetable(activeFilters));
  }, [backendFilters, dispatch]);

  /**
   * Show a toast if there's an error fetching timetables.
   */
  useEffect(() => {
    if (errorFetch) {
      toast.error(`${t("Failed to load timetables")}: ${errorFetch}`);
    }
  }, [errorFetch, t]);

  /**
   * Filter timetables in memory by name (frontend filter).
   * We first ensure we work with an array regardless of data shape.
   */
  useEffect(() => {
    const timetableArray = Array.isArray(timetables)
      ? timetables
      : timetables?.timetables || [];
    if (frontendFilter.trim() === "") {
      setFilteredTimetables(timetableArray);
    } else {
      const filtered = timetableArray.filter((timetable) =>
        timetable.name.toLowerCase().includes(frontendFilter.toLowerCase())
      );
      setFilteredTimetables(filtered);
    }
  }, [timetables, frontendFilter]);

  /**
   * Update backend filters (e.g., type, status, academicYear).
   */
  const handleBackendFilterChange = (updatedFilters) => {
    setBackendFilters({
      classId: updatedFilters.classId || "",
      type: updatedFilters.type || "",
      status: updatedFilters.status || "",
      academicYear: updatedFilters.academicYear || "",
    });
  };

  /**
   * Update the local name-based (frontend) filter.
   */
  const handleFrontendFilterChange = (name) => {
    setFrontendFilter(name);
  };

  return (
    <div className="relative p-5">
      {/* Filter Navigation */}
      <TopNavigationWithFilters
        onBackendFilterChange={handleBackendFilterChange}
        onFrontendFilterChange={handleFrontendFilterChange}
        academicYears={academicYears}
      />

      {/* Timetables List */}
      <ParentTimeTableList
        timetables={filteredTimetables}
        loading={loadingFetch || classLoading}
        // onDelete={handleDelete} // Uncomment if deletion is enabled
      />
    </div>
  );
};

export default TimeTableMainSection;
