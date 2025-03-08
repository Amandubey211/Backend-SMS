import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
import MainSection from "./MainSection";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";

const Rubric = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );
  const subjectName = useSelector(
    (store) => store.common.user.subjectInfo.selectedSubjectName
  );

  useNavHeading(className, subjectName);
  return (
    <Layout title="Rubric | Student Diwan">
      <StudentDashLayout>
        <MainSection />
      </StudentDashLayout>
    </Layout>
  );
};

export default Rubric;
