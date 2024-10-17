import React from "react";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../../../../Components/Student/StudentDashLayout";
import Layout from "../../../../../../../Components/Common/Layout";
import { useSelector } from "react-redux";

const AssignmentList = () => {
  const { subjectName } = useSelector((store) => store?.student?.studentSubject?.subject);
  const { classData } = useSelector((store) => store?.student?.studentClass);
  const className=classData?.className;
  
  useNavHeading(className, subjectName);

  return (
    <Layout title={`Assignments | Student Diwan`}>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default AssignmentList;
