import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildren } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action';
import { FaChild } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png';
import { DashMyChildrenSkeleton } from '../../Skeletons';


// Memoized StudentCard to prevent unnecessary re-renders
const StudentCard = React.memo(({ student, index }) => {
  const { t } = useTranslation('prtChildrens');
  const profileImage = student?.profile;

  const studentClass = student?.class || "N/A";
  const admissionNumber = student?.admissionNumber || "N/A";
  const section = student?.section || "N/A";
  const group = student?.group || "N/A";

  return (
    <>
      <div className="p-4 pb-4 pt-6 text-center relative border-gray-300">
        {/* Child Label */}
        <div className="absolute top-2 left-2 bg-gray-100 text-gray-800 py-1 px-2 rounded-l-sm rounded-r-sm text-sm">
          {t("Child")}: {index + 1}
        </div>

        {/* Student Image with Frame Effect */}
        <div className="w-24 h-24 mx-auto mb-2 border-gray-300 border-2 rounded-full p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden border-white border-2">
            <img
              src={profileImage?.length ? profileImage : profileIcon} // Optional chaining for profileImage
              alt={student?.name || "Unknown"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Student Name */}
        <h2 className="text-lg font-semibold mb-1">{student?.name || "N/A"}</h2>

        {/* Class, ID, and Section */}
        <div className="text-gray-600 text-sm mb-1">
          {t("Class")}: {studentClass} | {t("Id")}: {admissionNumber} | {t("Section")}: {section}
        </div>

        {/* Group */}
        <div className="text-green-600 text-sm">
          {t("Group")}: {group}
        </div>
      </div>
    </>
  );
});

const StudentParentCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('prtChildrens');

  // Use Redux state for students, loading, and errors
  const { childrenData: students = [], loadingChildren, errorChildren } = useSelector((state) => state?.Parent?.dashboard || {}); // Optional chaining

  // Fetch students once on mount
  useEffect(() => {
    if (!students?.length) { // Optional chaining for students
      dispatch(fetchChildren());
    }
  }, [dispatch, students]);

  // Memoized no children message
  const renderNoChildrenMessage = useCallback(() => (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <FaChild className="text-gray-400 text-6xl mb-4" />
      <p className="text-gray-600 text-lg">{t("No Children Found!")}</p>
    </div>
  ), [t]);

  // Memoized navigation function
  const handleNavigate = useCallback(() => {
    navigate("/children");
  }, [navigate]);

  // Memoized function to render the error message
  const renderErrorMessage = useCallback(() => (
    <div className="flex flex-col items-center justify-center mt-6">
      <FaChild className="text-gray-400 text-8xl mb-4" />
      <p className="text-gray-600 text-lg text-center mt-2">{errorChildren || "Error"}: Unable to fetch Child Data</p> {/* Optional chaining */}
    </div>
  ), [errorChildren]);





  return (
    <div className="relative h-3/5">
      <div className="flex justify-between p-4 pb-3 items-center px-2 pt-2">
        <h2 className="text-lg font-semibold text-gray-600">
          {t("My Children")} {students?.length || 0} {/* Optional chaining */}
        </h2>
        {!loadingChildren && !errorChildren && students?.length > 0 && ( // Optional chaining
          <div className="inline-block">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out 
                       text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
                       hover:bg-gray-100 hover:shadow-md"
              onClick={handleNavigate}
            >
              {t("See All")}
            </button>
          </div>

        )}
      </div>

      {/* Content area with conditional rendering */}
      <div className={`rounded-lg p-4 m-3 mb-7 bg-transparent ${loadingChildren || errorChildren || students?.length === 0 ? 'h-auto' : ''}`}>

        {/* Skeleton during loading */}
        {loadingChildren && (
          <div className="flex justify-center items-center h-48">
            <DashMyChildrenSkeleton />
          </div>
        )}

        {/* No Children Message when 404 or message contains 404 */}
        {!loadingChildren && (errorChildren?.includes("404") || errorChildren === "No children found for this guardian.") && renderNoChildrenMessage()}

        {/* Original error message for other errors */}
        {!loadingChildren && errorChildren && !errorChildren?.includes("404") && errorChildren !== "No children found for this guardian." && renderErrorMessage()}

        {/* Render children if available */}
        {!loadingChildren && !errorChildren && students?.length > 0 && ( // Optional chaining
          <>
            {students?.slice(0, 1)?.map((student, index) => ( // Optional chaining
              <StudentCard key={student?.id || index} student={student} index={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(StudentParentCard);
