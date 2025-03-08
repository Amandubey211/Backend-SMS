import React, { useEffect, useState, memo } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import icon1 from "../../../../Assets/DashboardAssets/Images/image1.png";
import icon2 from "../../../../Assets/DashboardAssets/Images/image2.png";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import { Skeleton, Empty } from "antd";

const icons = [icon1, icon2];

const generateRandomColor = () => {
  const colors = [
    "rgba(255, 122, 165, 0.8)",
    "rgba(255, 91, 146, 0.8)",
    "#33C4FE",
    "#36D5FF",
    "#FBB778",
    "#F9B279",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const NoticeBoard = (descriptionLength) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  // Get notices data from Redux state
  const {
    loadingNotices: loading,
    errorNotices: error,
    notices,
  } = useSelector((state) => state.admin.adminDashboard);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  // If loading, show skeleton (shimmer) UI
  if (loading) {
    return (
      <ProtectedSection
        requiredPermission={PERMISSIONS.SHOW_EVENTS}
        title={"Notices"}
      >
        <div className="p-2">
          {/* Header Skeleton */}
          <div className="flex justify-between p-4 items-center px-6">
            <Skeleton.Input active style={{ width: 200, height: 24 }} />
            <Skeleton.Button active style={{ width: 100, height: 32 }} />
          </div>
          {/* Skeleton for Notice cards (render exactly 3) */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`notice-skeleton-${idx}`}
                className="w-[97%] p-3 my-3 border shadow-md border-gray-200 rounded-lg flex min-h-[80px]"
              >
                {/* Left Icon Skeleton */}
                <div className="pr-3 flex-shrink-0">
                  <Skeleton.Avatar active size={56} shape="circle" />
                </div>
                {/* Right Content Skeleton */}
                <div className="flex flex-col flex-grow">
                  {/* Title & Priority Row */}
                  <div className="flex items-center justify-between">
                    <Skeleton.Input
                      active
                      style={{ width: "70%", height: 20 }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: "25%", height: 16 }}
                    />
                  </div>
                  {/* Posted by Row */}
                  <div className="mt-2">
                    <Skeleton.Input
                      active
                      style={{ width: "50%", height: 16 }}
                    />
                  </div>
                  {/* Content Snippet Row */}
                  <div className="mt-2">
                    <Skeleton.Input
                      active
                      style={{ width: "80%", height: 16 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProtectedSection>
    );
  }

  // If there's an error, show error state
  if (error) {
    return (
      <ProtectedSection
        requiredPermission={PERMISSIONS.SHOW_EVENTS}
        title={"Notices"}
      >
        <div className="flex flex-col items-center justify-center my-10">
          <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-xl">
            {t("Error while fetching notices")}
          </p>
        </div>
      </ProtectedSection>
    );
  }

  // Process notices data
  const noticesArray = Array.isArray(notices) ? [...notices] : [];
  const noticesSort = noticesArray.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
  const topNotices = noticesSort.slice(0, 3);

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.SHOW_EVENTS}
      title={"Notices"}
    >
      <div className="p-2">
        <div className="flex justify-between p-4 items-center px-6">
          <h2 className="text-xl font-semibold text-gray-600">
            {t("Notice Board")}
          </h2>
          <button
            className="text-black border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300 ease-in-out"
            onClick={() => navigate("/noticeboard/notice")}
          >
            {t("View All")}
          </button>
        </div>
        {topNotices?.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-10">
            <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500 text-xl">
              {t("No noticeboard data found")}
            </p>
          </div>
        ) : (
          topNotices.map((notice, index) => (
            <Notice
              key={index}
              image={icons[index % icons.length]}
              title={notice?.title}
              authorName={notice?.authorName}
              date={new Date(notice?.startDate).toLocaleDateString()}
              priority={notice?.priority}
              content={notice?.description}
              backgroundColor={generateRandomColor()}
              descriptionLength={descriptionLength}
            />
          ))
        )}
      </div>
    </ProtectedSection>
  );
};

export default memo(NoticeBoard);
