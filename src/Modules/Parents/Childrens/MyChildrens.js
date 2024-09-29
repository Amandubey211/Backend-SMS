import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import Spinner from "../../../Components/Common/Spinner";
import { FaChild } from 'react-icons/fa';
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";

// Memoization for performance optimization
const MyChildren = () => {
  const dispatch = useDispatch();
  const { children, loading, error } = useSelector((state) => state.Parent.children);

  // Fetching children data using Redux thunk
  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  // Memoize children data to prevent unnecessary renders
  const memoizedChildren = useMemo(() => children, [children]);

  // Handle conditional rendering based on the state of loading, error, and children data
  const renderContent = useCallback(() => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <FaChild className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">Unable to fetch children data!</p>
        </div>
      );
    }

    if (memoizedChildren.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <FaChild className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">No Children Found!</p>
        </div>
      );
    }

    return (
      <div className="h-full w-full p-4">
        <div className="text-lg font-medium mb-4 flex items-center"> {/* Reduced font size */}
          Childs
          <div
            className="ml-2 flex items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)', // Background of the circle
              width: '32px', // Reduced circle diameter
              height: '32px', // Reduced circle diameter
            }}
          >
            <span
              style={{
                background: 'linear-gradient(to right, #C83B62 0%, #7F35CD 100%)', // Gradient text color
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              className="text-sm font-semibold"
            >
              {memoizedChildren.length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoizedChildren.map((student) => (
            <ChildCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    );
  }, [loading, error, memoizedChildren]);

  return renderContent();
};

export default React.memo(MyChildren);
