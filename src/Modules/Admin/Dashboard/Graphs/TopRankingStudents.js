import React, { memo, useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { Tooltip, Skeleton, Empty, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { fetchTopStudents } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";

import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const { Option } = Select;

// Helper to safely truncate admission number
const truncateAdmNumber = (adm = "") => {
  const maxLength = 7;
  return adm.length > maxLength ? adm.slice(0, maxLength) + "..." : adm;
};

// Helper to safely display score
const getDisplayScore = (rawScore, t) => {
  const score = parseFloat(rawScore);
  if (!isNaN(score) && score !== Infinity && score !== -Infinity) {
    return `${score.toFixed(2)} %`;
  }
  return t("N/A");
};

// Skeleton placeholders used during loading
const renderTopCardPlaceholder = (key) => (
  <div key={key} className="text-center p-4 border rounded-lg relative w-[30%]">
    <div className="relative mt-10 flex flex-col items-center">
      <Skeleton.Avatar active size={56} shape="circle" />
      <Skeleton
        active
        title={false}
        paragraph={{ rows: 2, width: ["60%", "80%"] }}
        className="mt-4 w-full"
      />
    </div>
  </div>
);

const renderListRowPlaceholder = (key) => (
  <div
    key={key}
    className="flex items-center justify-between p-2 px-5 border rounded-md w-full gap-2"
  >
    <div className="flex items-center w-[40%]">
      <Skeleton.Input active style={{ width: 24 }} />
      <Skeleton.Avatar active size={40} shape="circle" className="ml-6" />
      <Skeleton.Input active style={{ width: 80, marginLeft: 8 }} />
    </div>
    <div className="ml-20">
      <Skeleton.Input active style={{ width: 80 }} />
    </div>
    <div className="w-[30%] ml-2">
      <Skeleton.Input active style={{ width: 80 }} />
    </div>
  </div>
);

// Custom empty placeholder for missing student (when not loading)
const renderTopCardEmpty = (key, t) => (
  <div
    key={key}
    className="text-center p-4 border-dashed border-2 border-gray-300 rounded-lg relative w-[30%] flex items-center justify-center h-56"
  >
    <span className="text-gray-500 text-sm">{t("No student yet to come")}</span>
  </div>
);

const renderListRowEmpty = (key, t) => (
  <div
    key={key}
    className="flex items-center justify-between py-4 px-5 border-dashed border-2 border-gray-300 rounded-md w-full gap-4"
  >
    <span className="text-gray-500 text-sm">{t("No student yet to come")}</span>
  </div>
);

// Render a top student card (or empty placeholder if student is null)
const renderTopCard = (student, index, t) => {
  if (!student) {
    return renderTopCardEmpty(`top-empty-${index}`, t);
  }
  const truncatedNumber = truncateAdmNumber(student?.admissionNumber || "");
  return (
    <div
      key={student._id || index}
      className="text-center p-4 border min-h-40 rounded-lg relative w-[30%]"
    >
      {/* Crown for 1st */}
      {index === 0 && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: "25px" }}
        >
          <FaCrown className="w-20 h-8 text-yellow-400" />
        </div>
      )}
      <div className="relative mt-10">
        <img
          className="w-14 h-14 rounded-full mx-auto object-cover"
          src={student?.studentProfile || profileIcon}
          alt={student?.studentName || t("N/A")}
        />
        {index !== 0 && (
          <h3 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-md mb-1 font-medium bg-white px-2">
            {t("Top")} {index === 1 ? 2 : 3}
          </h3>
        )}
      </div>
      <div>
        {student?.studentName?.slice(0, 10) || t("0")}
        {student?.studentName && student?.studentName.length > 10 && (
          <span title={student?.studentName}>...</span>
        )}
      </div>
      <p className="mb-2 text-sm">
        {t("Adm")}:{" "}
        <Tooltip title={student?.admissionNumber || t("N/A")}>
          <span className="text-gray-600 text-sm">
            {truncatedNumber || t("N/A")}
          </span>
        </Tooltip>
      </p>
      <span
        style={{ background: "linear-gradient(to right, #fce7f3, #e9d5ff)" }}
        className="px-3 rounded-sm"
      >
        <span
          style={{
            background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("Score")}: {getDisplayScore(student?.score, t)}
        </span>
      </span>
    </div>
  );
};

// Render a list row for a student (or empty placeholder if student is null)
const renderListRow = (student, index, t) => {
  if (!student) {
    return renderListRowEmpty(`list-empty-${index}`, t);
  }
  const truncatedNumber = truncateAdmNumber(student?.admissionNumber || "");
  return (
    <div
      key={student._id || `list-${index}`}
      className="flex items-center justify-between p-2 px-5 border rounded-md w-full gap-2"
    >
      {/* Rank, Profile, and Name */}
      <div className="flex items-center w-[40%]">
        <span className="mr-3">{index + 4}</span>
        <img
          className="w-10 h-10 rounded-full mr-4"
          src={student?.studentProfile || profileIcon}
          alt={student?.studentName || t("N/A")}
        />
        <span>
          {student?.studentName?.slice(0, 15) || t("0")}
          {student?.studentName && student?.studentName.length > 15 && (
            <span title={student?.studentName}>...</span>
          )}
        </span>
      </div>
      {/* Score */}
      <div
        className="rounded-sm w-auto"
        style={{ background: "linear-gradient(to right, #fce7f3, #e9d5ff)" }}
      >
        <span
          style={{
            background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="px-3"
        >
          {t("Score")}: {getDisplayScore(student?.score, t)}
        </span>
      </div>
      {/* Admission Number */}
      <div className="w-[30%]">
        <span>
          {t("Adm")}:{" "}
          <Tooltip title={student?.admissionNumber || t("N/A")}>
            <span className="text-gray-600 ml-1">
              {truncatedNumber || t("N/A")}
            </span>
          </Tooltip>
        </span>
      </div>
    </div>
  );
};

const TopRankingStudents = () => {
  const { t } = useTranslation("admTopRanking");
  const dispatch = useDispatch();

  const {
    topStudents = [],
    loadingTopStudents,
    errorTopStudents,
  } = useSelector((state) => state?.admin?.adminDashboard ?? {});

  const { classes = [], loading: loadingClasses } = useSelector(
    (store) => store?.admin?.class ?? {}
  );

  const [selectedClass, setSelectedClass] = useState("");

  // Fetch classes if available; then fetch top students for the first class
  useEffect(() => {
    if (classes?.length > 0) {
      const initialClassId = classes[0]?._id || "";
      setSelectedClass(initialClassId);
      dispatch(fetchTopStudents(initialClassId));
    }
  }, [dispatch, classes]);

  // Handler for changing the class in the Select
  const handleSelectChange = (value) => {
    setSelectedClass(value);
    dispatch(fetchTopStudents(value));
  };

  // Reset filter to the first class (if needed)
  const handleResetFilter = () => {
    if (classes.length > 0) {
      const firstClassId = classes[0]._id || "";
      setSelectedClass(firstClassId);
      dispatch(fetchTopStudents(firstClassId));
    }
  };

  // Combine loading states
  const isLoading = loadingTopStudents || loadingClasses;

  // Determine if there is no data or error
  const noData = (topStudents?.length ?? 0) === 0 || errorTopStudents;

  // For displaying exactly 6 students (first 3 for cards, next 3 for list)
  const totalDisplayCount = 6;
  // Use only the first 6 students from fetched data
  const displayStudents = topStudents.slice(0, totalDisplayCount);
  const topCards = displayStudents.slice(0, 3);
  const listRows = displayStudents.slice(3, totalDisplayCount);

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.GET_TOP_STUDENTS}
      title={t("Top Student")}
    >
      <div className="bg-white p-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("Top Ranking Students")}</h2>
          {/* Class Selector */}
          <Select
            value={selectedClass}
            onChange={handleSelectChange}
            disabled={isLoading}
          >
            {classes?.map((c) => (
              <Option key={c?._id} value={c?._id}>
                {c?.className || t("N/A")}
              </Option>
            ))}
          </Select>
        </div>

        {/* Content */}
        {noData && !isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full mt-10 py-20 text-gray-400 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_DEFAULT}
              description={
                <span className="text-lg text-gray-500">
                  {errorTopStudents
                    ? t("Error while fetching")
                    : t("No Data Found")}
                </span>
              }
            />
          </div>
        ) : isLoading ? (
          <>
            {/* While loading, show skeletons for all six positions */}
            <div className="flex w-full h-auto py-2 gap-4">
              {Array.from({ length: 3 }).map((_, idx) =>
                renderTopCardPlaceholder(`loading-top-${idx}`)
              )}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {Array.from({ length: 3 }).map((_, idx) =>
                renderListRowPlaceholder(`loading-list-${idx}`)
              )}
            </div>
          </>
        ) : (
          <>
            {/* Top 3 Student Cards */}
            <div className="flex w-full justify-center mb-3 h-auto py-2 gap-4">
              {[0, 1, 2].map((i) => renderTopCard(topCards[i], i, t))}
            </div>
            {/* Remaining Student List Rows */}
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => renderListRow(listRows[i], i, t))}
            </div>
          </>
        )}
      </div>
    </ProtectedSection>
  );
};

export default memo(TopRankingStudents);
