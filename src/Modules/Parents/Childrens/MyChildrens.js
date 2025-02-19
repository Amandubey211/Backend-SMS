import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import Spinner from "../../../Components/Common/Spinner";
import { Skeleton } from "antd";
import { FaChild } from "react-icons/fa";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";

// Child Card Skeleton (Dynamically rendered based on child count)
const ChildCardSkeleton = ({ count }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center"
          style={{
            minHeight: "270px", // Adjusted to match real card
            maxWidth: "100%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Profile Image */}
          <Skeleton.Avatar active size={90} shape="circle" />

          {/* Name */}
          <Skeleton.Input active size="small" style={{ width: "55%", marginTop: "12px" }} />

          {/* Class, ID, Section, Group */}
          <div className="flex justify-center mt-2 space-x-3">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "15%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </div>

          {/* Buttons (INSTRUCTORS, GRADES, ATTENDANCE) */}
          <div className="flex justify-center mt-4 space-x-4">
            <Skeleton.Button active size="small" shape="round" style={{ width: 110, height: 40, borderRadius: "8px" }} />
            <Skeleton.Button active size="small" shape="round" style={{ width: 110, height: 40, borderRadius: "8px" }} />
            <Skeleton.Button active size="small" shape="round" style={{ width: 110, height: 40, borderRadius: "8px" }} />
          </div>

          {/* Big Button (CHECK SUBJECT PROGRESS) */}
          <div className="flex justify-center mt-5">
            <Skeleton.Button active size="large" shape="round" style={{ width: "85%", height: 48, borderRadius: "12px" }} />
          </div>
        </div>
      ))}
    </div>
  );
};




const MyChildren = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("prtChildrens");

  // Select necessary state slices
  const { children = [], loading, error } = useSelector((state) => state?.Parent?.children || {});
  const userId = useSelector((state) => state?.Auth?.user?.id);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (userId && !hasFetched.current) {
      dispatch(fetchChildren(userId));
      hasFetched.current = true;
    }
  }, [dispatch, userId]);

  const memoizedChildren = useMemo(() => children, [children]);

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
          <div className="ml-2 flex items-center justify-center rounded-full" style={{ background: "linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)", width: "32px", height: "32px" }}>
            <span style={{ background: "linear-gradient(to right, #C83B62 0%, #7F35CD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} className="text-sm font-semibold">
              {memoizedChildren?.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Render Actual Child Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoizedChildren?.map((student) => (
            <ChildCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    );
  }, [loading, error, memoizedChildren, t]);

  return <>{renderContent()}</>;
};

export default React.memo(MyChildren);
