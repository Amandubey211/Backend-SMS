// src/pages/MainSection.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  stdRubric
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


const MainSection = () => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { sid } = useParams();

  // Fix: Corrected state selection
  const studentRubricState = useSelector((state) => state.student.studentRubric) || {};

  console.log("Student Rubric State:", studentRubricState); // Debugging line

  const { RubricData = [], loading, isModalOpen } = studentRubricState;

  useEffect(() => {
    if (sid) {
      dispatch(stdRubric({ subjectId: sid }));
    }
  }, [sid, dispatch]);

  const handleViewRubric = (id) => {
    dispatch(resetRubricState());
    dispatch(setRubricField({ field: "readonlyMode", value: true }));
    dispatch(setRubricField({ field: "isModalOpen", value: true }));
  };

  return (
    <div className="w-full h-full flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        {RubricData?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {RubricData.map((rubric) => (
              <RubricCard key={rubric._id} rubric={rubric} onView={handleViewRubric} />
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
        {/* Fix: Conditionally rendering modal instead of just showing isModalOpen */}
        {/* {isModalOpen && <YourModalComponent />} */}
      </div>
    </div>
  );
};
export default MainSection;
