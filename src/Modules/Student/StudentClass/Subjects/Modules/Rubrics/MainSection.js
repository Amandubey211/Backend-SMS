// src/pages/MainSection.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  stdRubric,
  getStudentRubricByIdThunk
} from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Rubric/rubric.action";
import {
  setRubricField,
  resetRubricState,
} from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Rubric/rubricSlice";
import RubricCard from "./Components/RubricCard";
import SubjectSideBar from "../../Component/SubjectSideBar";
// import Spinner from "../../../../../Components/Common/Spinner"; // We won't need the spinner anymore
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useTranslation } from "react-i18next";
import { FaClipboardList } from "react-icons/fa";
import RubricModal from "./Components/RubricModal";


const MainSection = () => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { sid } = useParams();

  // Fix: Corrected state selection
  const studentRubricState = useSelector((state) => state.student.studentRubric) || {};

  console.log("Student Rubric State:", studentRubricState); // Debugging line

  const { RubricData = [], loading, isModalOpen, readonlyMode, criteria, rubricName, totalPoints, rubricLoading } = studentRubricState;

  useEffect(() => {
    if (sid) {
      dispatch(stdRubric({ subjectId: sid }));
    }
  }, [sid, dispatch]);

  const handleViewRubric = (rubric) => {
    dispatch(resetRubricState());
    dispatch(setRubricField({ field: "readonlyMode", value: true }));
    dispatch(setRubricField({ field: "isModalOpen", value: true }));
    console.log('rubric--', rubric);

    const rubricId = rubric.assignmentId?._id || rubric.quizId?._id;
    if (rubricId) {
      dispatch(getStudentRubricByIdThunk({id:rubricId}));
    } else {
      console.error("No valid ID found for rubric");
    }
  };

  return (
    <div className="w-full h-full flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        {RubricData?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {RubricData?.map((rubric) => (
              <RubricCard key={rubric?._id} rubric={rubric} onView={() => handleViewRubric(rubric)} />
            ))}
          </div>
        ) : (
          <NoDataFound
            title={t("Rubrics")}
            desc={"Click 'Add New Rubric' to define your evaluation criteria."}
            icon={FaClipboardList}
            iconColor="text-blue-500"
            textColor="text-gray-700"
            bgColor="bg-gray-100"
          />
        )}
        {isModalOpen && (
          <RubricModal
          isOpen={isModalOpen}
          rubric={studentRubricState.selectedRubric}
          onClose={() => dispatch(setRubricField({ field: "isModalOpen", value: false }))}
          loading={rubricLoading}
          />
        )}
      </div>
    </div>
  );
};
export default MainSection;
