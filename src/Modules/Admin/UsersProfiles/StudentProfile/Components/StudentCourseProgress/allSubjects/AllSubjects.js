import React, { useEffect } from "react";
import SubjectsSlider from "./SubjectsSlider";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import { fetchStudentSubjectProgress } from "../../../../../../../Store/Slices/Admin/Users/Students/student.action";
import Spinner from "../../../../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";

const AllSubjects = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  const { studentSubjectProgress, loading } = useSelector(
    (store) => store.admin.all_students
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(student?._id));
  }, []);

  return loading ? (
    <div className="flex w-full h-[80vh] flex-col items-center justify-center">
      <Spinner />
      <p className="text-gray-800 text-lg">{t("Loading...")}</p>
    </div>
  ) : (
    <div className="px-4">
      <div className="flex flex-1 flex-col p-4">
        <span className="font-bold text-gray-900">{t("My Courses")}</span>
        <span className="text-gray-500">
          {t("A total of {{count}} courses are in progress", {
            count: studentSubjectProgress?.length,
          })}
        </span>
      </div>
      {studentSubjectProgress?.length > 0 ? (
        <SubjectsSlider subjects={studentSubjectProgress} />
      ) : (
        <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-2xl">
          <GoAlertFill className="text-[5rem]" />
          {t("No Subject Found")}
        </div>
      )}
    </div>
  );
};

export default AllSubjects;
