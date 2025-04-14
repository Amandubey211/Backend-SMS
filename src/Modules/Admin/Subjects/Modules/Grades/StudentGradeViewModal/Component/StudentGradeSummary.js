import React from "react";
import profileIcon from "../../../../../../../Assets/DashboardAssets/profileIcon.png";
import { useTranslation } from "react-i18next";

const StudentGradeSummary = ({ grades, studentData }) => {
  const { t } = useTranslation("admAccounts");

  return (
    <div className="flex-none w-1/4 border-l">
      <div className="text-center border-b p-4">
        <img
          className="w-24 h-24 rounded-full mx-auto"
          src={studentData?.profile || profileIcon}
          alt={t("Profile")}
        />
        <h2 className="mt-4 text-lg font-semibold">{studentData?.fullName}</h2>
      </div>
      {/* Enhanced Total Score UI */}
      <div className="mt-4 p-4 ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{t("Total Score")}</p>
          <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold px-4 py-2 rounded-full shadow-lg">
            {grades?.total}
          </span>
        </div>
      </div>
      <div className="mt-4 p-3 ">
        <h3 className="text-md font-semibold mb-4">{t("Grade Summary")}</h3>
        <div className="flex justify-between mb-2">
          <p className="text-sm">{t("Assignment")}</p>
          <p className="text-sm">
            {grades?.totalScoreOfSubmitAssignments} /{" "}
            {grades?.totalScoreOfAllAssignments}
          </p>
        </div>
        {/* <div className="flex justify-between mb-2">
          <p className="text-sm">{t("Group Assignment")}</p>
          <p className="text-sm">
            {grades?.submittedGroupAssignmentScore} /{" "}
            {grades?.totalGroupAssignmentScore}
          </p>
        </div> */}
        <div className="flex justify-between mb-2">
          <p className="text-sm">{t("Quiz")}</p>
          <p className="text-sm">
            {grades?.totalQuizCompletedScore} / {grades?.totalScoreOfAllQuizzes}
          </p>
        </div>
        {/* <div className="flex justify-between mb-2">
          <p className="text-sm">{t("Group Quiz")}</p>
          <p className="text-sm">
            {grades?.submittedGroupQuizScore} / {grades?.totalGroupQuizScore}
          </p>
        </div> */}
        <div className="flex justify-between mb-2">
          <p className="text-sm">{t("Offline Exam")}</p>
          <p className="text-sm">
            {grades?.totalScoreOfOfflineExams} / {grades?.totalOfflineExams}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">{t("Attendance")}</p>
          <p className="text-sm">
            {grades?.attendance} {t("DAY")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentGradeSummary;
