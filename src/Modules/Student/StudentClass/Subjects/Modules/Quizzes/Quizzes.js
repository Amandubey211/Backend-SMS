import React from "react";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";

const Quizzes = () => {
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
  const className = useSelector((store) => store.Common.selectedClassName);

  useNavHeading(className, subjectName);

  return (
    <Layout title="Quizzes | Student Diwan">
      <StudentDashLayout>
        <MainSection />
      </StudentDashLayout>
    </Layout>
  );
};

export default Quizzes;
