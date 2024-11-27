// TimeTableMainSection.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimeTableList from "./Components/TimeTableList";
import { fetchStudentTimetable } from "../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
import { useTranslation } from "react-i18next";

const TimeTableMainSection = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admTimeTable");

  // Fetch only the student's timetables from Redux
  const { timetables, loadingFetch, errorFetch } = useSelector((state) => ({
    timetables: state.student?.studentTimetable?.timetables || [],
    loadingFetch: state.student?.studentTimetable?.loading || false,
    errorFetch: state.student?.studentTimetable?.error || null,
  }));

  const [academicYears, setAcademicYears] = useState([]);
  const [frontendFilter, setFrontendFilter] = useState("");
  const [academicYearFilter, setAcademicYearFilter] = useState("");
  const [filteredTimetables, setFilteredTimetables] = useState([]);

  // Function to fetch academic years from localStorage
  const fetchAcademicYearsFromStorage = useCallback(() => {
    const persistedAuth = localStorage.getItem("persist:auth");
    if (persistedAuth) {
      try {
        const parsedAuth = JSON.parse(persistedAuth);
        const authData = JSON.parse(parsedAuth.auth || "{}");
        if (authData && authData.AcademicYear) {
          setAcademicYears(authData.AcademicYear);
        }
      } catch (error) {
        console.error("Error parsing academic years from localStorage:", error);
      }
    }
  }, []);

  // Fetch timetables for students
  useEffect(() => {
    fetchAcademicYearsFromStorage();
    dispatch(fetchStudentTimetable());
  }, [dispatch, fetchAcademicYearsFromStorage]);

  // Update filtered timetables when timetables, frontend filter, or academic year filter changes
  useEffect(() => {
    let filtered = timetables;

    if (frontendFilter.trim() !== "") {
      filtered = filtered.filter((timetable) =>
        timetable.name.toLowerCase().includes(frontendFilter.toLowerCase())
      );
    }

    if (academicYearFilter.trim() !== "") {
      filtered = filtered.filter(
        (timetable) => timetable.academicYear === academicYearFilter
      );
    }

    setFilteredTimetables(filtered);
  }, [timetables, frontendFilter, academicYearFilter]);

  // Handle frontend filter changes (Name search)
  const handleFrontendFilterChange = useCallback((name) => {
    setFrontendFilter(name);
  }, []);

  // Handle academic year filter changes
  const handleAcademicYearFilterChange = useCallback((year) => {
    setAcademicYearFilter(year);
  }, []);

  // Log error if fetching timetables fails
  useEffect(() => {
    if (errorFetch) {
      console.error(`${t("Failed to load timetables")}: ${errorFetch}`);
    }
  }, [errorFetch, t]);

  return (
    <div className="relative p-5">
      {/* Filter Navigation */}
      <TopNavigationWithFilters
        onFrontendFilterChange={handleFrontendFilterChange}
        onAcademicYearFilterChange={handleAcademicYearFilterChange} // Added
        academicYears={academicYears}
      />

      {/* Display list of timetables */}
      <TimeTableList
        timetables={filteredTimetables}
        loading={loadingFetch}
        onDelete={null} // Students cannot delete timetables
      />
    </div>
  );
};

export default TimeTableMainSection;
