import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import Spinner from "../../../Components/Common/Spinner";
import { FaChild } from 'react-icons/fa';
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const MyChildren = () => {
  const dispatch = useDispatch();

  // Select necessary state slices
  const { children = [], loading, error } = useSelector((state) => state?.Parent?.children || {});
  const userId = useSelector((state) => state?.Auth?.user?.id);

  const { t } = useTranslation('prtChildrens');

  // useRef to track if fetchChildren has been dispatched
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only dispatch if userId is available and fetchChildren hasn't been called yet
    if (userId && !hasFetched.current) {
      dispatch(fetchChildren(userId));
      hasFetched.current = true; // Set the flag to true to prevent future dispatches
    }
  }, [dispatch, userId]);

  // Memoize children data to prevent unnecessary renders
  const memoizedChildren = useMemo(() => children, [children]);

  // Error message rendering for children
  const renderErrorMessage = () => {
    const isNetworkError = error?.toLowerCase().includes("network error");

    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        {isNetworkError ? (
          <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
        ) : (
          <FaChild className="text-gray-400 text-8xl mb-6" />
        )}
        <p className="text-gray-600 text-lg text-center mt-2">
          {error ? `${error}: ` : ""}
          {t("Unable to fetch children data!")}
        </p>
      </div>
    );
  };

  // Handle conditional rendering based on the state of loading, error, and children data
  const renderContent = useCallback(() => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return renderErrorMessage(); // Render error message when there's an error
    }

    if (memoizedChildren.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <FaChild className="text-gray-400 text-8xl mb-6" />
          <p className="text-gray-600 text-lg">{t("No Children Found!")}</p>
        </div>
      );
    }

    return (
      <div className="h-full w-full p-4">
        <div className="text-lg font-medium mb-4 flex items-center">
          {/* Title with children count */}
          {t("Childs")} {/* Translation applied for "Childs" */}
          <div
            className="ml-2 flex items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)',
              width: '32px',
              height: '32px',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(to right, #C83B62 0%, #7F35CD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              className="text-sm font-semibold"
            >
              {memoizedChildren.length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Children grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoizedChildren?.map((student) => (
            <ChildCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    );
  }, [loading, error, memoizedChildren, t]);

  return renderContent();
};

export default React.memo(MyChildren);
