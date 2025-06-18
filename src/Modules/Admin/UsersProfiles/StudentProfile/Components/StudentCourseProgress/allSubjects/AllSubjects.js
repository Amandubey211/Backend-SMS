// Revised AllSubjects.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineFileSearch } from "react-icons/ai";
import { fetchStudentSubjectProgress } from "../../../../../../../Store/Slices/Admin/Users/Students/student.action";
import Spinner from "../../../../../../../Components/Common/Spinner";
import SubjectsCarousel from "./SubjectsCarousel";
import { useTranslation } from "react-i18next";

export default function AllSubjects({ student }) {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const { studentSubjectProgress, loading } = useSelector(
    (s) => s.admin.all_students
  );

  useEffect(() => {
    if (student?._id) {
      dispatch(fetchStudentSubjectProgress(student._id));
    }
  }, [student?._id]);

  if (loading)
    return (
      <div className="flex w-full h-60 flex-col items-center justify-center">
        <Spinner />
        <p className="text-gray-800 text-lg">{t("Loading...")}</p>
      </div>
    );

  if (!studentSubjectProgress?.length)
    return (
      <div className="flex w-full h-60 items-center justify-center flex-col text-2xl text-gray-500">
        <AiOutlineFileSearch className="text-5xl" />
        {t("No Subject Found")}
      </div>
    );

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

      {/* Frame color defined in Tailwind config (e.g., theme.colors.primary) */}
      <SubjectsCarousel
        subjects={studentSubjectProgress}
        frameColor="border-primary"
      />
    </div>
  );
}
