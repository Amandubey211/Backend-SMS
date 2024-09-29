import React from "react";
import Layout from "../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";

const StudentClass = () => {
  const { classData} = useSelector((store) => store?.student?.studentClass);

  const className=classData?.className;
  useNavHeading(`My Class - ${className}`);

  return (
    <Layout title={`My Class - ${className} | Student diwan`}>
      <StudentDashLayout children={<MainSection />} />;
    </Layout>
  );
};

export default StudentClass;
