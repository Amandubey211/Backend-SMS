import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { fetchChildren } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action'; // Import Redux action
import Spinner from "../../../../Components/Common/Spinner"; // Import Spinner
import { FaChild } from 'react-icons/fa';

// Memoized StudentCard to prevent unnecessary re-renders
const StudentCard = React.memo(({ student, index }) => {
  const defaultImage = "https://via.placeholder.com/150";
  const profileImage = student.profile || defaultImage;

  const studentClass = student.class || "N/A";
  const admissionNumber = student.admissionNumber || "N/A";
  const section = student.section || "N/A";
  const group = student.group || "N/A";

  return (
    <div className="border-b p-4 pb-4 pt-6 text-center relative border-gray-300">
      <div className="absolute top-2 left-2 bg-gray-100 text-gray-800 py-1 px-2 rounded-l-sm rounded-r-sm text-sm">
        Child: {index + 1}
      </div>
      <img
        src={profileImage}
        alt={student.name}
        className="w-20 h-20 rounded-full mx-auto mb-2"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <h2 className="text-lg font-semibold mb-1">{student.name || "N/A"}</h2>
      <div className="text-gray-600 text-sm mb-1">
        Class: {studentClass} | Id: {admissionNumber} | Section: {section}
      </div>
      <div className="text-green-600 text-sm">Group: {group}</div>
    </div>
  );
});

const StudentParentCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use Redux state for students with caching to prevent redundant fetching
  const { childrenData: students, loading, error } = useSelector((state) => state.Parent.dashboard);

  // Fetch students only once when the component mounts
  useEffect(() => {
    if (!students || students.length === 0) {
      dispatch(fetchChildren());
    }
  }, [dispatch, students]);

  // Memoize renderErrorOrNoChildren to prevent re-creating it on each render
  const renderErrorOrNoChildren = useCallback((message) => (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <FaChild className="text-gray-400 text-6xl mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  ), []);

  // Memoize navigation to prevent re-creating the function on each render
  const handleNavigate = useCallback(() => {
    navigate("/children");
  }, [navigate]);

  return (
    <div className="relative h-3/5">
      <div className="flex justify-between p-4 pb-3 items-center px-6">
        <h2 className="text-lg font-semibold text-gray-600">My Children</h2>
        {!loading && !error && students?.length > 3 && (
          <button
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
            onClick={handleNavigate}
          >
            See All
          </button>
        )}
      </div>
  
      {/* Conditionally apply overflow-x-auto, shadow, and rounded-lg only when there's no data */}
      <div className={`${(loading || error || students?.length === 0) ? 'overflow-x-auto shadow rounded-lg p-4 m-3' : ''}`}>
        {loading && <Spinner />} {/* Custom spinner used here */}
        {!loading && error && renderErrorOrNoChildren("No Children Data Found!")}
        {!loading && !error && students?.length === 0 && renderErrorOrNoChildren("No Children Found!")}
        {!loading && !error && students?.length > 0 && (
          <>
            {students.slice(0, 3).map((student, index) => (
              <StudentCard key={student.id} student={student} index={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(StudentParentCard);
