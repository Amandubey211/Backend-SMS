import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentTimetable } from "../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import StudentTimeTableList from "./Components/StudentTimeTableList";

const TimeTableMainSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("admTimeTable");

  const role = useSelector((store) => store.common.auth.role);

  // Redux data: Student Timetable & Classes (optional)
  const { timetables, loadingFetch, errorFetch } = useSelector(
    (state) => state.student.studentTimetable
  );
  const {
    classes,
    loading: classLoading,
    error: classError,
  } = useSelector((state) => state.admin.class);

  // Local state for academic years (from localStorage) & filters
  const [academicYears, setAcademicYears] = useState([]);
  const [filters, setFilters] = useState({
    name: "", // name-based (frontend) filter
    type: "", // type-based (backend) filter
  });
  const [filteredTimetables, setFilteredTimetables] = useState(timetables);

  /**
   * Debounced function for real-time name search.
   * Waits 300ms after the user stops typing.
   */
  const debouncedFilter = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({
          ...prev,
          name: value,
        }));
      }, 300),
    []
  );

  /**
   * Load academic years from localStorage.
   */
  const fetchAcademicYearsFromStorage = () => {
    const persistedAuth = localStorage.getItem("persist:auth");
    if (persistedAuth) {
      const parsedAuth = JSON.parse(persistedAuth);
      const authData = JSON.parse(parsedAuth.auth || "{}");
      if (authData?.AcademicYear) {
        setAcademicYears(authData.AcademicYear);
      }
    }
  };

  /**
   * On mount, fetch academic years & classes (if not parent/student).
   */
  useEffect(() => {
    fetchAcademicYearsFromStorage();
    if (role !== "parent" && role !== "student") {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, role]);

  /**
   * If class fetch fails and user is not parent/student, show error toast.
   */
  useEffect(() => {
    if (classError && role !== "parent" && role !== "student") {
      toast.error(t("Failed to load classes. Please try again."));
    }
  }, [classError, role, t]);

  /**
   * Fetch timetables from the server, applying type filter or other backend filters.
   */
  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );
    dispatch(fetchStudentTimetable(activeFilters));
  }, [filters, dispatch]);

  /**
   * If there's an error fetching timetables, show a toast.
   */
  useEffect(() => {
    if (errorFetch) {
      toast.error(`${t("Failed to load timetables")}: ${errorFetch}`);
    }
  }, [errorFetch, t]);

  /**
   * Once timetables are fetched, apply local (name + type) filter to produce final results.
   */
  useEffect(() => {
    if (timetables && timetables.length > 0) {
      const filtered = timetables.filter((tb) => {
        const matchesName = tb.name
          .toLowerCase()
          .includes(filters.name.toLowerCase());
        const matchesType = filters.type === "" || tb.type === filters.type;
        return matchesName && matchesType;
      });
      setFilteredTimetables(filtered);
    } else {
      setFilteredTimetables(timetables || []);
    }
  }, [timetables, filters]);

  /**
   * Handle changes from the top filters (e.g. type).
   */
  const handleBackendFilterChange = (updatedFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFilters,
    }));
  };

  /**
   * Handle the name-based (frontend) filter via the debounced function.
   */
  const handleFrontendFilterChange = (name) => {
    debouncedFilter(name);
  };

  return (
    <div className="relative p-5">
      {/* Filter Navigation */}
      {/* <TopNavigationWithFilters
        onBackendFilterChange={handleBackendFilterChange}
        onFrontendFilterChange={handleFrontendFilterChange}
        academicYears={academicYears}
      /> */}

      {/* Display the filtered list of timetables */}

      <StudentTimeTableList
        timetables={filteredTimetables}
        loading={loadingFetch || classLoading}
      />
    </div>
  );
};

export default TimeTableMainSection;
