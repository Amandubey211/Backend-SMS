import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineFileSearch } from "react-icons/ai";
import { fetchStudentSubjectProgress } from "../../../../../../../Store/Slices/Admin/Users/Students/student.action";
import SubjectsCarousel from "./SubjectsCarousel";
import SkeletonSubjectCard from "./SkeletonSubjectCard";
import { useTranslation } from "react-i18next";

export default function AllSubjects({ student }) {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const { studentSubjectProgress, loading } = useSelector(
    (s) => s.admin.all_students
  );

  /* Fetch on mount / student change */
  useEffect(() => {
    if (student?._id) dispatch(fetchStudentSubjectProgress(student._id));
  }, [dispatch, student?._id]);

  /* ── Loading shimmer ─────────────────────────────────── */
  if (loading)
    return (
      <div className="px-4">
        <header className="mb-4">
          <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-48 mt-2 rounded-md bg-gray-200 animate-pulse" />
        </header>

        {/* four fake cards to match layout */}
        <div className="relative w-full">
          <ul className="flex flex-nowrap gap-4 overflow-x-hidden py-2 px-1">
            {[1, 2, 3, 4].map((k) => (
              <li key={k} className="flex-none w-full sm:w-1/2 lg:w-1/4">
                <SkeletonSubjectCard />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

  /* ── Empty state ─────────────────────────────────────── */
  if (!studentSubjectProgress?.length)
    return (
      <div className="flex w-full h-60 items-center justify-center flex-col text-2xl text-gray-500">
        <AiOutlineFileSearch className="text-5xl" />
        {t("No Subject Found")}
      </div>
    );

  /* ── Success state ───────────────────────────────────── */
  return (
    <div className="px-4">
      <header className="mb-4">
        <h2 className="font-bold text-gray-900">{t("My Courses")}</h2>
        <p className="text-gray-500 text-sm">
          {t("A total of {{count}} courses are in progress", {
            count: studentSubjectProgress.length,
          })}
        </p>
      </header>

      <SubjectsCarousel
        subjects={studentSubjectProgress}
        frameColor="border-primary"
      />
    </div>
  );
