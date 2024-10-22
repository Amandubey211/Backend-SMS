import React from "react";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import Layout from "../../../../../../Components/Common/Layout";
import { useSelector } from "react-redux";

const Assignment = () => {
  const { subjectName } = useSelector((store) => store?.student?.studentSubject?.subject);
  const { classData } = useSelector((store) => store?.student?.studentClass);
  const className=classData?.className;

  useNavHeading(className, subjectName);

  return (
    <Layout title="Assignment | student diwan">
      <StudentDashLayout hideSearchbar={true} children={<MainSection />} />
    </Layout>
  );
};

export default Assignment;
