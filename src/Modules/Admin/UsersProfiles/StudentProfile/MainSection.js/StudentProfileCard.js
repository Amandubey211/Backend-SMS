import React, { memo, useCallback } from "react";
import profileIcon from "../../../../../Assets/DashboardAssets/profileIcon.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setLeftHeading,
  setSelectedClassName,
} from "../../../../../Store/Slices/Common/User/reducers/userSlice";

const StudentProfileCard = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  const { role } = useSelector((s) => s.common.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClassClick = useCallback(() => {
    if (!student?.presentClassId) return;

    dispatch(setSelectedClassName(student?.className));
    navigate(`/class/${student?.presentClassId}`);
  }, [dispatch, navigate, student?.presentClassId, student?.className, t]);

  return (
    <div className="flex flex-col items-center p-3 py-5 gap-2">
      <img
        src={student?.profile || profileIcon}
        alt={t("student_image")}
        className="rounded-full object-cover w-[100px] h-[100px] bg-gray-300 border"
      />

      <span className="font-bold capitalize">
        {student?.firstName ?? t("N/A")}
      </span>

      <div className="flex gap-4 text-sm font-medium text-gray-500">
        <span className="text-black">
          {t("Class")}:{" "}
          <span className="text-gray-500">
            {student?.className ?? t("N/A")}
          </span>{" "}
          <span className="text-gray-300">|</span>
        </span>
        <span className="text-black">
          {t("Section")}:{" "}
          <span className="text-gray-500">
            {student?.sectionName ?? t("N/A")}
          </span>
        </span>
      </div>

      <span>
        {t("ID")}:{" "}
        <span className="text-gray-500">
          {student?.admissionNumber ?? t("N/A")}
        </span>
      </span>

      {(role === "admin" || role === "teacher") && (
        <button
          type="button"
          onClick={handleClassClick}
          className="mt-2 border rounded-md px-9 py-1 border-red-300 cursor-pointer"
        >
          <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            {t("Class")}
          </span>
        </button>
      )}
    </div>
  );
};

export default memo(StudentProfileCard);
