


import React from "react";
import MainSection from "./MainSection";
import { useParams,useLocation } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";

const Quizzes = () => {
  const { cid, sid } = useParams();
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
    const className = useSelector((store) => store.Common.selectedClassName);

  const location = useLocation();
  const quiz = location.state?.quiz;  // Accessing the quiz data from state
  console.log("quiz iis " ,quiz)
  // useNavHeading(cid, sid);
  useNavHeading(className, subjectName);

  return (
    <Layout title="Quizzes | Student Diwan">
      <StudentDashLayout>
        <MainSection quiz={quiz} /> {/* Passing the quiz data to MainSection as a prop */}
      </StudentDashLayout>
    </Layout>
  );
};

export default Quizzes;
