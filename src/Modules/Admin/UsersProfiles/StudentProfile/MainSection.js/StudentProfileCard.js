import React, { memo, useCallback } from "react";
import profileIcon from "../../../../../Assets/DashboardAssets/profileIcon.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setLeftHeading,
  setSelectedClassName,
} from "../../../../../Store/Slices/Common/User/reducers/userSlice";

function StudentProfileCard({ student }) {
  const { t } = useTranslation("admAccounts");
  const { role } = useSelector((s) => s.common.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClassClick = useCallback(() => {
    if (!student?.presentClassId) return;
    dispatch(setSelectedClassName(student?.className));
    navigate(`/class/${student.presentClassId}`);
  }, [dispatch, navigate, student]);

  return (
    <section className="flex flex-col items-center gap-1 p-3 ">
      {/* Compact avatar */}
      <img
        src={student?.profile || profileIcon}
        alt={t("student_image")}
        className="w-28 h-28 rounded-full object-cover border bg-gray-200"
      />

      <h2 className="text-sm font-semibold capitalize text-center">
        {student?.firstName} {student?.lastName}
      </h2>

      <div className="flex gap-2 text-xs text-gray-600">
        <span>
          {t("Class")}: {student?.className ?? t("N/A")}
        </span>
        <span>|</span>
        <span>
          {t("Section")}: {student?.sectionName ?? t("N/A")}
        </span>
      </div>

      <p className="text-xs text-gray-600">
        {t("ID")}:{" "}
        <span className="font-medium">
          {student?.admissionNumber ?? t("N/A")}
        </span>
      </p>

      {(role === "admin" || role === "teacher") && (
        <button
          onClick={handleClassClick}
          className="mt-2 rounded-md border border-pink-200 px-4 py-1 text-xs
                     font-semibold text-pink-600 hover:bg-pink-50"
        >
          {t("Class")}
        </button>
      )}
    </section>
  );
}

export default memo(StudentProfileCard);
