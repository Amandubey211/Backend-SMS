import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildren } from "../../../../Store/Slices/Parent/Dashboard/dashboard.action";
import { FaChild, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import { DashMyChildrenSkeleton } from "../../Skeletons";

// -- SingleChildCard (static display)
const SingleChildCard = ({ student, index }) => {
  const { t } = useTranslation("prtChildrens");
  const profileImage = student?.profile || profileIcon;
  const studentClass = student?.class || "N/A";
  const admissionNumber = student?.admissionNumber || "N/A";
  const section = student?.sectionName || "N/A";
  const group = student?.group || "N/A";

  return (
    <div className="mt-1 text-center rounded-lg bg-white relative w-[80%]">
      {/* Label: Child # */}
      <div className="absolute top-2 left-2 bg-gray-100 text-gray-800 py-1 px-2 rounded text-xs">
        {t("Child")}: {index + 1}
      </div>

      {/* Profile Image */}
      <div className="w-24 h-24 mx-auto mb-2 border-2 border-gray-300 rounded-full overflow-hidden">
        <img
          src={profileImage}
          alt={student?.name || "Unknown"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Student Info */}
      <h2 className="text-base font-semibold mb-1">{student?.name || "N/A"}</h2>
      <div className="text-sm text-gray-600">
        {t("Class")}: {studentClass} | {t("Id")}: {admissionNumber} |{" "}
        {t("Section")}: {section}
      </div>
      <div className="text-sm text-green-600 mt-1">
        {t("Group")}: {group}
      </div>
    </div>
  );
};

// -- Main Component
const StudentParentCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("prtChildrens");

  // Redux state
  const {
    childrenData: students = [],
    loadingChildren,
    errorChildren,
  } = useSelector((state) => state?.Parent?.dashboard || {});

  // Local state for carousel index (only if more than one child)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  // Reset index if students change
  useEffect(() => {
    setCurrentIndex(0);
  }, [students]);

  // Memoized messages
  const renderNoChildrenMessage = useCallback(
    () => (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <FaChild className="text-gray-400 text-6xl mb-4" />
        <p className="text-gray-600 text-lg">{t("No Children Found!")}</p>
      </div>
    ),
    [t]
  );

  const handleNavigate = useCallback(() => {
    navigate("/children");
  }, [navigate]);

  // const renderErrorMessage = useCallback(
  //   () => (
  //     <div className="flex flex-col items-center justify-center mt-6">
  //       <FaChild className="text-gray-400 text-8xl mb-4" />
  //       <p className="text-gray-600 text-lg text-center mt-2">
  //         {errorChildren || "Error"}: Unable to fetch Child Data
  //       </p>
  //     </div>
  //   ),
  //   [errorChildren]
  // );

  // Navigation handlers for multiple children
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % students.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1));
  };

  return (
    <div className="relative py-2">
      {/* Header */}
      <div className="flex justify-between py-4 px-2 items-center">
        <h2 className="text-lg font-semibold text-gray-600 flex items-center">
          {t("My Children")}
          <div
            className="ml-2 flex items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)",
              width: "32px",
              height: "32px",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(to right, #C83B62 0%, #7F35CD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="text-sm font-semibold"
            >
              {(students?.length || 0).toString().padStart(2, "0")}
            </span>
          </div>
        </h2>

        {/* Header Button: "View Details" if one child; "View All" if more than one */}
        {!loadingChildren && !errorChildren && students?.length > 0 && (
          <div className="inline-block">
            {students.length === 1 ? (
              <button
                className="px-4 py-2 border border-gray-300 rounded-md transition-all duration-300 ease-in-out 
                       text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
                       hover:bg-gray-100 hover:shadow-md"
                onClick={handleNavigate}
              >
                {t("View Details")}
              </button>
            ) : (
              <button
                className="px-4 py-2 border border-gray-300 rounded-md transition-all duration-300 ease-in-out 
                       text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
                       hover:bg-gray-100 hover:shadow-md"
                onClick={handleNavigate}
              >
                {t("View All")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="">
        {/* Loading Skeleton */}
        {loadingChildren && (
          <div className="flex justify-center items-center h-48">
            <DashMyChildrenSkeleton />
          </div>
        )}

        {/* No Children or Empty Data */}
        {!loadingChildren && students && students.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <FaChild className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-600 text-lg">{t("No Children Found!")}</p>
          </div>
        )}

        {/* Other Errors */}
        {!loadingChildren &&
          errorChildren &&
          !errorChildren?.includes("404") &&
          errorChildren !== "No children found for this guardian."}

        {/* Render children if available */}
        {!loadingChildren && !errorChildren && students?.length > 0 && (
          <>
            {students.length === 1 ? (
              <div className="flex item-center justify-center">
                <SingleChildCard student={students[0]} index={0} />
              </div>
            ) : (
              <div className="relative flex items-center justify-center group">
                {/* Previous arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 p-2 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FaChevronLeft size={24} />
                </button>

                {/* Current child card */}
                <SingleChildCard
                  student={students[currentIndex]}
                  index={currentIndex}
                />

                {/* Next arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 p-2 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(StudentParentCard);
