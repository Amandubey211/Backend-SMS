import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildren } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action';
import Spinner from "../../../../Components/Common/Spinner";
import { FaChild } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Memoized StudentCard to prevent unnecessary re-renders
const StudentCard = React.memo(({ student, index }) => {
  const { t } = useTranslation('prtChildrens');
  const defaultImage = "https://via.placeholder.com/150";
  const profileImage = student?.profile || defaultImage;

  const studentClass = student?.class || "N/A";
  const admissionNumber = student?.admissionNumber || "N/A";
  const section = student?.section || "N/A";
  const group = student?.group || "N/A";

  return (
    <div className="border-b p-4 pb-4 pt-6 text-center relative border-gray-300">
      <div className="absolute top-2 left-2 bg-gray-100 text-gray-800 py-1 px-2 rounded-l-sm rounded-r-sm text-sm">
        {t("Child")}: {index + 1}
      </div>
      <img
        src={profileImage}
        alt={student?.name || 'Unknown'}
        className="w-20 h-20 rounded-full mx-auto mb-2"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <h2 className="text-lg font-semibold mb-1">{student?.name || "N/A"}</h2>
      <div className="text-gray-600 text-sm mb-1">
        {t("Class")}: {studentClass} | {t("Id")}: {admissionNumber} | {t("Section")}: {section}
      </div>
      <div className="text-green-600 text-sm">{t("Group")}: {group}</div>
    </div>
  );
});

const StudentParentCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('prtChildrens');

  // Use Redux state for students, loading, and errors
  const { childrenData: students = [], loadingChildren, errorChildren } = useSelector((state) => state?.Parent?.dashboard || {});

  // Fetch students once on mount
  useEffect(() => {
    if (!students.length) {
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
      <p className="text-gray-600 text-lg text-center mt-2">{errorChildren}: Unable to fetch Child Data</p>
    </div>
  ), [errorChildren]);

  return (
    <div className="relative h-3/5">
      <div className="flex justify-between p-4 pb-3 items-center px-6">
        <h2 className="text-lg font-semibold text-gray-600">{t("My Children")}</h2>
        {!loadingChildren && !errorChildren && students?.length > 3 && (
          <button
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
            onClick={handleNavigate}
          >
            {t("See All")}
          </button>
        )}
      </div>

      {/* Content area with conditional rendering */}
      <div className={`${(loadingChildren || errorChildren || students?.length === 0) ? 'overflow-x-auto shadow rounded-lg p-4 m-3' : ''}`}>
        {/* Spinner during loading */}
        {loadingChildren && (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        )}

        {/* No Children Message when 404 or message contains 404 */}
        {!loadingChildren && (errorChildren?.includes("404") || errorChildren === "No children found for this guardian.") && renderNoChildrenMessage()}

        {/* Original error message for other errors */}
        {!loadingChildren && errorChildren && !errorChildren.includes("404") && errorChildren !== "No children found for this guardian." && renderErrorMessage()}

        {/* Render children if available */}
        {!loadingChildren && !errorChildren && students?.length > 0 && (
          <>
            {students.slice(0, 3).map((student, index) => (
              <StudentCard key={student?.id || index} student={student} index={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(StudentParentCard);
