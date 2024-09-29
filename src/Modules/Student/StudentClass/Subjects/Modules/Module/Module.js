import React from "react";
import MainSection from "./MainSection";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import Layout from "../../../../../../Components/Common/Layout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Module = () => {
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
  const className = useSelector((store) => store?.Common?.selectedClassName);

  useNavHeading(className, subjectName);

  return (
    <Layout title="Module | Student Diwan">
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default Module;
