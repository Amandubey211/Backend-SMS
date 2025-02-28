import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import { FaChild } from "react-icons/fa";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";
import { ChildCardSkeleton } from "../Skeletons";
import { setSelectedChild } from "../../../Store/Slices/Parent/Children/childrenSlice";

const MyChildren = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("prtChildrens");

  // Select necessary state slices
  const { children = [], loading, error } = useSelector(
    (state) => state.Parent.children
  );
  const userId = useSelector((state) => state.common.user.userDetails.userId);

  // Fetch children on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchChildren(userId));
    }
  }, [dispatch, userId]);

  const memoizedChildren = useMemo(() => children, [children]);

  // Handler for child card click
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
        <p className="text-gray-600 text-lg">{t("Unable to fetch children data!")}</p>
      </div>
    );
  };

  const renderContent = useCallback(() => {
    if (loading) {
      return <ChildCardSkeleton count={memoizedChildren?.length || 2} />;
    }

    if (error) {
      return renderErrorMessage();
    }

    if (memoizedChildren?.length === 0) {
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
          {t("Childs")}
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
                background: "linear-gradient(to right, #C83B62 0%, #7F35CD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="text-sm font-semibold"
            >
              {memoizedChildren?.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Responsive grid for child cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoizedChildren?.map((child) => (
            <div
              key={child.id}
              onClick={() => handleChildSelect(child)}
              className="cursor-pointer"
            >
              <ChildCard student={child} />
            </div>
          ))}
        </div>
      </div>
    );
  }, [loading, error, memoizedChildren, t, handleChildSelect]);

  return <>{renderContent()}</>;
};

export default React.memo(MyChildren);
