import React, { memo, useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { FaSync } from "react-icons/fa";
import { Tooltip, Skeleton, Empty, Select } from "antd"; // Import Select from antd
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { fetchTopStudents } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";

import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const { Option } = Select;

const TopRankingStudents = () => {
  const { t } = useTranslation("admTopRanking");
  const dispatch = useDispatch();

  // Safe optional access to Redux states
  const {
    topStudents = [],
    loadingTopStudents,
    errorTopStudents,
  } = useSelector((state) => state?.admin?.adminDashboard ?? {});

  const { classes = [], loading: loadingClasses } = useSelector(
    (store) => store?.admin?.class ?? {}
  );

  const [selectedClass, setSelectedClass] = useState("");

  // Helper to safely truncate admission number
  const truncateAdmNumber = (adm = "") => {
    const maxLength = 7;
    return adm.length > maxLength ? adm.slice(0, maxLength) + "..." : adm;
  };

  // Fetch classes if not done; fetch top students once classes load
  useEffect(() => {
    // If you need to ensure classes are fetched, uncomment below:
    // dispatch(fetchAllClasses());

    if (classes?.length > 0) {
      const initialClassId = classes[0]?._id ?? "";
      setSelectedClass(initialClassId);
      dispatch(fetchTopStudents(initialClassId));
    }
  }, [dispatch, classes]);

  // Handler for changing the class in AntD Select
  const handleSelectChange = (value) => {
    setSelectedClass(value);
    dispatch(fetchTopStudents(value));
  };

  // Reset filter to the first class
  const handleResetFilter = () => {
    if (classes.length > 0) {
      const firstClassId = classes[0]._id ?? "";
      setSelectedClass(firstClassId);
      dispatch(fetchTopStudents(firstClassId));
    }
  };

  // Combine loading states
  const isLoading = loadingTopStudents || loadingClasses;

  // Check if there's no data or an error
  const noData = (topStudents?.length ?? 0) === 0 || errorTopStudents;

  // Skeleton for top 3 placeholders
  const renderTop3Skeleton = () => (
    <div className="flex w-full h-auto py-2 gap-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`top-skeleton-${idx}`}
          className="text-center p-4 border rounded-lg relative w-[30%]"
        >
          <div className="relative mt-10 flex flex-col items-center">
            <Skeleton.Avatar active size={56} shape="circle" />
            <Skeleton
              active
              title={false}
              paragraph={{
                rows: 2,
                width: ["60%", "80%"],
              }}
              className="mt-4 w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Skeleton for the remaining list
  const renderListSkeleton = () => (
    <div className="flex flex-col gap-2 mt-2">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`list-skeleton-${idx}`}
          className="flex items-center justify-between p-2 px-5 border rounded-md w-full gap-2"
        >
          {/* The left portion: rank + avatar + name */}
          <div className="flex items-center w-[40%]">
            <Skeleton.Input active style={{ width: 24 }} />
            <Skeleton.Avatar active size={40} shape="circle" className="ml-6" />
            <Skeleton.Input active style={{ width: 80, marginLeft: 8 }} />
          </div>
          {/* Score */}
          <div className="ml-20">
            <Skeleton.Input active style={{ width: 80 }} />
          </div>
          {/* Admission Number */}
          <div className="w-[30%] ml-2">
            <Skeleton.Input active style={{ width: 80 }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.GET_TOP_STUDENTS}
      title={t("Top Student")}
    >
      <div className="bg-white p-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {t("Top Ranking Students")}
          </h2>

          {/* Class Selector using Ant Design Select with a light pink background */}
          <Select
            value={selectedClass}
            onChange={handleSelectChange}
            disabled={isLoading}
          >
            {classes?.map((c) => (
              <Option key={c?._id} value={c?._id}>
                {c?.className || t("N/A")}
              </Option>
            ))}
          </Select>
        </div>

        {/* Content: Loading / Error / No Data / Actual Data */}
        {noData && !isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full mt-10 py-20 text-gray-400 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_DEFAULT}
              description={
                <span className="text-lg text-gray-500">
                  {errorTopStudents
                    ? t("Error while fetching")
                    : t("No Data Found")}
                </span>
              }
            />
            {/* Spinning icon to reset filter */}
            {/* <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            >
              <FaSync className="animate-spin" />
              <span className="font-medium">{t("Reset Filter")}</span>
            </button> */}
          </div>
        ) : isLoading ? (
          <>
            {/* SKELETON UI for top 3 and list */}
            {renderTop3Skeleton()}
            {renderListSkeleton()}
          </>
        ) : (
          <>
            {/* Actual Data: Top 3 Students */}
            <div className="flex w-full h-auto py-2 gap-4">
              {topStudents?.slice(0, 3)?.map((student, index) => {
                const truncatedNumber = truncateAdmNumber(
                  student?.admissionNumber ?? ""
                );

                return (
                  <div
                    key={student?._id ?? index}
                    className="text-center p-4 border rounded-lg relative w-[30%]"
                  >
                    {/* Crown for 1st */}
                    {index === 0 && (
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{ top: "25px" }}
                      >
                        <FaCrown className="w-20 h-8 text-yellow-400" />
                      </div>
                    )}

                    {/* Profile Image + Top 2/3 Label */}
                    <div className="relative mt-10">
                      <img
                        className="w-14 h-14 rounded-full mx-auto"
                        src={student?.studentProfile ?? profileIcon}
                        alt={student?.studentName ?? t("N/A")}
                      />
                      {index !== 0 && (
                        <h3 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-md mb-1 font-medium bg-white px-2">
                          {t("Top")} {index === 1 ? 2 : 3}
                        </h3>
                      )}
                    </div>

                    {/* Student Name */}
                    <div>
                      {student?.studentName?.slice(0, 10) || t("0")}
                      {student?.studentName?.length > 10 && (
                        <span title={student?.studentName}>...</span>
                      )}
                    </div>

                    {/* Admission Number with Tooltip */}
                    <p className="mb-2 text-sm">
                      {t("Adm")}:{" "}
                      <Tooltip title={student?.admissionNumber ?? t("N/A")}>
                        <span className="text-gray-600 text-sm">
                          {truncatedNumber || t("N/A")}
                        </span>
                      </Tooltip>
                    </p>

                    {/* Score */}
                    <span
                      style={{
                        background:
                          "linear-gradient(to right, #fce7f3, #e9d5ff)",
                      }}
                      className="px-3 rounded-sm"
                    >
                      <span
                        style={{
                          background:
                            "linear-gradient(to right, #f43f5e, #8b5cf6)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {t("Score")}:{" "}
                        {student?.score ? `${student.score} %` : t("0")}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Remaining Students */}
            <div className="flex flex-col gap-2">
              {topStudents
                ?.slice((topStudents?.length ?? 0) > 3 ? 3 : 0)
                ?.map((student, index) => {
                  const truncatedNumber = truncateAdmNumber(
                    student?.admissionNumber ?? ""
                  );

                  return (
                    <div
                      key={student?._id ?? `remaining-${index}`}
                      className="flex items-center justify-between p-2 px-5 border rounded-md w-full gap-2"
                    >
                      {/* Rank + Profile + Student Name */}
                      <div className="flex items-center w-[40%]">
                        <span className="mr-3">{index + 4}</span>
                        <img
                          className="w-10 h-10 rounded-full mr-4"
                          src={student?.studentProfile ?? profileIcon}
                          alt={student?.studentName ?? t("N/A")}
                        />
                        <span>
                          {student?.studentName?.slice(0, 15) || t("0")}
                          {student?.studentName?.length > 15 && (
                            <span title={student?.studentName}>...</span>
                          )}
                        </span>
                      </div>

                      {/* Score */}
                      <div
                        className="rounded-sm w-auto"
                        style={{
                          background:
                            "linear-gradient(to right, #fce7f3, #e9d5ff)",
                        }}
                      >
                        <span
                          style={{
                            background:
                              "linear-gradient(to right, #f43f5e, #8b5cf6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                          className="px-3"
                        >
                          {t("Score")}:{" "}
                          {student?.score ? `${student.score} %` : t("0")}
                        </span>
                      </div>

                      {/* Admission Number */}
                      <div className="w-[30%]">
                        <span>
                          {t("Adm")}:{" "}
                          <Tooltip title={student?.admissionNumber ?? t("N/A")}>
                            <span className="text-gray-600 ml-1">
                              {truncatedNumber || t("N/A")}
                            </span>
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </ProtectedSection>
  );
};

export default memo(TopRankingStudents);
