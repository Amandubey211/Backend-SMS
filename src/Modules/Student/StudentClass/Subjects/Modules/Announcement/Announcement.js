import React from "react";
import MainSection from "./MainSection";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import Layout from "../../../../../../Components/Common/Layout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Announcement = () => {
  const { subjectName } = useSelector((store) => store?.student?.studentSubject?.subject);
  const { classData } = useSelector((store) => store?.student?.studentClass);
  const className=classData?.className;

  useNavHeading(className, subjectName);

  return (
    <Layout title={`Announcement | Student Diwan`}>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default Announcement;
