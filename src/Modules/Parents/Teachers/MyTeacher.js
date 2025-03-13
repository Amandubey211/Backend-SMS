import React, { useEffect } from "react";
import TeacherCards from "../../../Components/Parents/Teachers/TeacherCard";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "../../../Store/Slices/Parent/Children/children.action"; // Import the thunk
import Spinner from "../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
import { TeacherCardSkeleton } from "../Skeletons";

const MyTeacher = () => {
  const { t } = useTranslation("prtChildrens");
  const { ssid: studentId } = useParams();
  const dispatch = useDispatch();

  // Access the teacher-related data from Redux state
  const {
    teachers = [],
    loading,
    error,
  } = useSelector((state) => state.Parent.children); // Default empty array for teachers

  // Fetch teachers when component mounts or when studentId changes
  useEffect(() => {
    if (studentId) {
      dispatch(fetchTeachers(studentId));
    }
  }, [dispatch, studentId]);

  // Handling the loading state
  if (loading) {
    return <TeacherCardSkeleton count={teachers?.length || 3} />;
  }

  // Handling error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-500">
          {error}: {t("Unable to Fetch Instructors")}
        </p>
      </div>
    );
  }

  // Handling case where no teachers are found
  if (teachers?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-500">{t("No Instructors Found")}!</p>
      </div>
    );
  }

  // Render teacher cards if teachers are available
  return (
    <div className="h-full w-full p-2">
      <div className="text-lg font-medium ml-4 flex items-center">
        {t("Child Instructors")}
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
            className="text-lg font-semibold"
          >
            {teachers?.length.toString().padStart(2, "0")}{" "}
            {/* Optional chaining to prevent errors */}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-start">
        {teachers?.map((instructor) => (
          <TeacherCards key={instructor?.id} instructor={instructor} />
        ))}
      </div>
    </div>
  );
};

export default MyTeacher;
