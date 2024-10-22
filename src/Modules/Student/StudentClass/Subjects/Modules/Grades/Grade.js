import React from "react";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Grade = () => {
  const { subjectName } = useSelector((store) => store?.student?.studentSubject?.subject);
  const { classData } = useSelector((store) => store?.student?.studentClass);
  const className=classData?.className;

  // useNavHeading(cid, sid);
  useNavHeading(className, subjectName);
  return (
    <Layout title={`Grade | Student Diwan`}>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default Grade;
