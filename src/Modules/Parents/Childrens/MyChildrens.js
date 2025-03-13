import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaChild } from "react-icons/fa";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";
import { ChildCardSkeleton } from "../Skeletons";
import { setSelectedChild } from "../../../Store/Slices/Parent/Children/childrenSlice";
import { ChildCard } from "../../../Components/Parents/Children/ChildCard";

// ChildCard component defined in the same file

const MyChildren = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("prtChildrens");

  // Select necessary state slices directly (without memoization)
  const {
    children = [],
    loading,
    error,
  } = useSelector((state) => state.Parent.children);
  const userId = useSelector((state) => state.common.user.userDetails.userId);

  // Fetch children on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchChildren(userId));
    }
  }, [dispatch, userId]);

  // Handler for child card click (selects the child)
  const handleChildSelect = useCallback(
    (child) => {
      dispatch(setSelectedChild(child));
    },
    [dispatch]
  );

  const renderErrorMessage = () => {
    const isNetworkError = error?.toLowerCase().includes("network error");
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        {isNetworkError ? (
          <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
        ) : (
          <FaChild className="text-gray-400 text-8xl mb-6" />
        )}
        <p className="text-gray-600 text-lg">
          {t("Unable to fetch children data!")}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <ChildCardSkeleton count={children?.length || 3} />;
    }

    if (error) {
      return renderErrorMessage();
    }

    return (
      <div className="h-full w-full p-4">
        {/* Always show header */}
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700 ml-1">
            {t("My Children")}
          </h2>
          <div className="ml-3">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
              style={{
                background: "linear-gradient(to right, #C83B62, #7F35CD)",
              }}
            >
              <span className="text-white text-lg font-semibold">
                {children.length.toString().padStart(2, "0")}
              </span>
            </span>
          </div>
        </div>

        {/* If there are no children, show the no data message; otherwise show cards */}
        {children.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <FaChild className="text-gray-400 text-8xl mb-6" />
            <p className="text-gray-600 text-lg">{t("No Children Found!")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {children.map((child) => (
              <div
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className="cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg"
              >
                <ChildCard student={child} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default MyChildren;
